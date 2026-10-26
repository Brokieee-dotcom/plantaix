import React from 'react';
import {
  Menu,
  Plus,
  Scan,
  Activity,
  AlertTriangle,
  FileText,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from './Navigation';
import { Plant } from '../types';

interface TopBarProps {
  currentPage: PageId;
  plants: Plant[];
  onOpenAddPlant: () => void;
  onOpenLogSensor: () => void;
  onOpenScanner: () => void;
  onOpenBriefing: () => void;
  onLoadReferenceData: () => void;
  onToggleMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  plants,
  onOpenAddPlant,
  onOpenLogSensor,
  onOpenScanner,
  onOpenBriefing,
  onLoadReferenceData,
  onToggleMobileNav,
}) => {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    overview: {
      title: 'Botanical Telemetry & Stress Overview',
      subtitle: 'Real-time multi-sensor telemetry and predictive stress surveillance',
    },
    plants: {
      title: 'Specimen Registry & Plant Profiles',
      subtitle: 'Botanical cohort tracking, morphological stages, and individual telemetry',
    },
    sensors: {
      title: 'Sensor Telemetry & Environmental Graphs',
      subtitle: 'Continuous substrate moisture, ambient temperature, humidity & VPD curves',
    },
    scanner: {
      title: 'AI Vision Optical Scanner',
      subtitle: 'High-resolution leaf diagnostics, chlorophyll reflectance & necrosis detection',
    },
    assistant: {
      title: 'Dr. Xylem — AI Botanical Research Assistant',
      subtitle: 'Precision horticultural guidance, stress etiology, and mitigation protocols',
    },
    imagelab: {
      title: 'Image Lab & Chronological Growth Compare',
      subtitle: 'Side-by-side morphological differential analysis over experiment timelines',
    },
    cctv: {
      title: 'Chamber CCTV & Optical Surveillance',
      subtitle: 'Multi-chamber climate enclosure video streams and sensor overlays',
    },
    research: {
      title: 'Research Cohorts & Experiment Hypotheses',
      subtitle: 'Control vs Water Deficit vs Thermal Shock vs Synergistic Combined Stress',
    },
    settings: {
      title: 'Hardware Calibration & System Configuration',
      subtitle: 'Sensor offset adjustment, JSON telemetry backup & GitHub Pages export',
    },
  };

  const highStressCount = plants.filter((p) => p.stressRisk > 60).length;
  const meanHealth = plants.length
    ? Math.round(plants.reduce((acc, p) => acc + p.healthScore, 0) / plants.length)
    : 0;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-18 px-4 sm:px-6 bg-[#06130d]/90 backdrop-blur-md border-b border-emerald-500/20">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {pageTitles[currentPage]?.title || 'PLANT-X Dashboard'}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              LAB MONITOR
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/70 hidden sm:block truncate max-w-md">
            {pageTitles[currentPage]?.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Telemetry Badges & Quick Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* At-a-glance telemetry pills */}
        <div className="hidden lg:flex items-center gap-2 bg-[#091a13] px-3 py-1.5 rounded-xl border border-emerald-500/20 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Health: <strong className="text-white">{plants.length ? `${meanHealth}%` : 'N/A'}</strong></span>
          </div>
          <span className="text-emerald-500/40">|</span>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <AlertTriangle
              className={`w-3.5 h-3.5 ${
                highStressCount > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
              }`}
            />
            <span>
              Alerts:{' '}
              <strong className={highStressCount > 0 ? 'text-amber-300' : 'text-emerald-400'}>
                {highStressCount}
              </strong>
            </span>
          </div>
        </div>

        {/* If 0 plants, show Reference Data Seed button */}
        {plants.length === 0 && (
          <button
            onClick={onLoadReferenceData}
            title="Load initial science club reference specimens for demonstration"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Load Reference Cohort</span>
          </button>
        )}

        {/* Club Leader Briefing */}
        <button
          onClick={onOpenBriefing}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition"
          title="Open Club Leader Presentation Briefing Notes"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Club Notes</span>
        </button>

        {/* Log Telemetry */}
        <button
          onClick={onOpenLogSensor}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0b2419] hover:bg-[#103323] border border-emerald-500/30 text-emerald-200 text-xs font-medium transition"
          title="Log new sensor readings"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Log Sensor</span>
        </button>

        {/* AI Scanner Button */}
        <button
          onClick={onOpenScanner}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-200 text-xs font-semibold transition"
          title="AI Vision Leaf Scanner"
        >
          <Scan className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Scan Leaf</span>
        </button>

        {/* Add Specimen Button */}
        <button
          onClick={onOpenAddPlant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Plant</span>
        </button>
      </div>
    </header>
  );
};
