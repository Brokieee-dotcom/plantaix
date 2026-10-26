import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Droplets,
  Thermometer,
  Gauge,
  Sun,
  Trash2,
  Filter,
  Download,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Plant, SensorReading } from '../types';
import { getVPDZone } from '../services/telemetryCalculations';

interface SensorsPageProps {
  plants: Plant[];
  sensorReadings: SensorReading[];
  onOpenLogSensor: (plantId?: string) => void;
  onDeleteReading: (id: string) => void;
}

export const SensorsPage: React.FC<SensorsPageProps> = ({
  plants,
  sensorReadings,
  onOpenLogSensor,
  onDeleteReading,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>('all');
  const [activeMetric, setActiveMetric] = useState<'all' | 'moisture' | 'vpd' | 'temp'>('all');

  const filteredReadings = sensorReadings.filter(
    (r) => selectedPlantId === 'all' || r.plantId === selectedPlantId
  );

  const latestReading = filteredReadings[0];
  const latestVpdZone = latestReading ? getVPDZone(latestReading.vpd) : null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Environmental Telemetry &amp; Microclimate Logs
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Continuous substrate volumetric water content, ambient temperature, humidity &amp; VPD curves
          </p>
        </div>

        <button
          onClick={() => onOpenLogSensor(selectedPlantId !== 'all' ? selectedPlantId : undefined)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Sensor Reading</span>
        </button>
      </div>

      {/* Real-time KPI Metric Summary Cards */}
      {latestReading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-2xl bg-[#081811] border border-cyan-500/30">
            <div className="flex items-center justify-between text-cyan-400 mb-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400/80">Substrate Moisture</span>
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {latestReading.soilMoisture}%
            </div>
            <span className="text-[10px] text-cyan-400/60 font-mono mt-1 block">
              {latestReading.soilMoisture < 30 ? 'Desiccation Alert' : 'Hydrated'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#081811] border border-amber-500/30">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[10px] font-mono uppercase text-amber-400/80">Chamber Temp</span>
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {latestReading.temperature}°C
            </div>
            <span className="text-[10px] text-amber-400/60 font-mono mt-1 block">
              {latestReading.temperature > 32 ? 'Thermal Shock Alert' : 'Regulated'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400/80">Relative Humidity</span>
              <Gauge className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {latestReading.humidity}%
            </div>
            <span className="text-[10px] text-emerald-400/60 font-mono mt-1 block">
              Dewpoint stable
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400/80">Vapor Pressure Deficit</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-300">
              {latestReading.vpd} <span className="text-xs text-emerald-400 font-normal">kPa</span>
            </div>
            {latestVpdZone && (
              <span className="text-[10px] text-emerald-400/70 font-mono mt-1 block truncate">
                {latestVpdZone.label}
              </span>
            )}
          </div>

        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#081811] p-3 rounded-2xl border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 font-semibold">Filter by Specimen:</span>
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-200 text-xs font-mono focus:outline-none"
          >
            <option value="all">All Specimens Combined ({sensorReadings.length})</option>
            {plants.map((p) => {
              const count = sensorReadings.filter((r) => r.plantId === p.id).length;
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({count} readings)
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-emerald-400/70">Total Telemetry Points:</span>
          <span className="font-bold text-white px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
            {filteredReadings.length}
          </span>
        </div>
      </div>

      {/* Readings Table */}
      <div className="rounded-2xl bg-[#081811] border border-emerald-500/20 overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-emerald-500/15 bg-[#06120d] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Raw Telemetry Log Records
          </h3>
          <span className="text-[10px] font-mono text-emerald-400/70">
            Calculated using Tetens Model
          </span>
        </div>

        {filteredReadings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#05110c] text-emerald-400/70 border-b border-emerald-500/15 text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Specimen</th>
                  <th className="py-3 px-4">Soil Moisture</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Humidity</th>
                  <th className="py-3 px-4">Light (Lux)</th>
                  <th className="py-3 px-4">VPD (kPa)</th>
                  <th className="py-3 px-4">VPD Zone</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 text-emerald-100">
                {filteredReadings.map((reading) => {
                  const zone = getVPDZone(reading.vpd);
                  return (
                    <tr key={reading.id} className="hover:bg-emerald-950/30 transition">
                      <td className="py-2.5 px-4 text-emerald-400/70 whitespace-nowrap">
                        {new Date(reading.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white whitespace-nowrap">
                        {reading.plantName || 'Specimen'}
                      </td>
                      <td className="py-2.5 px-4 text-cyan-300 font-bold whitespace-nowrap">
                        {reading.soilMoisture}%
                      </td>
                      <td className="py-2.5 px-4 text-amber-300 whitespace-nowrap">
                        {reading.temperature}°C
                      </td>
                      <td className="py-2.5 px-4 text-emerald-300 whitespace-nowrap">
                        {reading.humidity}%
                      </td>
                      <td className="py-2.5 px-4 text-yellow-300 whitespace-nowrap">
                        {reading.lightLux.toLocaleString()} lx
                      </td>
                      <td className="py-2.5 px-4 font-bold text-emerald-300 whitespace-nowrap">
                        {reading.vpd}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${zone.color}`}>
                          {zone.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteReading(reading.id)}
                          className="p-1 rounded text-emerald-400/50 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete reading"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-emerald-400/60 text-xs space-y-2">
            <Activity className="w-8 h-8 mx-auto text-emerald-500/30" />
            <p>No sensor readings found for the selected filter.</p>
            <button
              onClick={() => onOpenLogSensor(selectedPlantId !== 'all' ? selectedPlantId : undefined)}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            >
              Log First Reading
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
