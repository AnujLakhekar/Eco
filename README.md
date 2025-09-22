# Eco

A Vite + React app with Firebase and a serverless endpoint for Gemini-based eco action verification.

## Environment setup

1. Copy `.env.example` to `.env` and fill in the values:

```
cp .env.example .env
```

Then add your keys:

```
# Firebase (client-side)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Gemini (server-side)
# Either variable name works; the API reads the first available one.
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
GEMINI_API_KEY=your-key-here
```

2. Do not commit real secrets. This repo's `.gitignore` already excludes `.env`.

3. Vercel deployment: add one of the above keys under Project Settings → Environment Variables. Name it either `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY`.

## Development

- Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

- The serverless API endpoint is at `/api/analyze-video` and consumes `multipart/form-data` with a `video` file field.

## Notes

- Large video files may exceed inline limits; consider Gemini File API for production.
- Keep API keys server-side only; never expose them to client code.
