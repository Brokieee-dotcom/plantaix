import React, { useState } from 'react';
import {
  Sprout,
  Activity,
  Scan,
  AlertTriangle,
  Droplets,
  Thermometer,
  Gauge,
  Sun,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Bot,
  Database,
} from 'lucide-react';
import { Plant, SensorReading, ImageAssessment } from '../types';
import { getVPDZone } from '../services/telemetryCalculations';

interface OverviewPageProps {
  plants: Plant[];
  sensorReadings: SensorReading[];
  assessments: ImageAssessment[];
  onSelectPlant: (plant: Plant) => void;
  onOpenAddPlant: () => void;
  onOpenLogSensor: () => void;
  onOpenScanner: (plantId?: string) => void;
  onOpenBriefing: () => void;
  onLoadReferenceData: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  plants,
  sensorReadings,
  assessments,
  onSelectPlant,
  onOpenAddPlant,
  onOpenLogSensor,
  onOpenScanner,
  onOpenBriefing,
  onLoadReferenceData,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'12h' | '24h' | '7d'>('24h');
  const [activePlantFilter, setActivePlantFilter] = useState<string>('all');

  const meanHealth = plants.length
    ? Math.round(plants.reduce((acc, p) => acc + p.healthScore, 0) / plants.length)
    : 0;
  const highStressPlants = plants.filter((p) => p.stressRisk > 60);

  // Filtered sensor readings for chart
  const filteredReadings = sensorReadings
    .filter((r) => activePlantFilter === 'all' || r.plantId === activePlantFilter)
    .slice(0, 24)
    .reverse();

  // Highlighted primary specimen for visual hierarchy
  const featuredPlant = highStressPlants[0] || plants[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* If no plants added yet, show Welcoming Researcher Banner */}
      {plants.length === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#072418] via-[#093222] to-[#061e14] border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Welcome to PLANT-X Research Platform</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Predict Plant Stress Before Visible Symptoms Appear
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              PLANT-X combines substrate moisture and microclimate telemetry with AI computer vision to forecast physiological stress hours before wilting or yellowing occurs.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAddPlant}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                Register First Specimen
              </button>
              <button
                onClick={onLoadReferenceData}
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition flex items-center gap-2"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                Load Reference Science Club Cohort (4 Plants)
              </button>
              <button
                onClick={onOpenBriefing}
                className="px-4 py-2 rounded-xl bg-[#091f15] hover:bg-[#0e2c1e] text-emerald-400 text-xs font-medium transition"
              >
                View Presentation Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Monitored Specimens */}
        <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80">Monitored Flora</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {plants.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400/60 mt-1">
            <span>4 Cohorts active</span>
            <span className="text-emerald-400 font-mono font-medium">100% telemetry</span>
          </div>
        </div>

        {/* Card 2: Mean Health Index */}
        <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80">Mean Health Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
            {plants.length ? `${meanHealth}%` : '--'}
          </div>
          <div className="w-full bg-emerald-950/80 rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${meanHealth}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400/60 mt-1">
            <span>Vitality index</span>
            <span className="text-emerald-300 font-mono font-medium">{meanHealth > 75 ? 'Optimal' : 'Caution'}</span>
          </div>
        </div>

        {/* Card 3: Early-Warning Stress Alerts */}
        <div className={`p-4 rounded-2xl border relative overflow-hidden transition ${
          highStressPlants.length > 0
            ? 'bg-gradient-to-br from-[#1c1208] to-[#120a05] border-amber-500/40 shadow-lg shadow-amber-500/5'
            : 'bg-[#081811] border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80">Early-Warning Alerts</span>
            <div className={`p-2 rounded-xl border ${
              highStressPlants.length > 0
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${
            highStressPlants.length > 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {highStressPlants.length}
          </div>
          <div className="flex items-center justify-between text-[11px] mt-1">
            <span className="text-emerald-400/70">Pre-wilting window</span>
            <span className={`font-mono font-medium ${highStressPlants.length > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
              {highStressPlants.length > 0 ? 'Action Recommended' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Card 4: Environmental VPD Status */}
        <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/80">Telemetry Points</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {sensorReadings.length}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400/60 mt-1">
            <span>Sensors logged</span>
            <span className="text-emerald-400 font-mono font-medium">Tetens Physics</span>
          </div>
        </div>

      </div>

      {/* FIRST GLANCE & SECOND GLANCE: FEATURED SPECIMEN + STRESS RADAR */}
      {featuredPlant && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Featured Plant Visualizer Card (Col 7) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#081710] border border-emerald-500/30 overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between bg-[#06120d]">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  Primary Specimen Surveillance
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {featuredPlant.experimentGroup}
              </span>
            </div>

            <div className="relative aspect-video sm:aspect-21/9 overflow-hidden group">
              <img
                src={featuredPlant.imageUrl}
                alt={featuredPlant.name}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 backdrop-blur-md">
                      {featuredPlant.growthStage} Phase
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                      {featuredPlant.name}
                    </h2>
                    <p className="text-xs text-emerald-300/80 italic font-mono">
                      {featuredPlant.species} — {featuredPlant.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlant(featuredPlant)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <span>Telemetry History</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenScanner(featuredPlant.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Scan Leaf</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Specimen Telemetry Footer Bar */}
            <div className="p-4 bg-[#06120d] border-t border-emerald-500/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#091c13] border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400/70 font-mono">Health Score</span>
                <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
                  {featuredPlant.healthScore}%
                </div>
              </div>
              <div className="p-2 rounded-xl bg-[#091c13] border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400/70 font-mono">Stress Probability</span>
                <div className={`text-base font-bold font-mono mt-0.5 ${
                  featuredPlant.stressRisk > 60 ? 'text-rose-400' : 'text-emerald-300'
                }`}>
                  {featuredPlant.stressRisk}%
                </div>
              </div>
              <div className="p-2 rounded-xl bg-[#091c13] border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400/70 font-mono">Pre-Wilting Lead</span>
                <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                  {featuredPlant.stressRisk > 60 ? '4.8 Hours' : 'Equilibrium'}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-[#091c13] border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400/70 font-mono">Turgor State</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {featuredPlant.stressRisk > 60 ? 'Incipient Loss' : 'Turgid'}
                </div>
              </div>
            </div>
          </div>

          {/* Early-Warning Watchlist & Stress Radar (Col 5) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#081710] border border-emerald-500/30 p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Early-Warning Watchlist
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80">
                {highStressPlants.length} at risk
              </span>
            </div>

            {/* Watchlist items */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
              {plants.length === 0 ? (
                <div className="p-6 text-center text-emerald-400/60 text-xs">
                  No plants registered. Add a plant or load the reference cohort to see surveillance in action.
                </div>
              ) : highStressPlants.length === 0 ? (
                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-emerald-200">All Specimens Within Safe Telemetry</p>
                  <p className="text-[11px] text-emerald-400/70">
                    No immediate risk of stomatal closure or osmotic desiccation detected.
                  </p>
                </div>
              ) : (
                highStressPlants.map((plant) => (
                  <div
                    key={plant.id}
                    onClick={() => onSelectPlant(plant)}
                    className="p-3 rounded-xl bg-[#0b1f16] hover:bg-[#0f291e] border border-amber-500/30 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate group-hover:text-emerald-300 transition">
                          {plant.name}
                        </div>
                        <div className="text-[10px] text-emerald-400/70 truncate">
                          {plant.experimentGroup} — {plant.species}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-mono font-bold text-rose-400">
                        {plant.stressRisk}% Stress
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                        Pre-Wilting
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Action Prompt */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-200 font-medium text-[11px]">
                  Need mitigation protocol?
                </span>
              </div>
              <button
                onClick={onOpenBriefing}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition underline underline-offset-2"
              >
                Open Club Notes
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECOND GLANCE: ANIMATED MULTI-CHANNEL SENSOR TELEMETRY CHART */}
      <div className="rounded-2xl bg-[#081710] border border-emerald-500/30 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Multispectral Environmental Telemetry &amp; VPD Curves
              </h3>
            </div>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Interactive timeline of substrate moisture %, chamber temperature °C, humidity &amp; VPD (kPa)
            </p>
          </div>

          {/* Plant & Time Range Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {plants.length > 0 && (
              <select
                value={activePlantFilter}
                onChange={(e) => setActivePlantFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-200 text-xs font-mono focus:outline-none"
              >
                <option value="all">All Specimens Combined</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            <div className="flex rounded-xl bg-[#06120d] border border-emerald-500/30 p-0.5 text-xs font-mono">
              {(['12h', '24h', '7d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedTimeRange === r
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-emerald-400/70 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic SVG Telemetry Graph */}
        {filteredReadings.length > 1 ? (
          <div className="space-y-3">
            <div className="h-56 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="vpdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[40, 80, 120, 160].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="800"
                    y2={y}
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Soil Moisture Path (Cyan) */}
                {(() => {
                  const points = filteredReadings.map((r, i) => {
                    const x = (i / (filteredReadings.length - 1)) * 800;
                    const y = 180 - (Math.min(100, Math.max(0, r.soilMoisture)) / 100) * 150;
                    return `${x},${y}`;
                  });
                  const d = `M ${points.join(' L ')}`;
                  const areaD = `${d} L 800,190 L 0,190 Z`;
                  return (
                    <>
                      <path d={areaD} fill="url(#moistureGradient)" />
                      <path
                        d={d}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </>
                  );
                })()}

                {/* VPD Path (Emerald/Green) */}
                {(() => {
                  const points = filteredReadings.map((r, i) => {
                    const x = (i / (filteredReadings.length - 1)) * 800;
                    const y = 180 - (Math.min(2.5, Math.max(0, r.vpd)) / 2.5) * 150;
                    return `${x},${y}`;
                  });
                  const d = `M ${points.join(' L ')}`;
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="2 2"
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  );
                })()}

                {/* Temperature Path (Amber) */}
                {(() => {
                  const points = filteredReadings.map((r, i) => {
                    const x = (i / (filteredReadings.length - 1)) * 800;
                    const y = 180 - ((r.temperature - 10) / 30) * 150;
                    return `${x},${y}`;
                  });
                  const d = `M ${points.join(' L ')}`;
                  return (
                    <path
                      d={d}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })()}
              </svg>
            </div>

            {/* Legend & Current Values */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-emerald-500/15 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
                  <span className="text-cyan-300">Soil Moisture (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
                  <span className="text-emerald-300">VPD (kPa)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                  <span className="text-amber-300">Temp (°C)</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400/70">
                Latest Telemetry: {filteredReadings[filteredReadings.length - 1]?.soilMoisture}% moisture,{' '}
                {filteredReadings[filteredReadings.length - 1]?.vpd} kPa VPD
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-[#06120d] border border-emerald-500/20 text-emerald-400/70 text-xs space-y-2">
            <Activity className="w-8 h-8 mx-auto text-emerald-400/40" />
            <p>At least 2 telemetry readings required to render timeline curves.</p>
            <button
              onClick={onOpenLogSensor}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            >
              Log First Reading
            </button>
          </div>
        )}
      </div>

      {/* THIRD GLANCE: BOTANICAL SPECIMENS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Active Botanical Cohorts
            </h3>
          </div>
          <button
            onClick={onOpenAddPlant}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            + Add Specimen
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => onSelectPlant(plant)}
              className="group rounded-2xl bg-[#081811] hover:bg-[#0c2219] border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition overflow-hidden shadow-lg flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  {plant.experimentGroup}
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold backdrop-blur-md ${
                    plant.stressRisk > 60
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {plant.stressRisk}% Risk
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition truncate">
                    {plant.name}
                  </h4>
                  <p className="text-[11px] text-emerald-400/80 italic font-mono truncate">
                    {plant.species}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400/60 font-mono block">Health Score</span>
                    <span className="font-bold font-mono text-emerald-300">{plant.healthScore}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400/60 font-mono block">Stage</span>
                    <span className="text-white text-xs">{plant.growthStage}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
