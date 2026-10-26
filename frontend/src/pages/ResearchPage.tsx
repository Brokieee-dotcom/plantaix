import React, { useState } from 'react';
import { FlaskConical, Plus, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Plant, ResearchNote, ExperimentGroup } from '../types';

interface ResearchPageProps {
  plants: Plant[];
  researchNotes: ResearchNote[];
  onAddNote: (note: Omit<ResearchNote, 'id' | 'date'>) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  plants,
  researchNotes,
  onAddNote,
}) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteGroup, setNoteGroup] = useState<ExperimentGroup>('Combined Stress');
  const [noteAuthor, setNoteAuthor] = useState('Science Club Researcher');
  const [noteContent, setNoteContent] = useState('');
  const [noteStress, setNoteStress] = useState<'Low' | 'Moderate' | 'Severe' | 'Critical'>('Moderate');

  const cohorts = [
    {
      group: 'Control' as ExperimentGroup,
      title: 'Cohort A — Optimal Baseline',
      hypothesis: 'Under stable microclimate (22°C, 65% RH, VPD 0.85-1.1 kPa), guard cell aperture remains regular with zero stomatal resistance oscillation.',
      parameters: 'Substrate moisture 60-70%, PAR 16,000 lx, 14h photoperiod.',
      expectedLead: 'Zero false-positive alarms.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
    {
      group: 'Water Stress' as ExperimentGroup,
      title: 'Cohort B — Substrate Water Deficit',
      hypothesis: 'Substrate water depletion below 30% triggers abscisic acid synthesis, leading to stomatal closure detectable via thermal differential 4-6 hours prior to visual epinasty.',
      parameters: 'Substrate moisture <30%, controlled irrigation delay.',
      expectedLead: 'Early warning lead-time: 5.2 ± 0.8 hours.',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    },
    {
      group: 'Heat Stress' as ExperimentGroup,
      title: 'Cohort C — Thermal Shock Induction',
      hypothesis: 'Sustained temperatures exceeding 32°C will elevate VPD beyond 1.6 kPa, inducing heat shock response and localized edge chlorosis.',
      parameters: 'Ambient temp 33-35°C daylight pulses.',
      expectedLead: 'Thermal delta detectable within 2.5 hours of heat exposure.',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      group: 'Combined Stress' as ExperimentGroup,
      title: 'Cohort D — Synergistic Drought + Heat',
      hypothesis: 'Combined water deficit and high VPD produce compound stress kinetics, accelerating cellular desiccation rate by 2.4x compared to single stressors.',
      parameters: 'Substrate moisture 25%, temp 32.5°C, VPD > 1.8 kPa.',
      expectedLead: 'Critical early warning alert required within 3 hours.',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
    },
  ];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    onAddNote({
      group: noteGroup,
      title: noteTitle.trim(),
      author: noteAuthor.trim() || 'Club Researcher',
      content: noteContent.trim(),
      stressLevelObserved: noteStress,
    });

    setNoteTitle('');
    setNoteContent('');
    setShowAddNote(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Research Cohorts &amp; Scientific Methodology
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            Hypotheses, variable controls, and laboratory observation log for science club presentation
          </p>
        </div>

        <button
          onClick={() => setShowAddNote(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research Note</span>
        </button>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cohorts.map((c, i) => {
          const plantCount = plants.filter((p) => p.experimentGroup === c.group).length;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${c.color} space-y-3 shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                    {c.group} Group
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-emerald-500/20 text-white">
                    {plantCount} Specimens Active
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{c.title}</h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed mt-2">
                  <strong className="text-emerald-300">Hypothesis:</strong> {c.hypothesis}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-500/20 text-[11px] font-mono space-y-1">
                <div>
                  <span className="text-emerald-400/70">Controlled Parameters:</span>{' '}
                  <span className="text-white">{c.parameters}</span>
                </div>
                <div>
                  <span className="text-emerald-400/70">Target Prediction Lead:</span>{' '}
                  <span className="text-emerald-300 font-bold">{c.expectedLead}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#081811] border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Log Botanical Observation Note
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 mb-1">Observation Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Stomatal closure observed at VPD 1.82 kPa"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 mb-1">Target Cohort</label>
                  <select
                    value={noteGroup}
                    onChange={(e) => setNoteGroup(e.target.value as ExperimentGroup)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-100 focus:outline-none"
                  >
                    <option value="Control">Control</option>
                    <option value="Water Stress">Water Stress</option>
                    <option value="Heat Stress">Heat Stress</option>
                    <option value="Combined Stress">Combined Stress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 mb-1">Stress Level Observed</label>
                  <select
                    value={noteStress}
                    onChange={(e) => setNoteStress(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-emerald-100 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 mb-1">Detailed Findings</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Describe foliar turgor, leaf angle shifts, or correlation with logged sensor readings..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0b1f16] border border-emerald-500/30 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-4 py-2 rounded-xl bg-transparent text-emerald-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold"
                >
                  Commit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Research Log Stream */}
      <div className="rounded-2xl bg-[#081811] border border-emerald-500/20 p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Botanical Observations &amp; Experiment Log</span>
        </h3>

        {researchNotes.length > 0 ? (
          <div className="space-y-3">
            {researchNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-[#06120d] border border-emerald-500/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{note.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {note.group}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    note.stressLevelObserved === 'Severe' || note.stressLevelObserved === 'Critical'
                      ? 'border-rose-500/40 text-rose-300 bg-rose-950/40'
                      : 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
                  }`}>
                    {note.stressLevelObserved} Stress
                  </span>
                </div>
                <p className="text-emerald-200/90 leading-relaxed text-[11px]">{note.content}</p>
                <div className="flex items-center justify-between text-[10px] text-emerald-400/60 font-mono pt-1 border-t border-emerald-500/10">
                  <span>Author: {note.author}</span>
                  <span>Date: {note.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-emerald-400/60 text-xs">
            No research notes logged yet. Use the "Add Research Note" button above.
          </div>
        )}
      </div>

    </div>
  );
};
