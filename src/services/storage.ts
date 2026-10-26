import { Plant, SensorReading, ImageAssessment, ResearchNote, CalibrationSettings, BOTANICAL_PRESETS } from '../types';
import { calculateVPD, calculatePredictedStressRisk } from './telemetryCalculations';

const STORAGE_KEYS = {
  PLANTS: 'plantx_plants_v2',
  SENSOR_READINGS: 'plantx_sensor_readings_v2',
  IMAGE_ASSESSMENTS: 'plantx_image_assessments_v2',
  RESEARCH_NOTES: 'plantx_research_notes_v2',
  SETTINGS: 'plantx_calibration_settings_v2',
};

const DEFAULT_SETTINGS: CalibrationSettings = {
  soilMoistureOffset: 0,
  temperatureOffset: 0,
  humidityOffset: 0,
  alertThresholdSoilMoisture: 30,
  alertThresholdTemperature: 32,
  alertThresholdVPD: 1.6,
};

// --- Plants ---
export function getPlants(): Plant[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLANTS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read plants from localStorage:', err);
    return [];
  }
}

export function savePlant(plant: Plant): void {
  const plants = getPlants();
  const existingIdx = plants.findIndex(p => p.id === plant.id);
  if (existingIdx >= 0) {
    plants[existingIdx] = plant;
  } else {
    plants.unshift(plant);
  }
  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
}

export function deletePlant(id: string): void {
  const plants = getPlants().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
}

// --- Sensor Readings ---
export function getSensorReadings(plantId?: string): SensorReading[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SENSOR_READINGS);
    if (!data) return [];
    const readings: SensorReading[] = JSON.parse(data);
    if (plantId) {
      return readings.filter(r => r.plantId === plantId);
    }
    return readings;
  } catch (err) {
    console.error('Failed to read sensors from localStorage:', err);
    return [];
  }
}

export function addSensorReading(reading: Omit<SensorReading, 'id' | 'vpd'>): SensorReading {
  const vpd = calculateVPD(reading.temperature, reading.humidity);
  const newReading: SensorReading = {
    ...reading,
    id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    vpd,
  };

  const readings = getSensorReadings();
  readings.unshift(newReading);
  localStorage.setItem(STORAGE_KEYS.SENSOR_READINGS, JSON.stringify(readings));

  // Recalculate and update the plant's current stress risk & health score based on latest reading
  const plants = getPlants();
  const plantIndex = plants.findIndex(p => p.id === reading.plantId);
  if (plantIndex >= 0) {
    const plant = plants[plantIndex];
    const { risk } = calculatePredictedStressRisk(
      reading.soilMoisture,
      reading.temperature,
      reading.humidity,
      vpd
    );
    plant.stressRisk = risk;
    plant.healthScore = Math.max(10, Math.min(100, Math.round(100 - risk * 0.75)));
    plant.updatedAt = new Date().toISOString();
    savePlant(plant);
  }

  return newReading;
}

export function deleteSensorReading(id: string): void {
  const readings = getSensorReadings().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.SENSOR_READINGS, JSON.stringify(readings));
}

// --- Image Assessments ---
export function getImageAssessments(plantId?: string): ImageAssessment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.IMAGE_ASSESSMENTS);
    if (!data) return [];
    const assessments: ImageAssessment[] = JSON.parse(data);
    if (plantId) {
      return assessments.filter(a => a.plantId === plantId);
    }
    return assessments;
  } catch (err) {
    console.error('Failed to read image assessments from localStorage:', err);
    return [];
  }
}

export function addImageAssessment(assessment: ImageAssessment): void {
  const assessments = getImageAssessments();
  assessments.unshift(assessment);
  localStorage.setItem(STORAGE_KEYS.IMAGE_ASSESSMENTS, JSON.stringify(assessments));

  // Update target plant with new assessment scores
  const plants = getPlants();
  const targetPlant = plants.find(p => p.id === assessment.plantId);
  if (targetPlant) {
    targetPlant.healthScore = assessment.healthScore;
    targetPlant.stressRisk = assessment.stressRisk;
    targetPlant.growthStage = assessment.growthStage;
    targetPlant.updatedAt = new Date().toISOString();
    savePlant(targetPlant);
  }
}

export function deleteImageAssessment(id: string): void {
  const assessments = getImageAssessments().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.IMAGE_ASSESSMENTS, JSON.stringify(assessments));
}

// --- Research Notes ---
export function getResearchNotes(): ResearchNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESEARCH_NOTES);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read research notes:', err);
    return [];
  }
}

export function addResearchNote(note: Omit<ResearchNote, 'id' | 'date'>): ResearchNote {
  const newNote: ResearchNote = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    date: new Date().toISOString().split('T')[0],
  };
  const notes = getResearchNotes();
  notes.unshift(newNote);
  localStorage.setItem(STORAGE_KEYS.RESEARCH_NOTES, JSON.stringify(notes));
  return newNote;
}

// --- Calibration & Settings ---
export function getCalibrationSettings(): CalibrationSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveCalibrationSettings(settings: CalibrationSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// --- Reference Dataset for Science Club Demonstration ---
export function loadReferenceDataset(): void {
  const now = new Date();
  
  const referencePlants: Plant[] = [
    {
      id: 'specimen_001',
      name: 'Arabidopsis WT-01',
      species: 'Arabidopsis thaliana (Col-0)',
      experimentGroup: 'Control',
      growthStage: 'Vegetative',
      location: 'Growth Chamber Alpha - Tray 1',
      plantedDate: '2026-10-01',
      imageUrl: BOTANICAL_PRESETS[0].url,
      notes: 'Optimal hydration baseline. Nutrient hoagland solution at 0.5X concentration.',
      healthScore: 94,
      stressRisk: 8,
      createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'specimen_002',
      name: 'Solanum Micro-Tom (WD-3)',
      species: 'Solanum lycopersicum',
      experimentGroup: 'Water Stress',
      growthStage: 'Fruiting',
      location: 'Chamber Beta - Drought Row',
      plantedDate: '2026-09-18',
      imageUrl: BOTANICAL_PRESETS[1].url,
      notes: 'Subjected to 60% deficit irrigation to study early stomatal closure signaling before wilting.',
      healthScore: 68,
      stressRisk: 74,
      createdAt: new Date(now.getTime() - 25 * 86400000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'specimen_003',
      name: 'Monstera Specimen TS-2',
      species: 'Monstera deliciosa',
      experimentGroup: 'Heat Stress',
      growthStage: 'Vegetative',
      location: 'Thermal Chamber 3',
      plantedDate: '2026-08-10',
      imageUrl: BOTANICAL_PRESETS[2].url,
      notes: 'Testing thermal tolerance threshold under 34.5°C daylight pulses.',
      healthScore: 72,
      stressRisk: 62,
      createdAt: new Date(now.getTime() - 40 * 86400000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: 'specimen_004',
      name: 'Ocimum Genovese CS-1',
      species: 'Ocimum basilicum',
      experimentGroup: 'Combined Stress',
      growthStage: 'Vegetative',
      location: 'Multi-Stress Chamber 4',
      plantedDate: '2026-10-08',
      imageUrl: BOTANICAL_PRESETS[3].url,
      notes: 'Evaluating synergistic stress of dry substrate (28% moisture) plus elevated VPD (1.92 kPa).',
      healthScore: 54,
      stressRisk: 88,
      createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(referencePlants));

  // Generate realistic sensor telemetry over past 24 hours
  const referenceReadings: SensorReading[] = [];
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - (20 - i) * 3600000).toISOString();
    
    // Plant 1: Control
    referenceReadings.push({
      id: `ref_1_${i}`,
      plantId: 'specimen_001',
      plantName: 'Arabidopsis WT-01',
      timestamp,
      soilMoisture: 65 + Math.sin(i) * 3,
      temperature: 22.4 + Math.cos(i) * 0.8,
      humidity: 62 + Math.sin(i * 0.5) * 4,
      lightLux: i >= 6 && i <= 18 ? 14000 + Math.sin(i) * 1200 : 20,
      vpd: calculateVPD(22.4 + Math.cos(i) * 0.8, 62 + Math.sin(i * 0.5) * 4),
      isSimulated: true,
    });

    // Plant 4: Combined stress
    referenceReadings.push({
      id: `ref_4_${i}`,
      plantId: 'specimen_004',
      plantName: 'Ocimum Genovese CS-1',
      timestamp,
      soilMoisture: Math.max(18, 38 - i * 0.9),
      temperature: 31.2 + (i > 8 ? 3.5 : 1.2),
      humidity: Math.max(30, 48 - i * 0.7),
      lightLux: i >= 6 && i <= 18 ? 22000 : 30,
      vpd: calculateVPD(31.2 + (i > 8 ? 3.5 : 1.2), Math.max(30, 48 - i * 0.7)),
      isSimulated: true,
    });
  }

  localStorage.setItem(STORAGE_KEYS.SENSOR_READINGS, JSON.stringify(referenceReadings));

  // Add initial research notes
  const initialNotes: ResearchNote[] = [
    {
      id: 'note_1',
      group: 'Combined Stress',
      title: 'Stomatal conductancy drop precedes visible flaccidity by 5.4 hours',
      author: 'PLANT-X Lead Researcher',
      date: '2026-10-24',
      content: 'Under elevated VPD (1.85 kPa) and substrate moisture depletion below 32%, the leaf lamina maintains visual green color while xylem sap flow drops 68%. This confirms the predictive window for early warning.',
      stressLevelObserved: 'Severe',
    },
    {
      id: 'note_2',
      group: 'Control',
      title: 'Baseline chlorophyll absorption stability',
      author: 'Botanical Lead',
      date: '2026-10-25',
      content: 'Chamber Alpha telemetry remains tightly coupled within VPD 0.85-1.05 kPa. Zero chlorosis detected on Col-0 rosulate leaves.',
      stressLevelObserved: 'Low',
    },
  ];

  localStorage.setItem(STORAGE_KEYS.RESEARCH_NOTES, JSON.stringify(initialNotes));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.PLANTS);
  localStorage.removeItem(STORAGE_KEYS.SENSOR_READINGS);
  localStorage.removeItem(STORAGE_KEYS.IMAGE_ASSESSMENTS);
  localStorage.removeItem(STORAGE_KEYS.RESEARCH_NOTES);
}

export function exportAllDataJSON(): string {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    platform: 'PLANT-X AI Botanical Research Dashboard',
    plants: getPlants(),
    sensorReadings: getSensorReadings(),
    imageAssessments: getImageAssessments(),
    researchNotes: getResearchNotes(),
    settings: getCalibrationSettings(),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllDataJSON(jsonString: string): boolean {
  try {
    const payload = JSON.parse(jsonString);
    if (payload.plants) localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(payload.plants));
    if (payload.sensorReadings) localStorage.setItem(STORAGE_KEYS.SENSOR_READINGS, JSON.stringify(payload.sensorReadings));
    if (payload.imageAssessments) localStorage.setItem(STORAGE_KEYS.IMAGE_ASSESSMENTS, JSON.stringify(payload.imageAssessments));
    if (payload.researchNotes) localStorage.setItem(STORAGE_KEYS.RESEARCH_NOTES, JSON.stringify(payload.researchNotes));
    if (payload.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(payload.settings));
    return true;
  } catch (err) {
    console.error('Failed to parse imported JSON payload:', err);
    return false;
  }
}
