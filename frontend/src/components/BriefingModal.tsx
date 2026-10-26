import React, { useState } from 'react';
import { Copy, Check, X, FileText, Sparkles, Award, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const briefingText = `PLANT-X — Science Club Leader Briefing & Research Summary
===========================================================

1. WHAT IT IS:
PLANT-X is an AI-powered botanical early-warning platform that predicts plant stress before visible symptoms (wilting, yellowing, leaf necrosis) appear.

2. THE PROBLEM IT SOLVES:
Traditional plant management and agriculture are reactive: by the time a human notices drooping or chlorosis, cellular damage has already occurred, reducing biomass and harvest yields by 30-50%.

3. THE SOLUTION:
PLANT-X combines continuous multi-sensor telemetry (soil moisture %, ambient temperature, relative humidity, light PAR, and calculated Vapor Pressure Deficit / VPD) with AI computer vision diagnostics. 

4. CORE INNOVATION — PREDICTION VS DETECTION:
Standard smart monitors just state: "The soil is 28%."
PLANT-X calculates: "This specimen has an 84% probability of acute physiological stress within 6 hours due to combined high VPD (1.92 kPa) and root zone water deficit."

5. DEMONSTRATION HIGHLIGHTS:
- Interactive AI Vision Scanner: upload or photograph a plant leaf to immediately assess health score (0-100), stress risk %, leaf condition, and estimated chlorophyll index.
- Animated Telemetry Telemetry: dynamic VPD curve calculations and threshold alarms.
- Research Experiment Tracking: compares Control specimens against Water Stress, Thermal Stress, and Combined Stress cohorts.
- GitHub Pages Deployment: engineered to run seamlessly as a static branch deployment without server crashes.

6. DEVELOPMENT PHASES (ROADMAP):
- Version 1 (Current): Real-time multi-sensor telemetry + baseline stress probability algorithm + GitHub Pages readiness.
- Version 2 (Current): Gemini Vision AI leaf analysis + Dr. Xylem botanical research assistant chatbot.
- Version 3: Multi-spectral NIR (near-infrared) NDVI camera integration.
- Version 4: Autonomous closed-loop micro-dosing irrigation and automated climate chamber regulation.

7. CLUB PRESENTATION TALKING POINTS:
- "Why wait for a plant to wilt when physics and computer vision can tell us hours in advance?"
- "Our system bridges hardware IoT sensors with cutting-edge multimodal AI."
- "All data is stored locally with zero vendor lock-in and can be audited by any researcher."`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#081710] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-emerald-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#06120d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Club Leader Research Briefing &amp; Presentation Notes
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">PLANT-X v2.0</span>
              </h2>
              <p className="text-xs text-emerald-400/70">Scannable reference notes ready to present to your science club leader or teacher.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-emerald-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
          {/* Quick Copy Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-semibold text-white">Need these notes copied into your notebook?</p>
                <p className="text-xs text-emerald-300/80">One click copies the entire briefing in clean markdown format.</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition shadow-lg shadow-emerald-500/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Club Notes'}
            </button>
          </div>

          {/* Section 1: The Core Mission */}
          <div className="p-4 rounded-xl bg-[#0b1e15] border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>1. What It Is</span>
            </div>
            <p className="text-emerald-100/90 text-xs">
              An AI-powered early-warning platform predicting plant stress <strong>before visible signs</strong> (wilting, chlorosis, cellular desiccation) manifest. Built for precision botanists, greenhouse stewards, and science club researchers.
            </p>
          </div>

          {/* Section 2: Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>The Problem (Reactive)</span>
              </div>
              <p className="text-rose-100/80 text-xs leading-relaxed">
                Humans only notice plant stress when leaves turn yellow or drop. By that time, cellular apoptosis and vascular damage have reduced plant yield by up to 50%.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>The Solution (Predictive)</span>
              </div>
              <p className="text-emerald-100/80 text-xs leading-relaxed">
                Correlating substrate moisture, temperature, humidity, and <strong>Vapor Pressure Deficit (VPD)</strong> with computer vision reflectance, forecasting stress probability up to 6 hours ahead of time.
              </p>
            </div>
          </div>

          {/* Section 3: Key Demo Features */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">Key Demonstration Features to Show</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0c1f17] border border-emerald-500/15">
                <div className="font-semibold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  Interactive Plant Scanner
                </div>
                <p className="text-emerald-300/70">Upload specimen photo to evaluate Health Score (0-100), Stress Risk %, Chlorophyll Index, and leaf condition.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1f17] border border-emerald-500/15">
                <div className="font-semibold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  Dynamic Sensor Telemetry
                </div>
                <p className="text-emerald-300/70">Automatic Tetens VPD calculation with stress thresholds and multi-plant historical graphs.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1f17] border border-emerald-500/15">
                <div className="font-semibold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  4 Research Cohorts
                </div>
                <p className="text-emerald-300/70">Control vs Water Deficit vs Thermal Shock vs Synergistic Combined Stress.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0c1f17] border border-emerald-500/15">
                <div className="font-semibold text-emerald-200 mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  GitHub Pages Ready
                </div>
                <p className="text-emerald-300/70">Runs on any branch deployment with zero broken assets, local storage persistence, and zero fake data.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Roadmap */}
          <div className="p-4 rounded-xl bg-[#091a12] border border-emerald-500/20">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 mb-3">Improvement Roadmap (V1 to V4)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-mono text-emerald-400 font-bold">V1 (Built)</div>
                <div className="text-emerald-200/80 mt-1">Multi-Sensor Telemetry &amp; VPD Model</div>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-mono text-emerald-400 font-bold">V2 (Built)</div>
                <div className="text-emerald-200/80 mt-1">Gemini AI Vision &amp; Research Chat</div>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-mono text-emerald-400 font-bold">V3 (Next)</div>
                <div className="text-emerald-200/80 mt-1">Multispectral NIR Camera &amp; NDVI</div>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">
                <div className="font-mono text-emerald-400 font-bold">V4 (Future)</div>
                <div className="text-emerald-200/80 mt-1">Autonomous Micro-Dosing Irrigation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-emerald-500/20 bg-[#06120d]">
          <span className="text-xs text-emerald-400/60 font-mono">Prepared for Botanical Science Research</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
            >
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
