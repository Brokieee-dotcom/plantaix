import React, { useState } from 'react';
import { X, Activity, Gauge, Thermometer, Droplets, Sun, Sparkles } from 'lucide-react';
import { Plant, SensorReading } from '../types';
import { calculateVPD, getVPDZone, calculatePredictedStressRisk } from '../services/telemetryCalculations';

interface LogSensorModalProps {
  isOpen: boolean;
  plants: Plant[];
  selectedPlantId?: string;
  onClose: () => void;
  onSave: (reading: Omit<SensorReading, 'id' | 'vpd'>) => void;
}

export const LogSensorModal: React.FC<LogSensorModalProps> = ({
  isOpen,
  plants,
  selectedPlantId,
  onClose,
  onSave,
}) => {
  const [plantId, setPlantId] = useState(selectedPlantId || (plants[0]?.id || ''));
  const [soilMoisture, setSoilMoisture] = useState(55);
  const [temperature, setTemperature] = useState(23.5);
  const [humidity, setHumidity] = useState(65);
  const [lightLux, setLightLux] = useState(16000);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Real-time scientific calculation
  const calculatedVpd = calculateVPD(temperature, humidity);
  const vpdZone = getVPDZone(calculatedVpd);
  const { risk, primaryRiskFactor } = calculatePredictedStressRisk(
    soilMoisture,
    temperature,
    humidity,
    calculatedVpd
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantId) return;

    const targetPlant = plants.find((p) => p.id === plantId);

    onSave({
      plantId,
      plantName: targetPlant?.name || 'Specimen',
      timestamp: new Date().toISOString(),
      soilMoisture: Number(soilMoisture),
      temperature: Number(temperature),
      humidity: Number(humidity),
      lightLux: Number(lightLux),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#081710] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-emerald-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#06120d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Environmental Sensor Telemetry</h2>
              <p className="text-xs text-emerald-400/70">Substrate moisture, microclimate &amp; automated VPD computation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-emerald-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Target Specimen Selection */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-1">
              Select Specimen *
            </label>
            {plants.length > 0 ? (
              <select
                required
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-100 focus:outline-none focus:border-emerald-400 text-xs font-mono"
              >
                {plants.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#091a12] text-white">
                    {p.name} ({p.species}) — [{p.experimentGroup}]
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                No plants registered yet. Please add a plant first or load the reference cohort!
              </div>
            )}
          </div>

          {/* Real-time VPD & Stress Prediction Preview Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c261b] to-[#071911] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Live Physics &amp; Early-Warning Calculations
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${vpdZone.color}`}>
                {vpdZone.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/15">
                <div className="text-[10px] text-emerald-400/80 font-mono">Calculated VPD</div>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">
                  {calculatedVpd} <span className="text-xs text-emerald-400 font-normal">kPa</span>
                </div>
                <p className="text-[9px] text-emerald-400/60 mt-1 truncate">{vpdZone.description}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/15">
                <div className="text-[10px] text-emerald-400/80 font-mono">Predicted Stress Risk</div>
                <div className={`text-xl font-bold font-mono mt-0.5 ${
                  risk > 60 ? 'text-rose-400' : risk > 35 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {risk}%
                </div>
                <p className="text-[9px] text-emerald-400/60 mt-1 truncate">{primaryRiskFactor}</p>
              </div>
            </div>
          </div>

          {/* Sensor Inputs Grid */}
          <div className="space-y-4">
            
            {/* Soil Moisture Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Substrate Volumetric Moisture (%)
                </label>
                <span className="font-mono text-cyan-300 font-bold">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-emerald-950 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-emerald-400/50 font-mono mt-0.5">
                <span>5% (Desiccation)</span>
                <span>45-65% (Optimal)</span>
                <span>95% (Hypoxia)</span>
              </div>
            </div>

            {/* Temperature & Humidity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  required
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Relative Humidity (% RH)
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="100"
                  required
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Light Lux */}
            <div>
              <label className="block text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                Light Intensity (Lux)
              </label>
              <input
                type="number"
                step="500"
                min="0"
                max="100000"
                value={lightLux}
                onChange={(e) => setLightLux(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-emerald-400/60 font-mono mt-0.5 block">
                Typical greenhouse daylight: 10,000 - 35,000 Lux. Night: &lt; 50 Lux.
              </span>
            </div>

            {/* Reading Notes */}
            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Observation Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Taken 30 minutes after chamber thermal pulse."
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-emerald-950/40 text-emerald-400 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={plants.length === 0}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              Record Telemetry
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
