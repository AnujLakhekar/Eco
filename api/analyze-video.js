import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = formidable({ multiples: false, maxFileSize: 1024 * 1024 * 200 }); // 200MB
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing Gemini API key" });

    const { files, fields } = await parseForm(req);
    const file = files?.video;
    if (!file) return res.status(400).json({ error: "video file is required (field name 'video')" });

    // Read file from temp path and base64 encode (simple demo approach)
    const fs = await import("node:fs");
    const data = fs.readFileSync(file.filepath);
    const b64 = Buffer.from(data).toString("base64");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an environmental verification assistant. Analyze whether this video shows a real eco action (tree planting, water saving, recycling, cleanup, etc.).
Return ONLY JSON with keys: {category, isTrue, confidence, reasoning}.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: b64,
          mimeType: file.mimetype || "video/mp4",
        },
      },
    ]);

    const text = result.response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      json = match ? JSON.parse(match[0]) : { raw: text };
    }
    return res.status(200).json(json);
  } catch (err) {
    console.error("/api/analyze-video error", err);
    return res.status(500).json({ error: "Internal error", details: err?.message });
  }
}
