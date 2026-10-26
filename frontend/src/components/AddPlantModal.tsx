import React, { useState } from 'react';
import { X, Sprout, Upload, Image as ImageIcon } from 'lucide-react';
import { Plant, ExperimentGroup, GrowthStage, EXPERIMENT_GROUPS, GROWTH_STAGES, BOTANICAL_PRESETS } from '../types';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plant: Plant) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [group, setGroup] = useState<ExperimentGroup>('Control');
  const [stage, setStage] = useState<GrowthStage>('Vegetative');
  const [location, setLocation] = useState('Growth Chamber Alpha');
  const [imageUrl, setImageUrl] = useState(BOTANICAL_PRESETS[0].url);
  const [notes, setNotes] = useState('');
  const [customImageLoading, setCustomImageLoading] = useState(false);

  if (!isOpen) return null;

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomImageLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
      setCustomImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof BOTANICAL_PRESETS[0]) => {
    setImageUrl(preset.url);
    if (!species) setSpecies(preset.species);
    if (!name) setName(preset.name.split(' (')[0]);
    setGroup(preset.group);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlant: Plant = {
      id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      species: species.trim() || 'Botanical Specimen',
      experimentGroup: group,
      growthStage: stage,
      location: location.trim() || 'General Greenhouse',
      plantedDate: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || BOTANICAL_PRESETS[0].url,
      notes: notes.trim(),
      healthScore: group === 'Control' ? 95 : group === 'Water Stress' ? 70 : 65,
      stressRisk: group === 'Control' ? 8 : group === 'Water Stress' ? 68 : 72,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newPlant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#081710] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-emerald-50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#06120d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register Botanical Specimen</h2>
              <p className="text-xs text-emerald-400/70">Add a new plant to telemetry and stress monitoring</p>
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
          
          {/* Preset Botanical Photography Selector */}
          <div className="space-y-2">
            <label className="block text-emerald-300 font-semibold uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Select High-Resolution Botanical Photography
              </span>
              <span className="text-[10px] text-emerald-400/70 font-normal">Real photography presets</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BOTANICAL_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    imageUrl === p.url
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-105'
                      : 'border-emerald-500/20 hover:border-emerald-500/60 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-emerald-200 truncate font-mono text-center">
                    {p.species.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Photo Upload */}
            <div className="pt-2 flex items-center justify-between">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs transition">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Custom Specimen Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
              {customImageLoading && (
                <span className="text-emerald-400 animate-pulse text-[11px]">Processing image...</span>
              )}
            </div>
          </div>

          {/* Plant Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Specimen Name / Tag *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arabidopsis WT-04"
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Botanical Species
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Arabidopsis thaliana"
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs"
              />
            </div>
          </div>

          {/* Cohort & Growth Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Experiment Cohort
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as ExperimentGroup)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-100 focus:outline-none focus:border-emerald-400 text-xs"
              >
                {EXPERIMENT_GROUPS.map((g) => (
                  <option key={g} value={g} className="bg-[#091a12] text-white">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Growth Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as GrowthStage)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-100 focus:outline-none focus:border-emerald-400 text-xs"
              >
                {GROWTH_STAGES.map((s) => (
                  <option key={s} value={s} className="bg-[#091a12] text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-1">
                Chamber / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tray B-02"
                className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs"
              />
            </div>
          </div>

          {/* Research Notes */}
          <div>
            <label className="block text-emerald-300 font-semibold mb-1">
              Initial Observations &amp; Substrate Setup
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Potting substrate 60/40 peat/perlite with 100ml baseline hydration. Monitored for early guard cell stress response."
              className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs resize-none"
            />
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
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              Save &amp; Initialize Specimen
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
