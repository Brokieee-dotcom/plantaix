import React, { useState } from 'react';
import {
  Scan,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Leaf,
  Info,
} from 'lucide-react';
import { Plant, ImageAssessment, BOTANICAL_PRESETS, LEAF_CONDITIONS, GROWTH_STAGES } from '../types';
import { analyzePlantPhoto, PlantAnalysisResult } from '../services/aiService';

interface ScannerPageProps {
  plants: Plant[];
  preselectedPlantId?: string;
  onSaveAssessment: (assessment: ImageAssessment) => void;
  onSelectPlant: (plant: Plant) => void;
  onOpenAddPlant: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  plants,
  preselectedPlantId,
  onSaveAssessment,
  onSelectPlant,
  onOpenAddPlant,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState(preselectedPlantId || (plants[0]?.id || ''));
  const [imagePreview, setImagePreview] = useState<string>(plants.find(p => p.id === (preselectedPlantId || plants[0]?.id))?.imageUrl || BOTANICAL_PRESETS[0].url);
  const [scanStage, setScanStage] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysisResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImagePreview(event.target.result);
        setScanStage('idle');
        setAnalysisResult(null);
        setIsSaved(false);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setImagePreview(presetUrl);
    setScanStage('idle');
    setAnalysisResult(null);
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleRunScan = async () => {
    if (!imagePreview) return;
    setScanStage('scanning');
    setErrorMessage(null);

    try {
      const result = await analyzePlantPhoto({
        imageBase64: imagePreview,
        plantName: selectedPlant?.name || 'Specimen',
        species: selectedPlant?.species || 'Unknown Flora',
        experimentGroup: selectedPlant?.experimentGroup || 'Observational',
      });

      setAnalysisResult(result);
      setScanStage('results');
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Vision diagnosis encountered an issue. Please try again.');
      setScanStage('idle');
    }
  };

  const handleCommitAssessment = () => {
    if (!analysisResult || !selectedPlant) return;

    const newAssessment: ImageAssessment = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      timestamp: new Date().toISOString(),
      imageUrl: imagePreview,
      healthScore: analysisResult.healthScore,
      stressRisk: analysisResult.stressRisk,
      growthStage: analysisResult.growthStage,
      leafCondition: analysisResult.leafCondition,
      stressVectors: analysisResult.stressVectors,
      chlorophyllIndex: analysisResult.chlorophyllIndex,
      necroticAreaPercent: analysisResult.necroticAreaPercent,
      scientificDiagnosis: analysisResult.scientificDiagnosis,
      recommendations: analysisResult.recommendations,
      leafTurgorStatus: analysisResult.leafTurgorStatus,
    };

    onSaveAssessment(newAssessment);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              AI Vision Optical Scanner
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              MULTISPECTRAL AI
            </span>
          </div>
          <p className="text-xs text-emerald-400/70 mt-1">
            Detect cellular turgor loss, chlorophyll decline, and leaf necrosis before visual drooping appears.
          </p>
        </div>

        {plants.length === 0 && (
          <button
            onClick={onOpenAddPlant}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            Register Specimen First
          </button>
        )}
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Target & Scanner Viewport (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Specimen Target Selector */}
          <div className="p-4 rounded-2xl bg-[#081811] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-emerald-400/80 block mb-1">
                Target Specimen
              </label>
              {plants.length > 0 ? (
                <select
                  value={selectedPlantId}
                  onChange={(e) => {
                    setSelectedPlantId(e.target.value);
                    const p = plants.find((x) => x.id === e.target.value);
                    if (p) setImagePreview(p.imageUrl);
                    setScanStage('idle');
                    setAnalysisResult(null);
                    setIsSaved(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0c2419] border border-emerald-500/30 text-emerald-200 text-xs font-mono focus:outline-none"
                >
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species}) — [{p.experimentGroup}]
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-amber-400">Observational Specimen (Reference)</span>
              )}
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition self-start sm:self-auto">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Optical Scanner Viewport */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/30 shadow-2xl flex items-center justify-center group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Plant specimen to scan"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 text-emerald-400/60 text-xs space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-emerald-500/30" />
                <p>Select or upload a specimen leaf photograph</p>
              </div>
            )}

            {/* Futuristic HUD Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
              </div>

              {/* Scanning Laser Beam */}
              {scanStage === 'scanning' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanline" />
              )}

              {/* Central Target Reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-32 h-32 rounded-full border border-dashed transition-all duration-700 ${
                  scanStage === 'scanning'
                    ? 'border-emerald-400 scale-110 animate-spin'
                    : 'border-emerald-500/30'
                }`} />
              </div>

              {/* Bottom status HUD */}
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${scanStage === 'scanning' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  {scanStage === 'scanning' ? 'ANALYZING CELLULAR TURGOR...' : 'OPTICAL RESOLUTION: 1080P'}
                </span>
                <span>SPECTRAL: RGB + CHLOROPHYLL REFLECTANCE</span>
              </div>
            </div>
          </div>

          {/* Preset Botanical Photos Quick Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-emerald-400/80 block">
              Quick Select Specimen Preset:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {BOTANICAL_PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPreset(p.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    imagePreview === p.url ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-emerald-500/20 hover:border-emerald-500/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Scan Button */}
          <button
            onClick={handleRunScan}
            disabled={scanStage === 'scanning' || !imagePreview}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-sm transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {scanStage === 'scanning' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Botanical Neural Diagnosis...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Execute AI Vision Diagnostic Scan</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

        </div>

        {/* Right Column: AI Results & Diagnostic Dossier (Col 5) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#081710] border border-emerald-500/30 p-5 shadow-xl flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Diagnostic Dossier
              </h3>
            </div>
            {analysisResult && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {analysisResult.engineUsed.includes('Cloud') ? 'Gemini 3.8' : 'Neural Edge'}
              </span>
            )}
          </div>

          {scanStage === 'idle' && !analysisResult && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 text-emerald-400/60 text-xs">
              <Sparkles className="w-10 h-10 text-emerald-400/30 animate-pulse" />
              <p className="font-semibold text-emerald-300">Ready for Optical Analysis</p>
              <p className="text-[11px] leading-relaxed max-w-xs">
                Upload or select a specimen photo on the left, then click <strong>"Execute AI Vision Diagnostic Scan"</strong>.
              </p>
            </div>
          )}

          {scanStage === 'scanning' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-emerald-300 text-xs">
              <div className="relative flex items-center justify-center w-16 h-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30" />
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400">
                  <Scan className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              </div>
              <p className="font-mono font-bold text-sm text-white">Segmenting Foliage Lamina...</p>
              <p className="text-[11px] text-emerald-400/70 max-w-xs font-mono">
                Computing chlorophyll absorption indices, necrotic lesion contours, and stomatal resistance probability.
              </p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 text-xs flex-1 overflow-y-auto max-h-[580px] pr-1">
              
              {/* Primary Dual Score Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0a1e15] border border-emerald-500/25 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-400/80 block">
                    Health Score
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">
                    {analysisResult.healthScore}%
                  </div>
                  <span className="text-[10px] text-emerald-400/60 block mt-1">
                    {analysisResult.leafCondition}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0a1e15] border border-emerald-500/25 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-400/80 block">
                    Stress Probability
                  </span>
                  <div className={`text-2xl font-extrabold font-mono mt-0.5 ${
                    analysisResult.stressRisk > 60 ? 'text-rose-400' : 'text-emerald-300'
                  }`}>
                    {analysisResult.stressRisk}%
                  </div>
                  <span className="text-[10px] text-emerald-400/60 block mt-1">
                    {analysisResult.leafTurgorStatus || 'Turgid'}
                  </span>
                </div>
              </div>

              {/* Stress Factors & Morphometrics */}
              <div className="p-3.5 rounded-xl bg-[#091b12] border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>Chlorophyll Index:</span>
                  <span className="font-bold text-white font-mono">
                    {analysisResult.chlorophyllIndex.toFixed(2)} / 1.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>Necrotic Area:</span>
                  <span className="font-bold text-white font-mono">
                    {analysisResult.necroticAreaPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>Development Stage:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {analysisResult.growthStage}
                  </span>
                </div>

                {/* Vectors Badges */}
                <div className="pt-2 border-t border-emerald-500/15">
                  <span className="text-[10px] text-emerald-400/70 font-mono block mb-1.5">
                    Identified Stress Vectors:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.stressVectors.map((v, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-200"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botanical Scientific Diagnosis */}
              <div className="p-3.5 rounded-xl bg-[#091b12] border border-emerald-500/20 space-y-1.5">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Botanical Diagnosis
                </h4>
                <p className="text-emerald-100/90 leading-relaxed text-[11px]">
                  {analysisResult.scientificDiagnosis}
                </p>
              </div>

              {/* Prescriptive Interventions */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#091b12] border border-emerald-500/20 space-y-1.5">
                  <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Early-Warning Action Protocol
                  </h4>
                  <ul className="space-y-1 text-[11px] text-emerald-200/80 list-disc list-inside">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save Assessment to Plant History */}
              {selectedPlant && (
                <button
                  onClick={handleCommitAssessment}
                  disabled={isSaved}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isSaved
                      ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Saved to {selectedPlant.name} History!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Commit Diagnosis to {selectedPlant.name}</span>
                    </>
                  )}
                </button>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
