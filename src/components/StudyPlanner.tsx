import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { PomodoroTimer } from './PomodoroTimer';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Flame,
  BarChart2,
  Check
} from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const {
    dailyTargets,
    addDailyTarget,
    toggleDailyTarget,
    deleteDailyTarget,
    studyLogs,
    logStudySession,
    examDate,
    setExamDate,
    targetScore,
    setTargetScore,
    subjects,
    stats
  } = useGateContext();

  // New Target Form
  const [newTargetTitle, setNewTargetTitle] = useState<string>('');
  const [newTargetSubject, setNewTargetSubject] = useState<string>(subjects[0]?.id || 'coa');
  const [newTargetPriority, setNewTargetPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Manual Log Study Hours
  const [manualHours, setManualHours] = useState<number>(2);
  const [manualPyqs, setManualPyqs] = useState<number>(10);
  const [manualTopic, setManualTopic] = useState<string>('');
  const [showLogSaved, setShowLogSaved] = useState<boolean>(false);

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetTitle.trim()) return;
    addDailyTarget(newTargetTitle, newTargetSubject, newTargetPriority);
    setNewTargetTitle('');
  };

  const handleManualStudyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualHours <= 0) return;
    logStudySession(
      manualHours,
      manualTopic ? [manualTopic] : ['General GATE Revision'],
      manualPyqs
    );
    setShowLogSaved(true);
    setTimeout(() => setShowLogSaved(false), 2000);
    setManualTopic('');
  };

  // 7-day study activity representation
  const recentLogs = [...studyLogs].slice(-7);

  return (
    <div className="space-y-6">
      {/* Header and Exam Customizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Study Planner, Focus Timer & Target Milestones
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Structure daily study hours, track revision consistency, and set exam deadlines.
            </p>
          </div>

          {/* Exam & Score settings in-place */}
          <div className="flex items-center gap-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs">
            <div>
              <label className="block text-slate-500 text-[10px] mb-0.5">GATE Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="bg-transparent border border-slate-700 rounded px-2 py-0.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-[10px] mb-0.5">Target Score</label>
              <input
                type="number"
                value={targetScore}
                onChange={e => setTargetScore(parseInt(e.target.value) || 75)}
                className="w-16 bg-transparent border border-slate-700 rounded px-2 py-0.5 text-xs text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3 Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Hours Dedicated</span>
              <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
                {stats.totalHoursLogged} hrs
              </div>
            </div>
            <Clock className="w-6 h-6 text-indigo-400" />
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Active Daily Streak</span>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                {stats.studyStreakDays} Days
              </div>
            </div>
            <Flame className="w-6 h-6 text-amber-400" />
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Days Remaining</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                {stats.daysLeft} Days
              </div>
            </div>
            <Calendar className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left: Pomodoro Focus Timer & Study Logger | Right: Daily Targets Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pomodoro Timer & Manual Study Log */}
        <div className="space-y-6">
          {/* Dedicated Pomodoro Focus Timer Suite */}
          <PomodoroTimer />

          {/* Quick Study Logger Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-white">Log Manual Study Hours</h2>
            <form onSubmit={handleManualStudyLog} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hours Studied</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="18"
                    value={manualHours}
                    onChange={e => setManualHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">PYQs Solved</label>
                  <input
                    type="number"
                    min="0"
                    value={manualPyqs}
                    onChange={e => setManualPyqs(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Topics Covered (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Hierarchy, Master Theorem, DFA Equivalence"
                  value={manualTopic}
                  onChange={e => setManualTopic(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {showLogSaved ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Session saved to study log!
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">Updates streak and total study hours</span>
                )}

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Log Hours
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Daily Targets Checklist & 7-Day Consistency History */}
        <div className="space-y-6">
          {/* Daily Targets List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Today&apos;s Target Checklist</h2>
                <p className="text-xs text-slate-400">Micro-goals that compound toward AIR 1-100</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">
                {dailyTargets.filter(t => t.completed).length} / {dailyTargets.length} done
              </span>
            </div>

            {/* Target input form */}
            <form onSubmit={handleAddTarget} className="flex gap-2 text-xs">
              <input
                type="text"
                required
                placeholder="Add goal: e.g. Solve 20 OS Paging PYQs..."
                value={newTargetTitle}
                onChange={e => setNewTargetTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTargetSubject}
                onChange={e => setNewTargetSubject(e.target.value)}
                className="px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.shortCode}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shrink-0"
              >
                Add
              </button>
            </form>

            {/* Target items */}
            <div className="space-y-2 pt-2">
              {dailyTargets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No targets scheduled for today yet.
                </div>
              ) : (
                dailyTargets.map(target => (
                  <div
                    key={target.id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => toggleDailyTarget(target.id)}
                      className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                    >
                      <input
                        type="checkbox"
                        checked={target.completed}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p
                          className={`text-xs ${
                            target.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'
                          }`}
                        >
                          {target.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="uppercase font-mono text-indigo-400">{target.subjectId}</span>
                          <span>·</span>
                          <span className={target.priority === 'high' ? 'text-rose-400' : target.priority === 'medium' ? 'text-amber-400' : 'text-slate-400'}>
                            {target.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteDailyTarget(target.id)}
                      className="p-1 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 7-Day Consistency Log Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Study Activity (Hours Logged)</h2>
                <p className="text-xs text-slate-400">Daily dedication trend across recent study sessions</p>
              </div>
              <BarChart2 className="w-4 h-4 text-slate-500" />
            </div>

            <div className="pt-3 flex items-end justify-between gap-2 h-32 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {recentLogs.map((log, idx) => {
                const heightPct = Math.min(100, Math.round((log.hours / 8) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {log.hours}h
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-800 rounded-t overflow-hidden flex flex-col justify-end h-20">
                      <div
                        className="bg-indigo-500 rounded-t w-full transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-[36px]">
                      {log.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

