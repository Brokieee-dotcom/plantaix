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

// Support large image payloads for plant photo analysis
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'PLANT-X Botanical Research Engine',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Plant image analysis endpoint using Gemini 3.8 Flash Vision
app.post('/api/analyze-plant', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', plantName, species, experimentGroup } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Missing imageBase64 in request body' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to local botanical diagnostic model.',
      });
      return;
    }

    // Clean base64 if data URI prefix was sent
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const promptText = `You are the lead botanical vision diagnostic model for the PLANT-X Early-Warning Plant Stress Platform.
Analyze this high-resolution botanical photograph.
Context:
Plant Identifier: "${plantName || 'Specimen'}"
Botanical Species: "${species || 'Unknown Flora'}"
Research Group: "${experimentGroup || 'Observational'}"

Evaluate the plant carefully for:
1. Overall Health Score (0 - 100, where 100 is pristine vitality, and <60 indicates acute stress or disease)
2. Stress Risk Probability (0 - 100, predicting onset of physiological stress before severe irreversible damage)
3. Growth Stage: choose one of ["Seedling", "Vegetative", "Flowering", "Fruiting", "Mature", "Senescence"]
4. Primary Leaf Condition: choose one of ["Pristine Healthy", "Minor Turgor Loss", "Edge Chlorosis", "Interveinal Chlorosis", "Wilting & Desiccation", "Necrotic Lesions", "Leaf Drop / Abscission"]
5. Detected Stress Vectors: list of stressors like ["Water Deficit (Drought)", "Water Excess (Hypoxia)", "Heat/Thermal Shock", "Nutrient Depletion", "Pathogen/Fungal Spot", "Light Scorch", "None / Optimal"]
6. Chlorophyll Index estimate (0.0 to 1.0, e.g. 0.88 is rich green)
7. Necrotic Tissue Area (% estimate, 0 to 100)
8. Scientific Diagnosis: Detailed 2-3 paragraph botanical analysis explaining turgor pressure, cellular elasticity, vascular discoloration, leaf angle, and symptom etiology.
9. Immediate Early-Warning Recommendations: Actionable steps for the botanist/researcher (irrigation adjust, PAR shading, humidity increase, nutrient flush).`;

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
            healthScore: {
              type: Type.INTEGER,
              description: 'Overall plant health score between 0 and 100',
            },
            stressRisk: {
              type: Type.INTEGER,
              description: 'Probability of stress occurring in the next 6-24 hours (0-100)',
            },
            growthStage: {
              type: Type.STRING,
              description: 'Current botanical development phase',
            },
            leafCondition: {
              type: Type.STRING,
              description: 'Current morphological leaf status',
            },
            stressVectors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Identified environmental or biological stress sources',
            },
            chlorophyllIndex: {
              type: Type.NUMBER,
              description: 'Estimated chlorophyll absorption index (0.0 to 1.0)',
            },
            necroticAreaPercent: {
              type: Type.NUMBER,
              description: 'Estimated percentage of foliage showing necrosis or bleaching',
            },
            scientificDiagnosis: {
              type: Type.STRING,
              description: 'Comprehensive botanical diagnostic breakdown',
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Prescriptive horticultural or lab interventions',
            },
            leafTurgorStatus: {
              type: Type.STRING,
              description: 'Turgid, Flaccid, or Plasmolyzed',
            },
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

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing plant image:', error);
    res.status(500).json({
      error: error.message || 'An error occurred during plant vision analysis',
    });
  }
});

// Botanical AI Research Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], plantContext } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const systemPrompt = `You are Dr. Xylem, the resident Botanical AI Research Scientist for the PLANT-X Early-Warning Plant Stress Platform.
Your mission is to assist high-school, university, and agricultural club researchers in detecting, understanding, and mitigating plant stress (water deficit, thermal shock, vapor pressure deficit anomalies, light saturation, and nutrient deficiencies).
You speak with scientific precision, yet explain concepts clearly with empirical equations, horticultural insights, and practical lab steps.

${plantContext ? `Active Telemetry & Plant Context in Session: ${JSON.stringify(plantContext)}` : ''}

Always give actionable, data-driven advice. When relevant, reference metrics like Soil Moisture %, Vapor Pressure Deficit (VPD in kPa), Photoperiod PAR, and Leaf Temperature Differential.`;

    const contents = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
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
    res.status(500).json({
      error: error.message || 'Chat assistant error',
    });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Setup Vite in middleware mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PLANT-X Core Engine] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
