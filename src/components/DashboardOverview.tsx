import React from 'react';
import { useGateContext } from '../context/GateContext';
import { FOCUS_STRATEGY_PRESETS } from '../data/focusPresets';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Play,
  Cloud,
  UserCheck,
  Target,
  Share2,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    subjects,
    stats,
    setActiveTab,
    mockTests,
    mistakes,
    dailyTargets,
    toggleDailyTarget,
    setIsCalculatorOpen,
    setIsShareModalOpen,
    examDate,
    targetScore,
    currentUser,
    syncStatus,
    selectedSubjectIds,
    toggleSubjectFocus,
    selectAllFocusSubjects,
    clearAllFocusSubjects,
    applyFocusPreset,
    isFocusScopeActive,
    setIsFocusScopeActive,
    focusStats
  } = useGateContext();

  // Subject completion breakdown
  const subjectProgress = subjects.map(s => {
    let total = 0;
    let completed = 0;
    let r1 = 0;
    let r2 = 0;
    let r3 = 0;

    s.topics.forEach(t => {
      t.subtopics.forEach(sub => {
        total++;
        if (sub.completed) completed++;
        if (sub.round1) r1++;
        if (sub.round2) r2++;
        if (sub.round3) r3++;
      });
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      id: s.id,
      name: s.name,
      shortCode: s.shortCode,
      avgMarks: s.avgMarks,
      total,
      completed,
      pct,
      r1,
      r2,
      r3
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Exam Countdown & Target Cockpit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
              <span className="text-indigo-400 font-semibold">GATE CS & IT</span>
              <span aria-hidden="true">·</span>
              <span>Target: IIT Bombay / Top 100 AIR</span>
              <span aria-hidden="true">·</span>
              <span>Exam: {examDate}</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Cloud className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={currentUser ? 'text-emerald-400' : 'text-slate-400'}>
                  {currentUser ? `Cloud: ${currentUser.email?.split('@')[0]}` : 'Cloud: Connect Profile'}
                </span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Preparation Progress & Target Readiness
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Track multi-round revisions across all 11 GATE CS subjects, analyze mock tests, debug conceptual mistakes, and master the official virtual scientific calculator.
            </p>
          </div>

          {/* Countdown & Goal Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Days to Exam</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {stats.daysLeft}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Feb 2027 Session</div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Study Streak</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
                {stats.studyStreakDays} <span className="text-xs text-slate-400 font-sans font-normal">days</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{stats.totalHoursLogged}h logged</div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-center col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Score</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {targetScore} <span className="text-xs text-slate-400 font-sans font-normal">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Top PSU / M.Tech</div>
            </div>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
            <span className="font-semibold text-slate-300">Overall Syllabus Completion</span>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>Round 1: {stats.round1Percentage}%</span>
              <span>·</span>
              <span>Round 2: {stats.round2Percentage}%</span>
              <span>·</span>
              <span>Round 3: {stats.round3Percentage}%</span>
              <span>·</span>
              <span className="text-indigo-400 font-semibold">{stats.overallPercentage}% Final</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-indigo-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: Selected Limited Subjects for Upcoming Exam (Manual Selection) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono flex-wrap">
              <span className="flex items-center gap-1 font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>UPCOMING EXAM SCOPE</span>
              </span>
              <span>·</span>
              <span className="text-slate-400">Manual Subject Selection</span>
              {isFocusScopeActive && (
                <>
                  <span>·</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Focus Filter Active in App</span>
                  </span>
                </>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Selected Limited Subjects for Upcoming Exam
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Preparing with limited time? Manually choose the specific subjects you want to prepare. Click any subject card below to toggle it in your exam scope.
            </p>
          </div>

          {/* Action buttons: Focus Mode Toggle + Create Plan Link + Full Studio */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setIsFocusScopeActive(!isFocusScopeActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isFocusScopeActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle whether all app views filter to only your selected focus subjects"
            >
              {isFocusScopeActive ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isFocusScopeActive ? 'Scope Filter On' : 'Filter Views to Focus'}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
              title="Create a shareable link for this manual subject selection"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Create Plan Link</span>
            </button>

            <button
              onClick={() => setActiveTab('focus')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>Full Configurator</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Real-time Marks Potential and Readiness Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Selected Subjects</span>
            <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-0.5">
              {focusStats.selectedCount} <span className="text-xs text-slate-500 font-sans font-normal">/ {subjects.length}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {focusStats.selectedCount === subjects.length ? 'Full syllabus' : `${subjects.length - focusStats.selectedCount} subjects skipped`}
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
            <span className="text-xs text-slate-400">Est. Score @ 85% Acc.</span>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              ~{Math.round(focusStats.totalPossibleMarks * 0.85)} <span className="text-xs text-slate-500 font-sans font-normal">marks</span>
            </div>
            <span className="text-[11px] text-slate-500">Target goal: {targetScore}+</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400">Preparation in Scope</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
              {focusStats.overallPercentage}%
            </div>
            <span className="text-[11px] text-slate-500">{focusStats.completedSubtopics} / {focusStats.totalSubtopics} subtopics</span>
          </div>
        </div>

        {/* Manual Subject Selector Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              Click any subject to toggle manual inclusion for the upcoming exam:
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button
                onClick={selectAllFocusSubjects}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Select All
              </button>
              <span>·</span>
              <button
                onClick={clearAllFocusSubjects}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {subjects.map(subj => {
              const isSelected = selectedSubjectIds.includes(subj.id);
              let totalSub = 0;
              let compSub = 0;
              subj.topics.forEach(t => {
                t.subtopics.forEach(s => {
                  totalSub++;
                  if (s.completed) compSub++;
                });
              });
              const pct = totalSub > 0 ? Math.round((compSub / totalSub) * 100) : 0;

              return (
                <div
                  key={subj.id}
                  onClick={() => toggleSubjectFocus(subj.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all select-none flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-950/90 border-indigo-500/80 shadow-xs ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                        {subj.shortCode}
                      </span>
                    </div>

                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-slate-800 text-emerald-400 shrink-0">
                      ~{subj.avgMarks}M
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {subj.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                      <span>{compSub}/{totalSub} done</span>
                      <span>·</span>
                      <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>{pct}% ready</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isSelected ? 'bg-indigo-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Topper Presets Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Topper Presets:</span>
            </span>
            {FOCUS_STRATEGY_PRESETS.map(preset => {
              const isMatching =
                preset.subjectIds.length === selectedSubjectIds.length &&
                preset.subjectIds.every(id => selectedSubjectIds.includes(id));

              return (
                <button
                  key={preset.id}
                  onClick={() => applyFocusPreset(preset.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                    isMatching
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setIsFocusScopeActive(true);
              setActiveTab('syllabus');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Open in Syllabus Tracker</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Box Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Syllabus Checklist */}
        <div
          onClick={() => setActiveTab('syllabus')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Syllabus Subtopics</span>
            <BookOpen className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats.completedSubtopics} <span className="text-sm font-normal text-slate-500">/ {stats.totalSubtopics}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span>{stats.shortNotesPercentage}% short notes ready</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400 font-medium group-hover:underline">Open syllabus</span>
          </div>
        </div>

        {/* Metric 2: PYQ Solved Count */}
        <div
          onClick={() => setActiveTab('pyqs')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Previous Year Questions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats.totalPyqsSolved} <span className="text-sm font-normal text-slate-500">PYQs logged</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span>{stats.totalPyqsBookmarked} starred high-yield</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium group-hover:underline">Solve bank</span>
          </div>
        </div>

        {/* Metric 3: Mock Test Performance */}
        <div
          onClick={() => setActiveTab('mocks')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Mock Test Average</span>
            <TrendingUp className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats.averageMockScore} <span className="text-sm font-normal text-slate-500">marks avg</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span>Peak: {stats.highestMockScore} / 100</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-medium group-hover:underline">{mockTests.length} tests logged</span>
          </div>
        </div>

        {/* Metric 4: Mistake Notebook */}
        <div
          onClick={() => setActiveTab('mistakes')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Error Notebook</span>
            <AlertCircle className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {stats.unresolvedMistakes} <span className="text-sm font-normal text-slate-500">unresolved</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span>{mistakes.filter(m => m.resolved).length} errors mastered</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400 font-medium group-hover:underline">Review flaws</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Split: Subject Readiness Matrix + Daily Targets & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject Breakdown Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Subject-wise Readiness Matrix</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Marks weightage distribution and 3-round revision depth
              </p>
            </div>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Detailed view</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {subjectProgress.map(subj => (
              <div
                key={subj.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {subj.shortCode}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-200 font-medium truncate max-w-[240px]">
                      {subj.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-indigo-400 font-medium">~{subj.avgMarks} Marks</span>
                    <span aria-hidden="true">·</span>
                    <span>{subj.completed} / {subj.total} subtopics</span>
                  </div>
                </div>

                {/* Progress bar + Revision check states */}
                <div className="flex items-center gap-4 sm:justify-end flex-1">
                  <div className="w-32 hidden sm:block">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${subj.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${subj.r1 === subj.total && subj.total > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'}`}>
                      R1: {subj.r1}/{subj.total}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${subj.r2 === subj.total && subj.total > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'}`}>
                      R2: {subj.r2}/{subj.total}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${subj.r3 === subj.total && subj.total > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'}`}>
                      R3: {subj.r3}/{subj.total}
                    </span>
                  </div>

                  <div className="text-right font-mono text-xs font-semibold text-white w-10 tabular-nums">
                    {subj.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Daily Action Deck & Quick Tools */}
        <div className="space-y-5">
          {/* Daily Goals Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Daily Focus Targets</h2>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {dailyTargets.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  No targets for today. Add targets in Planner tab.
                </div>
              ) : (
                dailyTargets.map(target => (
                  <div
                    key={target.id}
                    onClick={() => toggleDailyTarget(target.id)}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={target.completed}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${target.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {target.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="uppercase text-slate-400">{target.subjectId}</span>
                        <span aria-hidden="true">·</span>
                        <span className={target.priority === 'high' ? 'text-rose-400' : target.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'}>
                          {target.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tools & GATE Calculator Banner */}
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">TCS iON Scientific Calculator</h3>
                <p className="text-xs text-slate-400">Practice with the official exam interface</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don&apos;t lose marks on exam day from unfamiliar operator precedence or memory keys. Test your numerical answers directly.
            </p>
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Virtual GATE Calc</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Mock Test Snippet */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Recent Mock Log</h2>
              <button
                onClick={() => setActiveTab('mocks')}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                All Mocks
              </button>
            </div>

            {mockTests.length > 0 ? (
              <div className="space-y-2">
                {mockTests.slice(0, 2).map(m => (
                  <div key={m.id} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate">{m.title}</span>
                      <span className="font-mono font-bold text-indigo-400 tabular-nums">{m.scoredMarks} / {m.totalMarks}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{m.provider}</span>
                      <span>·</span>
                      <span className="text-rose-400">-{m.negativeMarks} neg</span>
                      <span>·</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center">No mock tests logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
