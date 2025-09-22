// Client-side Gemini helper (no backend). Note: Exposes API key to browser; use only if acceptable.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Structured output schema (Genkit-style via Zod)
export const EcoAnalysisSchema = z.object({
  category: z
    .string()
    .describe(
      "Eco action category, e.g., tree_planting | recycling | cleanup | water_saving | energy_saving | other"
    ),
  isTrue: z
    .boolean()
    .describe("Whether the video likely shows a real eco action"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Model confidence between 0 and 1"),
  reasoning: z
    .string()
    .min(5)
    .max(800)
    .describe("Short explanation of the decision"),
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // result is like: data:<mime>;base64,<data>
      const base64 = typeof result === "string" ? result.split(",")[1] : "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeVideoClient(file, extraContext = "") {
  if (!file) throw new Error("file is required");
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY (client)");

  const b64 = await fileToBase64(file);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    `You are an environmental verification assistant. Assess whether this video shows a real eco action (tree planting, water saving, recycling, cleanup, energy saving, etc.).\n` +
    `Return ONLY JSON matching this schema: { "category": string, "isTrue": boolean, "confidence": number (0..1), "reasoning": string }.\n` +
    `- Use lowercase snake_case for category.\n` +
    `- Do not include any markdown, backticks, or commentary—JSON only.\n` +
    `${extraContext || ""}`;

  const responseSchema = {
    type: "object",
    properties: {
      category: { type: "string" },
      isTrue: { type: "boolean" },
      confidence: { type: "number" },
      reasoning: { type: "string" },
    },
    required: ["category", "isTrue", "confidence", "reasoning"],
  };

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: b64,
              mimeType: file.type || "video/mp4",
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = result.response.text();

  // Try to parse JSON robustly
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (err) {
        parsed = undefined;
      }
    }
  }

  // Validate with Zod and return structured result with errors if any
  const errors = [];
  let data;
  if (parsed) {
    const check = EcoAnalysisSchema.safeParse(parsed);
    if (check.success) {
      data = check.data;
    } else {
      data = parsed; // pass through whatever we got
      errors.push(
        ...check.error.errors.map(
          (e) => `${e.path.join(".") || "root"}: ${e.message}`
        )
      );
    }
  } else {
    errors.push("Model did not return valid JSON.");
  }

  const description = data?.category
    ? `Detected category: ${data.category} | Confidence: ${
        typeof data.confidence === "number"
          ? Math.round(data.confidence * 100)
          : "?"
      }% | Verdict: ${data.isTrue ? "Valid" : "Not valid"}`
    : "No structured result available.";

  return {
    ok: errors.length === 0,
    data,
    errors,
    rawText: text,
    description,
  };
}
