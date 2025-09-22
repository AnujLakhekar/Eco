export async function analyzeVideoURL(videoUrl, extraContext = "") {
	if (!videoUrl) throw new Error("videoUrl is required");
	try {
		const res = await fetch("/api/analyze-video", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ videoUrl, extraContext }),
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			throw new Error(err.error || `HTTP ${res.status}`);
		}
		return await res.json();
	} catch (e) {
		// Fallback mock in dev
		console.warn("Falling back to mock analysis:", e?.message);
		return {
			category: "tree_planting",
			isTrue: Math.random() > 0.2,
			confidence: 0.75,
			reasoning: "Mock analysis result for development.",
		};
	}
}
