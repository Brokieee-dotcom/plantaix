export type ExperimentGroup = 'Control' | 'Water Stress' | 'Heat Stress' | 'Combined Stress';

export type GrowthStage = 
  | 'Seedling'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'Mature'
  | 'Senescence';

export type LeafCondition = 
  | 'Pristine Healthy'
  | 'Minor Turgor Loss'
  | 'Edge Chlorosis'
  | 'Interveinal Chlorosis'
  | 'Wilting & Desiccation'
  | 'Necrotic Lesions'
  | 'Leaf Drop / Abscission';

export interface Plant {
  id: string;
  name: string;
  species: string;
  experimentGroup: ExperimentGroup;
  growthStage: GrowthStage;
  location: string; // e.g. "Tray A-04", "Growth Chamber 2"
  plantedDate: string;
  imageUrl: string;
  notes: string;
  healthScore: number; // 0 - 100
  stressRisk: number;  // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export interface SensorReading {
  id: string;
  plantId: string;
  plantName?: string;
  timestamp: string;
  soilMoisture: number; // % (0 - 100)
  temperature: number;  // °C
  humidity: number;     // % RH (0 - 100)
  lightLux: number;     // Lux
  vpd: number;          // Vapor Pressure Deficit in kPa (calculated)
  notes?: string;
  isSimulated?: boolean;
}

export interface ImageAssessment {
  id: string;
  plantId: string;
  plantName: string;
  timestamp: string;
  imageUrl: string;
  healthScore: number;
  stressRisk: number;
  growthStage: GrowthStage;
  leafCondition: LeafCondition;
  stressVectors: string[];
  chlorophyllIndex: number;
  necroticAreaPercent: number;
  scientificDiagnosis: string;
  recommendations: string[];
  leafTurgorStatus?: string;
}

export interface ResearchNote {
  id: string;
  group: ExperimentGroup;
  title: string;
  author: string;
  date: string;
  content: string;
  stressLevelObserved: 'Low' | 'Moderate' | 'Severe' | 'Critical';
}

export interface CalibrationSettings {
  soilMoistureOffset: number;
  temperatureOffset: number;
  humidityOffset: number;
  alertThresholdSoilMoisture: number; // trigger alert if below %
  alertThresholdTemperature: number;  // trigger alert if above °C
  alertThresholdVPD: number;          // trigger alert if above kPa
  userGeminiApiKey?: string;          // optional user-provided key for GitHub Pages direct mode
}

export const EXPERIMENT_GROUPS: ExperimentGroup[] = [
  'Control',
  'Water Stress',
  'Heat Stress',
  'Combined Stress',
];

export const GROWTH_STAGES: GrowthStage[] = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Mature',
  'Senescence',
];

export const LEAF_CONDITIONS: LeafCondition[] = [
  'Pristine Healthy',
  'Minor Turgor Loss',
  'Edge Chlorosis',
  'Interveinal Chlorosis',
  'Wilting & Desiccation',
  'Necrotic Lesions',
  'Leaf Drop / Abscission',
];

// High quality botanical photography curated for research specimens
export const BOTANICAL_PRESETS = [
  {
    name: 'Arabidopsis thaliana (Model Organism)',
    species: 'Arabidopsis thaliana',
    group: 'Control' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    description: 'Reference botanical organism with sequenced genome, used for genetic and physiological stress studies.',
  },
  {
    name: 'Solanum lycopersicum (Micro-Tom)',
    species: 'Solanum lycopersicum',
    group: 'Water Stress' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106037?auto=format&fit=crop&w=800&q=80',
    description: 'Dwarf tomato model ideal for stomatal conductance and osmotic adjustment tracking.',
  },
  {
    name: 'Monstera deliciosa (Specimen M-1)',
    species: 'Monstera deliciosa',
    group: 'Heat Stress' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    description: 'Large tropical foliage specimen sensitive to leaf thermal regulation and edge desiccation.',
  },
  {
    name: 'Ocimum basilicum (Sweet Basil)',
    species: 'Ocimum basilicum',
    group: 'Combined Stress' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1608462706316-24e52bca7e8e?auto=format&fit=crop&w=800&q=80',
    description: 'Herbaceous fast-responding species that exhibits swift turgor loss under combined environmental stress.',
  },
  {
    name: 'Ficus elastica (Rubber Tree)',
    species: 'Ficus elastica',
    group: 'Control' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=800&q=80',
    description: 'Thick-cuticle vascular plant resilient to short drought cycles.',
  },
  {
    name: 'Nephrolepis exaltata (Boston Fern)',
    species: 'Nephrolepis exaltata',
    group: 'Water Stress' as ExperimentGroup,
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    description: 'High surface-area fronds exhibiting early tip browning under dry vapor pressure deficit.',
  },
];
