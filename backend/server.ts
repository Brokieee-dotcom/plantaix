import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'PLANT-X Botanical Research Backend Engine',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/analyze-plant', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', plantName, species, experimentGroup } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Missing imageBase64 in request body' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to edge model.',
      });
      return;
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const promptText = `You are the lead botanical vision diagnostic model for the PLANT-X Early-Warning Plant Stress Platform.
Analyze this high-resolution botanical photograph.
Context:
Plant Identifier: "${plantName || 'Specimen'}"
Botanical Species: "${species || 'Unknown Flora'}"
Research Group: "${experimentGroup || 'Observational'}"

Evaluate the plant carefully for:
1. Overall Health Score (0 - 100)
2. Stress Risk Probability (0 - 100, predicting stress before visible symptoms)
3. Growth Stage (Seedling, Vegetative, Flowering, Fruiting, Mature, Senescence)
4. Primary Leaf Condition (Pristine Healthy, Minor Turgor Loss, Edge Chlorosis, Interveinal Chlorosis, Wilting & Desiccation, Necrotic Lesions, Leaf Drop / Abscission)
5. Detected Stress Vectors
6. Chlorophyll Index estimate (0.0 to 1.0)
7. Necrotic Tissue Area (% estimate, 0 to 100)
8. Scientific Botanical Diagnosis (2-3 paragraphs)
9. Immediate Early-Warning Recommendations`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: 'You are an advanced botanical AI diagnostician specializing in precision agriculture, plant physiology, and early-warning stress telemetry. Provide objective, mathematically sound, empirical botanical evaluations in strict JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.INTEGER },
            stressRisk: { type: Type.INTEGER },
            growthStage: { type: Type.STRING },
            leafCondition: { type: Type.STRING },
            stressVectors: { type: Type.ARRAY, items: { type: Type.STRING } },
            chlorophyllIndex: { type: Type.NUMBER },
            necroroticAreaPercent: { type: Type.NUMBER },
            scientificDiagnosis: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            leafTurgorStatus: { type: Type.STRING },
          },
          required: [
            'healthScore',
            'stressRisk',
            'growthStage',
            'leafCondition',
            'stressVectors',
            'chlorophyllIndex',
            'necroticAreaPercent',
            'scientificDiagnosis',
            'recommendations',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing plant image:', error);
    res.status(500).json({ error: error.message || 'Error during plant vision analysis' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], plantContext } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const systemPrompt = `You are Dr. Xylem, the resident Botanical AI Research Scientist for the PLANT-X Early-Warning Plant Stress Platform.
Your mission is to assist researchers in detecting and understanding plant stress (water deficit, thermal shock, VPD anomalies, light saturation, and nutrient deficiencies).
${plantContext ? `Active Telemetry & Plant Context in Session: ${JSON.stringify(plantContext)}` : ''}`;

    const contents = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'Unable to generate botanical response at this time.',
    });
  } catch (error: any) {
    console.error('Error in botanical chat:', error);
    res.status(500).json({ error: error.message || 'Chat assistant error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PLANT-X Backend Engine] Running at http://0.0.0.0:${PORT}`);
});
