# PLANT-X Botanical Research Backend

Express REST API server powering the PLANT-X Botanical Early-Warning Plant Stress Platform.

## Endpoints

- `GET /api/health` — Health check, returns platform telemetry and Gemini API status.
- `POST /api/analyze-plant` — Multimodal botanical photo evaluation with Gemini 3.8 Flash Vision (health score, stress risk, chlorophyll index, necrotic area, leaf condition, diagnosis).
- `POST /api/chat` — Dr. Xylem botanical research assistant chat session with telemetry context.

## Setup & Running

```bash
cd backend
npm install
npm run dev
```

Ensure `GEMINI_API_KEY` is provided in your `.env` or environment variables.
