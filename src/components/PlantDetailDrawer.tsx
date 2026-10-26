import React from 'react';
import {
  X,
  Sprout,
  Scan,
  Activity,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  Droplets,
  Thermometer,
  Gauge,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { Plant, SensorReading, ImageAssessment } from '../types';

interface PlantDetailDrawerProps {
  plant: Plant | null;
  sensorReadings: SensorReading[];
  assessments: ImageAssessment[];
  onClose: () => void;
  onOpenScanner: (plantId: string) => void;
  onOpenLogSensor: (plantId: string) => void;
  onDeletePlant: (plantId: string) => void;
}

export const PlantDetailDrawer: React.FC<PlantDetailDrawerProps> = ({
  plant,
  sensorReadings,
  assessments,
  onClose,
  onOpenScanner,
  onOpenLogSensor,
  onDeletePlant,
}) => {
  if (!plant) return null;

  const plantReadings = sensorReadings.filter((r) => r.plantId === plant.id);
  const plantAssessments = assessments.filter((a) => a.plantId === plant.id);
  const latestReading = plantReadings[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl h-full bg-[#071710] border-l border-emerald-500/30 flex flex-col shadow-2xl text-emerald-50 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-emerald-500/20 bg-[#05110c]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {plant.name}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {plant.experimentGroup}
                </span>
              </h2>
              <p className="text-xs text-emerald-400/80 italic font-mono">{plant.species}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-emerald-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          
          {/* Specimen Photograph Banner */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg">
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 backdrop-blur-md">
                    {plant.growthStage}
                  </span>
                  <div className="text-white text-sm font-bold mt-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {plant.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-300/80 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Planted: {plant.plantedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health & Stress Risk Dual Gauges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#0a1e15] border border-emerald-500/20 flex flex-col items-center text-center">
              <span className="text-[10px] text-emerald-400/80 uppercase font-mono tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Health Vitality
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-300 mt-1">
                {plant.healthScore}%
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${plant.healthScore}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400/60 mt-1.5">
                {plant.healthScore > 80 ? 'Optimal Turgor' : plant.healthScore > 60 ? 'Moderate Vigour' : 'Compromised'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1e15] border border-emerald-500/20 flex flex-col items-center text-center">
              <span className="text-[10px] text-emerald-400/80 uppercase font-mono tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Predicted Stress Risk
              </span>
              <div className={`text-3xl font-extrabold font-mono mt-1 ${
                plant.stressRisk > 60 ? 'text-rose-400' : plant.stressRisk > 35 ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {plant.stressRisk}%
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    plant.stressRisk > 60 ? 'bg-rose-500' : plant.stressRisk > 35 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${plant.stressRisk}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400/60 mt-1.5">
                {plant.stressRisk > 60 ? 'Early Warning Alert' : 'Normal Equilibrium'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons for this plant */}
          <div className="flex gap-2">
            <button
              onClick={() => onOpenScanner(plant.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-semibold transition"
            >
              <Scan className="w-4 h-4 text-emerald-400" />
              <span>AI Vision Scan</span>
            </button>
            <button
              onClick={() => onOpenLogSensor(plant.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0c291c] hover:bg-[#113827] border border-emerald-500/30 text-emerald-200 font-semibold transition"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Log Telemetry</span>
            </button>
          </div>

          {/* Latest Environmental Telemetry Snapshot */}
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Latest Environmental Telemetry</span>
              {latestReading && (
                <span className="text-[10px] text-emerald-400/60 font-mono font-normal">
                  {new Date(latestReading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </h3>

            {latestReading ? (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-[#081b12] border border-emerald-500/20">
                  <div className="flex justify-center text-cyan-400 mb-1">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-emerald-400/70">Soil Moist</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {latestReading.soilMoisture}%
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#081b12] border border-emerald-500/20">
                  <div className="flex justify-center text-amber-400 mb-1">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-emerald-400/70">Temp</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {latestReading.temperature}°C
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#081b12] border border-emerald-500/20">
                  <div className="flex justify-center text-emerald-400 mb-1">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-emerald-400/70">Humidity</div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {latestReading.humidity}%
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#081b12] border border-emerald-500/20">
                  <div className="flex justify-center text-emerald-300 mb-1">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-emerald-400/70">VPD</div>
                  <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
                    {latestReading.vpd} <span className="text-[9px]">kPa</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#081b12] border border-emerald-500/15 text-center text-emerald-400/70">
                No telemetry readings recorded for this plant yet. Click "Log Telemetry" above to log first reading.
              </div>
            )}
          </div>

          {/* Research Notes & Observations */}
          <div className="p-4 rounded-xl bg-[#081b12] border border-emerald-500/20 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Research Notes &amp; Substrate Setup
            </h4>
            <p className="text-emerald-200/80 leading-relaxed text-[11px]">
              {plant.notes || 'No research notes entered. You can document osmotic treatments, lighting schedule, and experimental interventions here.'}
            </p>
          </div>

          {/* Assessment History Photos */}
          {plantAssessments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
                Optical Assessment History ({plantAssessments.length})
              </h3>
              <div className="space-y-2">
                {plantAssessments.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-[#081b12] border border-emerald-500/20 flex items-center gap-3"
                  >
                    <img
                      src={a.imageUrl}
                      alt="Assessment"
                      className="w-12 h-12 rounded-lg object-cover border border-emerald-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate text-xs">
                          {a.leafCondition}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          Score: {a.healthScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-400/70 truncate mt-0.5">
                        {a.scientificDiagnosis}
                      </p>
                      <span className="text-[9px] text-emerald-500/60 font-mono">
                        {new Date(a.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone: Delete Specimen */}
          <div className="pt-4 border-t border-emerald-500/15 flex justify-end">
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${plant.name} from active monitoring?`)) {
                  onDeletePlant(plant.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Specimen</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
