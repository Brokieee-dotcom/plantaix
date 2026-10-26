import React, { useState } from 'react';
import { SplitSquareVertical, ArrowLeftRight, Layers, Sliders, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Plant, ImageAssessment, BOTANICAL_PRESETS } from '../types';

interface ImageLabPageProps {
  plants: Plant[];
  assessments: ImageAssessment[];
}

export const ImageLabPage: React.FC<ImageLabPageProps> = ({ plants, assessments }) => {
  const [photoA, setPhotoA] = useState<string>(plants[0]?.imageUrl || BOTANICAL_PRESETS[0].url);
  const [photoB, setPhotoB] = useState<string>(plants[1]?.imageUrl || BOTANICAL_PRESETS[1].url);
  const [splitSlider, setSplitSlider] = useState(50);
  const [overlayMode, setOverlayMode] = useState<'split' | 'side-by-side'>('split');

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Image Lab &amp; Morphological Comparison
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Side-by-side chronological leaf differential analysis to observe pre-wilting cellular changes
          </p>
        </div>

        <div className="flex rounded-xl bg-[#081811] border border-emerald-500/30 p-0.5 text-xs font-mono">
          <button
            onClick={() => setOverlayMode('split')}
            className={`px-3 py-1.5 rounded-lg transition ${
              overlayMode === 'split' ? 'bg-emerald-500 text-black font-bold' : 'text-emerald-300'
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setOverlayMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg transition ${
              overlayMode === 'side-by-side' ? 'bg-emerald-500 text-black font-bold' : 'text-emerald-300'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Specimen Photo Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/25 space-y-2">
          <label className="text-xs font-bold text-emerald-300 font-mono uppercase block">
            Baseline Frame (A - Reference / T0)
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {BOTANICAL_PRESETS.slice(0, 5).map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPhotoA(p.url)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                  photoA === p.url ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-emerald-500/20 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt="A" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/25 space-y-2">
          <label className="text-xs font-bold text-amber-300 font-mono uppercase block">
            Stressed Frame (B - Treatment / T+6h)
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {BOTANICAL_PRESETS.slice(1, 6).map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPhotoB(p.url)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                  photoB === p.url ? 'border-amber-400 ring-2 ring-amber-500/40' : 'border-emerald-500/20 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt="B" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Visual Comparison Container */}
      <div className="rounded-2xl bg-[#081710] border border-emerald-500/30 p-5 shadow-2xl space-y-4">
        {overlayMode === 'split' ? (
          <div className="space-y-4">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden border border-emerald-500/30 select-none">
              {/* Image B (Bottom layer) */}
              <img
                src={photoB}
                alt="Frame B"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 text-amber-300 font-mono text-[10px] border border-amber-500/40">
                Frame B: Treatment Phase
              </div>

              {/* Image A (Top clipped layer) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${splitSlider}%` }}
              >
                <img
                  src={photoA}
                  alt="Frame A"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%', minWidth: '100%' }}
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                  Frame A: Baseline (T0)
                </div>
              </div>

              {/* Center Divider Line */}
              <div
                className="absolute inset-y-0 w-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"
                style={{ left: `${splitSlider}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow-lg">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Slider control */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-emerald-400">Baseline (0%)</span>
              <input
                type="range"
                min="0"
                max="100"
                value={splitSlider}
                onChange={(e) => setSplitSlider(Number(e.target.value))}
                className="flex-1 accent-emerald-400 bg-emerald-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-amber-400">Stressed (100%)</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-emerald-500/30 relative aspect-4/3">
              <img src={photoA} alt="Frame A" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                Frame A: Baseline (T0)
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-amber-500/30 relative aspect-4/3">
              <img src={photoB} alt="Frame B" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 text-amber-300 font-mono text-[10px] border border-amber-500/40">
                Frame B: Treatment (T+6h)
              </div>
            </div>
          </div>
        )}

        {/* Morphological Analysis Breakdown */}
        <div className="p-4 rounded-xl bg-[#06120d] border border-emerald-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Differential Foliar Observations</span>
          </div>
          <p className="text-emerald-200/80 leading-relaxed text-[11px]">
            Notice the slight change in petiole angle and leaf margin reflection between the two frames. Under progressive vapor pressure deficit, guard cells lose turgor first, leading to a subtle downward tilt of 4.2° before visible wilting occurs.
          </p>
        </div>
      </div>

    </div>
  );
};
