import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Calendar,
  AlertTriangle,
  Scan,
  Activity,
  Database,
} from 'lucide-react';
import { Plant, ExperimentGroup, EXPERIMENT_GROUPS } from '../types';

interface PlantsPageProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onOpenAddPlant: () => void;
  onOpenScanner: (plantId: string) => void;
  onOpenLogSensor: (plantId: string) => void;
  onLoadReferenceData: () => void;
}

export const PlantsPage: React.FC<PlantsPageProps> = ({
  plants,
  onSelectPlant,
  onOpenAddPlant,
  onOpenScanner,
  onOpenLogSensor,
  onLoadReferenceData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'health' | 'stress' | 'date'>('stress');

  // Filter & Search
  const filteredPlants = plants
    .filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'all' || plant.experimentGroup === selectedGroup;
      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      if (sortBy === 'stress') return b.stressRisk - a.stressRisk;
      if (sortBy === 'date') return new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime();
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Specimen Registry &amp; Flora Cohorts
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Individual botanical profiles, sensor histories, and early-warning stress tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {plants.length === 0 && (
            <button
              onClick={onLoadReferenceData}
              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Load Reference Cohort</span>
            </button>
          )}

          <button
            onClick={onOpenAddPlant}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Specimen</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#081811] p-3 rounded-2xl border border-emerald-500/20 text-xs">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by specimen tag, species, or chamber..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs"
          />
        </div>

        {/* Group Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl font-mono whitespace-nowrap transition ${
              selectedGroup === 'all'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-emerald-300/80 hover:bg-emerald-950/60'
            }`}
          >
            All ({plants.length})
          </button>
          {EXPERIMENT_GROUPS.map((g) => {
            const count = plants.filter((p) => p.experimentGroup === g).length;
            return (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`px-3 py-1.5 rounded-xl font-mono whitespace-nowrap transition ${
                  selectedGroup === g
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-emerald-300/80 hover:bg-emerald-950/60'
                }`}
              >
                {g} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-emerald-400/80">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-200 text-xs font-mono focus:outline-none"
          >
            <option value="stress">Sort: Stress Risk (High first)</option>
            <option value="health">Sort: Health Score</option>
            <option value="name">Sort: Tag Name</option>
            <option value="date">Sort: Planted Date</option>
          </select>
        </div>

      </div>

      {/* Specimen Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="group rounded-2xl bg-[#081811] hover:bg-[#0c2219] border border-emerald-500/20 hover:border-emerald-500/50 transition-all overflow-hidden shadow-xl flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div
                onClick={() => onSelectPlant(plant)}
                className="relative aspect-16/10 overflow-hidden cursor-pointer"
              >
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  {plant.experimentGroup}
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold backdrop-blur-md ${
                    plant.stressRisk > 60
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {plant.stressRisk}% Stress Risk
                  </span>
                </div>
              </div>

              {/* Plant Meta Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => onSelectPlant(plant)}
                      className="font-bold text-white text-base group-hover:text-emerald-300 transition cursor-pointer truncate"
                    >
                      {plant.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b2419] text-emerald-300 border border-emerald-500/20">
                      {plant.growthStage}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400/80 italic font-mono truncate mt-0.5">
                    {plant.species}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400/60 mt-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{plant.location}</span>
                  </div>
                </div>

                {/* Health & Stress Metrics Bar */}
                <div className="pt-2 border-t border-emerald-500/15 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#0a1e15] border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400/60 font-mono block">Health Score</span>
                    <span className="text-base font-bold font-mono text-emerald-300">
                      {plant.healthScore}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0a1e15] border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400/60 font-mono block">Pre-Wilting</span>
                    <span className={`text-base font-bold font-mono ${
                      plant.stressRisk > 60 ? 'text-rose-400' : 'text-emerald-300'
                    }`}>
                      {plant.stressRisk > 60 ? 'Alert' : 'Nominal'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => onOpenScanner(plant.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Scan className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan Leaf</span>
                  </button>
                  <button
                    onClick={() => onOpenLogSensor(plant.id)}
                    className="flex-1 py-2 rounded-xl bg-[#0c281b] hover:bg-[#113524] border border-emerald-500/25 text-emerald-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Telemetry</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#081811] border border-emerald-500/20 space-y-3">
          <Sprout className="w-10 h-10 mx-auto text-emerald-400/40" />
          <h3 className="text-sm font-bold text-white">No botanical specimens found</h3>
          <p className="text-xs text-emerald-400/70 max-w-sm mx-auto">
            {searchTerm || selectedGroup !== 'all'
              ? 'Try adjusting your search criteria or filter selection.'
              : 'Add your first plant to start monitoring substrate moisture and optical health.'}
          </p>
          <button
            onClick={onOpenAddPlant}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition"
          >
            Register Specimen Now
          </button>
        </div>
      )}

    </div>
  );
};
