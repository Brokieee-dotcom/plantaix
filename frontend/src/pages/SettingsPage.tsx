import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Download,
  Upload,
  Trash2,
  Check,
  Github,
  Key,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { CalibrationSettings } from '../types';
import { exportAllDataJSON, importAllDataJSON, clearAllData } from '../services/storage';

interface SettingsPageProps {
  settings: CalibrationSettings;
  onSaveSettings: (settings: CalibrationSettings) => void;
  onDataReset: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  onDataReset,
}) => {
  const [formData, setFormData] = useState<CalibrationSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantx-botanical-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataJSON(content);
        if (success) {
          setImportStatus('Dataset successfully imported! Reloading...');
          setTimeout(() => {
            onDataReset();
            setImportStatus(null);
          }, 1000);
        } else {
          setImportStatus('Failed to parse JSON file. Please check file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (window.confirm('WARNING: Are you sure you want to clear all plants, sensor readings, and assessments? This action cannot be undone.')) {
      clearAllData();
      onDataReset();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Hardware Calibration &amp; System Configuration
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Sensor offset compensation, alert thresholds, GitHub Pages configuration, and data backups
          </p>
        </div>
      </div>

      {/* GitHub Pages Deployment Info Card */}
      <div className="p-5 rounded-2xl bg-[#081811] border border-emerald-500/30 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Github className="w-4 h-4 text-emerald-400" />
            <span>GitHub Pages Branch Deployment Status</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            COMPLIANT &amp; READY
          </span>
        </div>

        <p className="text-emerald-200/80 leading-relaxed text-[11px]">
          This project is pre-configured with relative asset paths (<code className="text-emerald-400 font-mono">base: './'</code>), an automated deployment workflow (<code className="text-emerald-400 font-mono">.github/workflows/deploy.yml</code>), and <code className="text-emerald-400 font-mono">.nojekyll</code>. When you push this code to your GitHub repo branch:
        </p>

        <ol className="list-decimal list-inside space-y-1 text-emerald-300/80 font-mono text-[11px]">
          <li>Push to your branch (<code className="text-white">main</code> or <code className="text-white">master</code>).</li>
          <li>In your GitHub repo, navigate to <strong>Settings &gt; Pages</strong>.</li>
          <li>Under <strong>Source</strong>, select <strong>GitHub Actions</strong>.</li>
          <li>The workflow builds and publishes your plant early-warning dashboard with zero broken links!</li>
        </ol>
      </div>

      {/* Calibration Form */}
      <form onSubmit={handleSave} className="p-5 rounded-2xl bg-[#081811] border border-emerald-500/25 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
          <h3 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-xs">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Sensor Calibration Offsets &amp; Alarms</span>
          </h3>
          {saveSuccess && (
            <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved!
            </span>
          )}
        </div>

        {/* Offsets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-emerald-300 font-semibold mb-1">
              Soil Moisture Offset (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.soilMoistureOffset}
              onChange={(e) => setFormData({ ...formData, soilMoistureOffset: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
            <span className="text-[10px] text-emerald-400/60 mt-1 block">Compensate for sensor probe drift</span>
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-1">
              Temperature Offset (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperatureOffset}
              onChange={(e) => setFormData({ ...formData, temperatureOffset: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
            <span className="text-[10px] text-emerald-400/60 mt-1 block">Ambient sensor calibration</span>
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-1">
              VPD Alert Threshold (kPa)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.alertThresholdVPD}
              onChange={(e) => setFormData({ ...formData, alertThresholdVPD: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
            <span className="text-[10px] text-emerald-400/60 mt-1 block">Default: 1.6 kPa</span>
          </div>
        </div>

        {/* Optional Client-Side Gemini Key for Direct GitHub Pages Mode */}
        <div className="p-4 rounded-xl bg-[#06120d] border border-emerald-500/20 space-y-2">
          <label className="block text-emerald-300 font-semibold flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optional: Direct Client Gemini API Key (For Static GitHub Pages Mode)</span>
          </label>
          <input
            type="password"
            value={formData.userGeminiApiKey || ''}
            onChange={(e) => setFormData({ ...formData, userGeminiApiKey: e.target.value })}
            placeholder="AIzaSy... (Only needed if deploying statically to GitHub Pages and requiring live cloud vision)"
            className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
          />
          <p className="text-[10px] text-emerald-400/60 leading-relaxed">
            * Note: When running on AI Studio / Cloud Run, the server handles Gemini API automatically. If deployed to static GitHub Pages where there is no backend server, you can optionally store your personal key here in client localStorage, or use our built-in edge neural diagnostic model.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition shadow-lg shadow-emerald-500/20"
          >
            Save Calibration Parameters
          </button>
        </div>
      </form>

      {/* Data Management & Export */}
      <div className="p-5 rounded-2xl bg-[#081811] border border-emerald-500/25 space-y-4 shadow-xl">
        <h3 className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-xs">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Research Data Backup &amp; Portability</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b2419] hover:bg-[#103323] border border-emerald-500/30 text-emerald-200 font-semibold transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Telemetry Dataset (.JSON)</span>
          </button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b2419] hover:bg-[#103323] border border-emerald-500/30 text-emerald-200 font-semibold transition">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import Dataset (.JSON)</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-semibold transition ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Telemetry</span>
          </button>
        </div>

        {importStatus && (
          <p className="text-emerald-300 font-mono text-[11px] animate-pulse">{importStatus}</p>
        )}
      </div>

    </div>
  );
};
