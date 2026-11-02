import React, { useState, useEffect, useRef } from 'react';
import { useGateContext } from '../context/GateContext';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  Coffee,
  Brain,
  Sliders,
  Bell
} from 'lucide-react';

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

interface PresetOption {
  label: string;
  focusMinutes: number;
  breakMinutes: number;
}

const PRESETS: PresetOption[] = [
  { label: '25 / 5 Classic', focusMinutes: 25, breakMinutes: 5 },
  { label: '50 / 10 Deep Work', focusMinutes: 50, breakMinutes: 10 },
  { label: '90 / 15 Exam Sprint', focusMinutes: 90, breakMinutes: 15 }
];

export const PomodoroTimer: React.FC = () => {
  const { subjects, logStudySession } = useGateContext();

  // Settings
  const [focusDuration, setFocusDuration] = useState<number>(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15 * 60);

  // Active Timer state
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'coa');
  const [currentTask, setCurrentTask] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gate_pomo_completed_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<string | null>(null);
  const [showCustomConfig, setShowCustomConfig] = useState<boolean>(false);
  const [customFocusMins, setCustomFocusMins] = useState<number>(25);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play audio chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Dual-tone harmonic bell (587Hz -> 880Hz)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.4);

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {
      // Audio fallback silent
    }
  };

  // Sync completed count to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gate_pomo_completed_count', String(completedSessionsCount));
    } catch {
      // ignore
    }
  }, [completedSessionsCount]);

  // Document title timer sync
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel = mode === 'focus' ? 'Focus' : 'Break';

    if (isRunning) {
      document.title = `(${formatted}) ${modeLabel} - GATE CS Tracker`;
    } else {
      document.title = 'GATE CS Tracker - Preparation & Performance Workspace';
    }

    return () => {
      document.title = 'GATE CS Tracker - Preparation & Performance Workspace';
    };
  }, [timeLeft, isRunning, mode]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();

      if (mode === 'focus') {
        const hoursLogged = Number((focusDuration / 3600).toFixed(2));
        const subj = subjects.find(s => s.id === selectedSubjectId);
        const subjName = subj ? subj.shortCode : selectedSubjectId;
        const note = currentTask ? `${subjName}: ${currentTask}` : `${subjName} Deep Focus`;

        logStudySession(hoursLogged, [subjName], 0, note);

        const newCount = completedSessionsCount + 1;
        setCompletedSessionsCount(newCount);

        // Decide next break: after 4 sessions, offer long break
        if (newCount % 4 === 0) {
          setSessionCompletedNotice(
            `Outstanding! 4 deep work sessions finished. Enjoy a well-deserved 15 min long break.`
          );
          setMode('long_break');
          setTimeLeft(longBreakDuration);
        } else {
          setSessionCompletedNotice(
            `Great session! ${Math.round(focusDuration / 60)} minutes logged to your study history. Take a 5 min short break.`
          );
          setMode('short_break');
          setTimeLeft(shortBreakDuration);
        }
      } else {
        setSessionCompletedNotice('Break concluded! Ready to jump back into problem solving?');
        setMode('focus');
        setTimeLeft(focusDuration);
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    mode,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    selectedSubjectId,
    currentTask,
    completedSessionsCount,
    logStudySession,
    subjects
  ]);

  const toggleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(focusDuration);
    else if (mode === 'short_break') setTimeLeft(shortBreakDuration);
    else setTimeLeft(longBreakDuration);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('short_break');
      setTimeLeft(shortBreakDuration);
    } else {
      setMode('focus');
      setTimeLeft(focusDuration);
    }
  };

  const handleApplyPreset = (preset: PresetOption) => {
    setIsRunning(false);
    const fSec = preset.focusMinutes * 60;
    const bSec = preset.breakMinutes * 60;
    setFocusDuration(fSec);
    setShortBreakDuration(bSec);
    if (mode === 'focus') setTimeLeft(fSec);
    else setTimeLeft(bSec);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFocusMins < 1 || customFocusMins > 180) return;
    setIsRunning(false);
    const fSec = customFocusMins * 60;
    setFocusDuration(fSec);
    if (mode === 'focus') setTimeLeft(fSec);
    setShowCustomConfig(false);
  };

  // Math for Circular SVG ring
  const currentTotal =
    mode === 'focus'
      ? focusDuration
      : mode === 'short_break'
      ? shortBreakDuration
      : longBreakDuration;

  const progressFraction = Math.max(0, Math.min(1, timeLeft / currentTotal));
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressFraction);

  const formatDisplay = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Pomodoro Focus & Deep Work Timer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Timed deep problem-solving blocks. Automatically logs time and topic to your study logs.
          </p>
        </div>

        {/* Audio Mute & Preset buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowCustomConfig(prev => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              showCustomConfig
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Custom duration settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Toast Notification */}
      {sessionCompletedNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sessionCompletedNotice}</span>
          </div>
          <button
            onClick={() => setSessionCompletedNotice(null)}
            className="text-emerald-400 hover:text-white text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Custom Duration Popover */}
      {showCustomConfig && (
        <form
          onSubmit={handleApplyCustom}
          className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3 text-xs"
        >
          <span className="text-slate-400 whitespace-nowrap">Focus duration (minutes):</span>
          <input
            type="number"
            min="1"
            max="180"
            value={customFocusMins}
            onChange={e => setCustomFocusMins(parseInt(e.target.value) || 25)}
            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition-colors"
          >
            Set Custom
          </button>
        </form>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2">
        <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
          <button
            onClick={() => {
              setIsRunning(false);
              setMode('focus');
              setTimeLeft(focusDuration);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus ({Math.round(focusDuration / 60)}m)</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setMode('short_break');
              setTimeLeft(shortBreakDuration);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break ({Math.round(shortBreakDuration / 60)}m)</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setMode('long_break');
              setTimeLeft(longBreakDuration);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === 'long_break'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Long Break ({Math.round(longBreakDuration / 60)}m)</span>
          </button>
        </div>
      </div>

      {/* Circular Timer Visual Display */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active countdown progress ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              className={
                mode === 'focus'
                  ? 'text-indigo-500'
                  : mode === 'short_break'
                  ? 'text-emerald-500'
                  : 'text-teal-500'
              }
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>

          {/* Central text content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span
              className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white tabular-nums ${
                isRunning ? 'scale-105' : ''
              } transition-transform`}
            >
              {formatDisplay(timeLeft)}
            </span>

            <span className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
              {mode === 'focus' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Deep Focus</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Recharge</span>
                </>
              )}
            </span>

            {selectedSubject && (
              <span className="text-[11px] text-indigo-300/80 font-mono mt-0.5 truncate max-w-[130px]">
                {selectedSubject.shortCode}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Target Focus Subject & Goal Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Subject</label>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-sans"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.shortCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Session Goal / Target Problem</label>
          <input
            type="text"
            placeholder="e.g. Solve 10 Cache Mapping PYQs..."
            value={currentTask}
            onChange={e => setCurrentTask(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={toggleStartPause}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : mode === 'focus'
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'Pause Work' : mode === 'focus' ? 'Start Focus Session' : 'Start Break'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset timer to beginning"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleSkip}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Skip to next phase"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Presets and Streak cycle footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Presets Bar */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-[11px] text-slate-500">Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 4-Pomodoro Cycle Dots */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Deep Work Cycle:</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(dotIndex => {
              const currentCyclePosition = completedSessionsCount % 4;
              const isFilled = dotIndex < currentCyclePosition;
              return (
                <div
                  key={dotIndex}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    isFilled
                      ? 'bg-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                  title={`Session ${dotIndex + 1} of 4`}
                />
              );
            })}
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-300 ml-1">
            {completedSessionsCount} total done
          </span>
        </div>
      </div>
    </div>
  );
};
