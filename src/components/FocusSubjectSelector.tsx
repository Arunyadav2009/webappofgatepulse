import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { FOCUS_STRATEGY_PRESETS } from '../data/focusPresets';
import {
  Target,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Percent,
  Calculator,
  Check,
  Award,
  Share2,
  Calendar,
  Clock,
  Compass,
  Lightbulb
} from 'lucide-react';

export const FocusSubjectSelector: React.FC = () => {
  const {
    subjects,
    selectedSubjectIds,
    toggleSubjectFocus,
    selectAllFocusSubjects,
    clearAllFocusSubjects,
    applyFocusPreset,
    isFocusScopeActive,
    setIsFocusScopeActive,
    focusStats,
    setActiveTab,
    targetScore,
    stats,
    setIsShareModalOpen
  } = useGateContext();

  const [availableDaysInput, setAvailableDaysInput] = useState<number>(stats.daysLeft || 60);

  const isAllSelected = selectedSubjectIds.length === subjects.length;

  // Selected subjects list
  const selectedSubjects = subjects.filter(s => selectedSubjectIds.includes(s.id));

  // Compute allocated days per selected subject based on marks weightage
  const totalFocusMarks = focusStats.totalPossibleMarks || 1;
  const timeAllocation = selectedSubjects.map(s => {
    const fraction = s.avgMarks / totalFocusMarks;
    const allocatedDays = Math.max(1, Math.round(availableDaysInput * fraction));
    return {
      id: s.id,
      name: s.name,
      shortCode: s.shortCode,
      avgMarks: s.avgMarks,
      allocatedDays
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Strategy & Scope Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <Target className="w-4 h-4" />
              <span>Upcoming Exam Targeted Scope</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Selected Limited Subjects for Upcoming Exam
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Preparing with limited time? Manually choose the specific subjects you want to master for the upcoming exam. Focus all your revision, PYQ solving, and formula drills on these high-probability marks.
            </p>
          </div>

          {/* Scope Mode Toggle Switch & Create Link */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
              title="Create a shareable link for this focus study plan"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Create Plan Link</span>
            </button>

            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Focus Filter Mode</span>
                <p className="text-[10px] text-slate-400">
                  {isFocusScopeActive ? 'Only focus subjects shown in app' : 'Full syllabus active'}
                </p>
              </div>

              <button
                onClick={() => setIsFocusScopeActive(!isFocusScopeActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isFocusScopeActive
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isFocusScopeActive ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isFocusScopeActive ? 'Filter On' : 'Enable'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Marks Potential Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Subjects Selected</span>
            <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-0.5">
              {focusStats.selectedCount} <span className="text-xs text-slate-500 font-sans font-normal">/ {subjects.length}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {isAllSelected ? 'Full coverage' : `${subjects.length - focusStats.selectedCount} skipped`}
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Target Marks Ceiling</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              ~{focusStats.totalPossibleMarks} <span className="text-xs text-slate-500 font-sans font-normal">/ 100M</span>
            </div>
            <span className="text-[11px] text-slate-500">Max potential score</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Selected Subtopics Done</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {focusStats.completedSubtopics} <span className="text-xs text-slate-500 font-sans font-normal">/ {focusStats.totalSubtopics}</span>
            </div>
            <span className="text-[11px] text-slate-500">{focusStats.overallPercentage}% prepared</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Est. Net Score @ 85% Acc.</span>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              ~{Math.round(focusStats.totalPossibleMarks * 0.85)} <span className="text-xs text-slate-500 font-sans font-normal">marks</span>
            </div>
            <span className="text-[11px] text-slate-500">Your goal: {targetScore}+</span>
          </div>
        </div>
      </div>

      {/* Strategy Preset Packages */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Strategic Packages</span>
            </h2>
            <p className="text-xs text-slate-400">One-click curated subject combinations optimized by GATE toppers</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={selectAllFocusSubjects}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
            >
              Select All (100M)
            </button>
            <button
              onClick={clearAllFocusSubjects}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded font-medium transition-colors"
            >
              Reset Selection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {FOCUS_STRATEGY_PRESETS.map(preset => {
            const isMatching =
              preset.subjectIds.length === selectedSubjectIds.length &&
              preset.subjectIds.every(id => selectedSubjectIds.includes(id));

            return (
              <div
                key={preset.id}
                onClick={() => applyFocusPreset(preset.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isMatching
                    ? 'bg-indigo-950/40 border-indigo-600/80 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{preset.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {preset.badge}
                    </span>
                  </div>
                  {isMatching && (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">{preset.description}</p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {preset.subjectIds.map(sid => {
                    const subj = subjects.find(s => s.id === sid);
                    return (
                      <span
                        key={sid}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {subj?.shortCode || sid}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Subject Checklist Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">Manual Subject Picker (Choose Any Combination)</h2>
            <p className="text-xs text-slate-400">Click any subject card to toggle whether it is included in your upcoming exam preparation scope.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {selectedSubjectIds.length} of {subjects.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {subjects.map(subject => {
            const isSelected = selectedSubjectIds.includes(subject.id);
            let totalSub = 0;
            let compSub = 0;
            subject.topics.forEach(t => {
              t.subtopics.forEach(s => {
                totalSub++;
                if (s.completed) compSub++;
              });
            });
            const pct = totalSub > 0 ? Math.round((compSub / totalSub) * 100) : 0;

            return (
              <div
                key={subject.id}
                onClick={() => toggleSubjectFocus(subject.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-950/80 border-indigo-600/70 shadow-xs'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-indigo-300">
                        {subject.shortCode}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-emerald-400">
                      ~{subject.avgMarks} Marks
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {subject.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                      <span>{compSub} / {totalSub} subtopics</span>
                      <span>·</span>
                      <span className="text-slate-300">{pct}% ready</span>
                    </div>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isSelected ? 'bg-indigo-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Time Budget & Revision Allocator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Exam Time Budget & Subject Day Allocation</span>
            </h2>
            <p className="text-xs text-slate-400">
              Proportionately allocate your available study days across your {selectedSubjects.length} selected subjects based on GATE weightage.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Days to Exam:</span>
            <input
              type="number"
              min={7}
              max={365}
              value={availableDaysInput}
              onChange={e => setAvailableDaysInput(Math.max(1, Number(e.target.value)))}
              className="w-20 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-center font-mono font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 font-mono">days</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {timeAllocation.map(alloc => (
            <div
              key={alloc.id}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1 text-center"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="font-bold text-indigo-300">{alloc.shortCode}</span>
                <span className="text-emerald-400">~{alloc.avgMarks}M</span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {alloc.allocatedDays} <span className="text-[11px] font-sans text-slate-400 font-normal">days</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{alloc.name}</p>
            </div>
          ))}
          {timeAllocation.length === 0 && (
            <div className="col-span-full py-4 text-center text-xs text-slate-500">
              Select at least 1 subject above to see your time budget allocation.
            </div>
          )}
        </div>
      </div>

      {/* Strategic Golden Rules for Limited Subject Preparation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Strategic Golden Rules for Limited Subject GATE Preparation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-indigo-300">1. Depth Over Breadth</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              3 thorough revision rounds on 5 high-yield subjects yields a much higher AIR than skimming all 11 subjects superficially and making negative mark errors.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-300">2. Master NAT Questions</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Numerical Answer Type (NAT) questions have zero negative marking in GATE. Thoroughly drill numerical problem solving in your selected focus subjects.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-300">3. General Aptitude is Non-Negotiable</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              GA carries an exact 15 marks with the highest scoring consistency in GATE CS. Always include GA in your manual selection package.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer: Jump to Targeted Syllabus */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Ready to Drill Your Selected Focus Subjects?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Open the 3-round syllabus tracker or PYQ bank filtered specifically to your {focusStats.selectedCount} target subjects.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setIsFocusScopeActive(true);
              setActiveTab('syllabus');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Target Syllabus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
