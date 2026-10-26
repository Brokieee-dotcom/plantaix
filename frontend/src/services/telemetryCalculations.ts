/**
 * Botanical Telemetry Calculations & Physiological Models
 * PLANT-X Precision Botanical Research Engine
 */

/**
 * Calculates Saturated Vapor Pressure (SVP) in kPa using Tetens equation
 * @param tempC Temperature in Celsius
 */
export function calculateSVP(tempC: number): number {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

/**
 * Calculates Vapor Pressure Deficit (VPD) in kPa
 * VPD indicates the drying power of the air and transpiration pull on plant stomata.
 * @param tempC Air Temperature in Celsius
 * @param humidityPct Relative Humidity in Percent (0-100)
 */
export function calculateVPD(tempC: number, humidityPct: number): number {
  const svp = calculateSVP(tempC);
  const actualVp = svp * (humidityPct / 100);
  const vpd = svp - actualVp;
  return Math.max(0, Number(vpd.toFixed(2)));
}

export type VPDZone = 'Danger Low (Guttation)' | 'Optimal Low' | 'Optimal Balanced' | 'Optimal High' | 'High Stress' | 'Critical Desiccation';

export function getVPDZone(vpd: number): { label: VPDZone; color: string; description: string } {
  if (vpd < 0.4) {
    return {
      label: 'Danger Low (Guttation)',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
      description: 'Air too humid. Transpiration stalls, risk of fungal spore germination.',
    };
  }
  if (vpd < 0.8) {
    return {
      label: 'Optimal Low',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
      description: 'Ideal for early vegetative propagation and delicate leafy seedlings.',
    };
  }
  if (vpd <= 1.2) {
    return {
      label: 'Optimal Balanced',
      color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
      description: 'Peak stomatal conductance and nutrient mass flow via xylem stream.',
    };
  }
  if (vpd <= 1.5) {
    return {
      label: 'Optimal High',
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
      description: 'Elevated transpiration demand. Plant must have uninhibited root moisture.',
    };
  }
  if (vpd <= 1.8) {
    return {
      label: 'High Stress',
      color: 'text-orange-400 border-orange-500/40 bg-orange-950/40',
      description: 'Stomata beginning defensive partial closure. Turgor decline imminent.',
    };
  }
  return {
    label: 'Critical Desiccation',
    color: 'text-rose-400 border-rose-500/50 bg-rose-950/50',
    description: 'Acute atmospheric drought pull. Photosynthesis ceases due to guard cell collapse.',
  };
}

/**
 * Predicts early-warning stress risk probability (0-100) based on telemetry
 */
export function calculatePredictedStressRisk(
  soilMoisture: number,
  tempC: number,
  humidityPct: number,
  vpd: number
): { risk: number; primaryRiskFactor: string } {
  let riskScore = 10;
  let factor = 'Optimal Conditions';

  // Soil moisture checks
  if (soilMoisture < 25) {
    riskScore += 55;
    factor = 'Severe Substrate Water Deficit';
  } else if (soilMoisture < 38) {
    riskScore += 30;
    factor = 'Moderate Soil Moisture Depletion';
  } else if (soilMoisture > 88) {
    riskScore += 35;
    factor = 'Root Zone Hypoxia / Waterlogging';
  }

  // Thermal checks
  if (tempC > 34) {
    riskScore += 35;
    factor = factor === 'Optimal Conditions' ? 'Heat Shock Threshold Exceeded' : factor + ' + Thermal Shock';
  } else if (tempC > 29) {
    riskScore += 15;
  } else if (tempC < 14) {
    riskScore += 25;
    factor = 'Chilling Stress / Slowed Enzyme Kinetics';
  }

  // Atmospheric VPD pull
  if (vpd > 1.6) {
    riskScore += 25;
    factor = factor === 'Optimal Conditions' ? 'High Atmospheric Vapor Deficit' : factor + ' + High VPD';
  } else if (vpd < 0.35) {
    riskScore += 15;
  }

  const finalRisk = Math.min(99, Math.max(5, Math.round(riskScore)));
  return { risk: finalRisk, primaryRiskFactor: factor };
}
