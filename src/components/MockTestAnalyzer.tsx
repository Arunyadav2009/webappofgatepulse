import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { MockTest } from '../types/gate';
import {
  TrendingUp,
  Plus,
  Trash2,
  AlertTriangle,
  Award,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

export const MockTestAnalyzer: React.FC = () => {
  const { mockTests, addMockTest, deleteMockTest, targetScore } = useGateContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Mock Form State
  const [title, setTitle] = useState<string>('');
  const [provider, setProvider] = useState<MockTest['provider']>('Made Easy');
  const [testType, setTestType] = useState<MockTest['testType']>('Full Length');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [scoredMarks, setScoredMarks] = useState<number>(65);
  const [totalQuestions, setTotalQuestions] = useState<number>(65);
  const [attempted, setAttempted] = useState<number>(55);
  const [correct, setCorrect] = useState<number>(47);
  const [incorrect, setIncorrect] = useState<number>(8);
  const [negativeMarks, setNegativeMarks] = useState<number>(4.0);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number>(165);
  const [remarks, setRemarks] = useState<string>('');

  const handleAddMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMockTest({
      title,
      provider,
      testType,
      date,
      totalMarks,
      scoredMarks,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      negativeMarks,
      timeSpentMinutes,
      remarks
    });

    setIsAddModalOpen(false);
    setTitle('');
    setRemarks('');
  };

  // Rank estimation formula based on GATE CS historical normalization trends
  const getRankEstimate = (score: number, total: number) => {
    const scaledScore = (score / total) * 100;
    if (scaledScore >= 78) return { air: 'AIR 1 – 50', category: 'Exceptional (IIT Bombay CSE / IISc CSA direct admit)', color: 'text-emerald-400' };
    if (scaledScore >= 70) return { air: 'AIR 51 – 200', category: 'Top Tier (Top 7 IITs M.Tech CS Guaranteed)', color: 'text-emerald-400' };
    if (scaledScore >= 62) return { air: 'AIR 201 – 600', category: 'High Rank (IIT Delhi, IIT Madras, IIT Kanpur, IIT KGP)', color: 'text-indigo-400' };
    if (scaledScore >= 54) return { air: 'AIR 601 – 1500', category: 'Competitive (IIT Roorkee, IIT Guwahati, Top NITs / IIIT Hyderabad)', color: 'text-cyan-400' };
    if (scaledScore >= 45) return { air: 'AIR 1501 – 3500', category: 'Qualifying Plus (NIT Trichy, Surathkal, Warangal)', color: 'text-amber-400' };
    return { air: 'AIR > 4000', category: 'Needs Focus (Push revisions & accuracy)', color: 'text-rose-400' };
  };

  // Sorted mock tests chronologically for chart
  const sortedMocks = [...mockTests].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const avgAccuracy =
    mockTests.length > 0
      ? Math.round(
          (mockTests.reduce((acc, m) => acc + (m.attempted > 0 ? (m.correct / m.attempted) * 100 : 0), 0) /
            mockTests.length)
        )
      : 0;

  const totalNegLost = mockTests.reduce((acc, m) => acc + m.negativeMarks, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Performance Highlights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Mock Test Performance & Accuracy Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Log Full-Length Tests (FLTs) and Subject tests, track negative marks penalty, and analyze rank trajectories.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Mock Test</span>
          </button>
        </div>

        {/* 3 Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-medium">Average Accuracy</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
              {avgAccuracy}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Top rankers aim for 85%+ accuracy</p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-medium">Total Negative Marks Lost</span>
            <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
              -{totalNegLost.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">marks</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Across {mockTests.length} tests logged</p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-medium">Current Target Score Gap</span>
            <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-1">
              {mockTests.length > 0 ? (targetScore - Math.max(...mockTests.map(m => m.scoredMarks))).toFixed(1) : targetScore}
              <span className="text-xs text-slate-400 font-sans font-normal"> to reach {targetScore}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Target: Top 100 AIR rank</p>
          </div>
        </div>
      </div>

      {/* Visual SVG Score Trajectory Graph */}
      {sortedMocks.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Score Trajectory Progression</h2>
              <p className="text-xs text-slate-400">Sequential score history relative to your target score ({targetScore})</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-indigo-500"></span>
                <span>Score</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-500 border-t border-dashed"></span>
                <span>Target ({targetScore})</span>
              </span>
            </div>
          </div>

          <div className="h-44 w-full bg-slate-950/80 rounded-lg p-3 relative flex flex-col justify-between border border-slate-800/80">
            {/* SVG Line Graph */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Target Line */}
              <line
                x1="20"
                y1={120 - (targetScore / 100) * 110}
                x2="480"
                y2={120 - (targetScore / 100) * 110}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Data points and line */}
              {(() => {
                const points = sortedMocks.map((m, idx) => {
                  const x = 30 + (idx / Math.max(1, sortedMocks.length - 1)) * 440;
                  const y = 120 - Math.min(100, Math.max(0, (m.scoredMarks / m.totalMarks) * 100)) * 1.05;
                  return { x, y, score: m.scoredMarks, title: m.title };
                });

                const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#6366f1" stroke="#1e1b4b" strokeWidth="2" />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          fontSize="9"
                          fill="#c7d2fe"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {p.score}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
              {sortedMocks.map(m => (
                <span key={m.id} className="truncate max-w-[80px]">
                  {m.date.slice(5)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mock Tests List */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white">Logged Test Submissions</h2>

        {mockTests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No mock tests recorded yet. Click &quot;Log Mock Test&quot; to track your first test series result.
          </div>
        ) : (
          <div className="space-y-3">
            {mockTests.map(m => {
              const accuracy = m.attempted > 0 ? Math.round((m.correct / m.attempted) * 100) : 0;
              const rankInfo = getRankEstimate(m.scoredMarks, m.totalMarks);

              return (
                <div
                  key={m.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 transition-colors hover:border-slate-700 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{m.title}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-indigo-400 font-semibold">{m.provider}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{m.testType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Date: {m.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>Time: {m.timeSpentMinutes} mins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
                          {m.scoredMarks} <span className="text-xs font-normal text-slate-400">/ {m.totalMarks}</span>
                        </div>
                        <div className={`text-xs font-semibold ${rankInfo.color}`}>
                          Est. {rankInfo.air}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMockTest(m.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete mock test entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Detailed metrics breakdown pill strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono text-slate-300">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Attempted</span>
                      <span className="font-semibold text-white">{m.attempted} / {m.totalQuestions}</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Correct</span>
                      <span className="font-semibold text-emerald-400">{m.correct}</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Incorrect</span>
                      <span className="font-semibold text-rose-400">{m.incorrect}</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Accuracy</span>
                      <span className="font-semibold text-white">{accuracy}%</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block text-[10px]">Negative Marks</span>
                      <span className="font-semibold text-rose-400">-{m.negativeMarks}</span>
                    </div>
                  </div>

                  {/* Remarks and Analysis */}
                  {m.remarks && (
                    <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-slate-300 font-semibold block mb-0.5">Post-Test Analysis:</span>
                      <p>{m.remarks}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Mock Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Log Mock / Subject Test Result</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Made Easy All India Mock 3, GO Classes Subject Test 2"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Test Provider</label>
                  <select
                    value={provider}
                    onChange={e => setProvider(e.target.value as MockTest['provider'])}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Made Easy">Made Easy</option>
                    <option value="GO Classes">GO Classes</option>
                    <option value="Ace Academy">Ace Academy</option>
                    <option value="Gate Applied">Gate Applied</option>
                    <option value="Testbook">Testbook</option>
                    <option value="Self / PYQ Paper">Self / PYQ Paper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={e => setTestType(e.target.value as MockTest['testType'])}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Full Length">Full Length Mock (100M)</option>
                    <option value="Subject Test">Subject Test (50M/25M)</option>
                    <option value="Topic Test">Topic Test (25M)</option>
                    <option value="Multi-Subject">Multi-Subject Test</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={e => setTotalMarks(parseFloat(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Scored Marks *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={scoredMarks}
                    onChange={e => setScoredMarks(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-indigo-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Attempted</label>
                  <input
                    type="number"
                    value={attempted}
                    onChange={e => setAttempted(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Correct</label>
                  <input
                    type="number"
                    value={correct}
                    onChange={e => setCorrect(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Incorrect</label>
                  <input
                    type="number"
                    value={incorrect}
                    onChange={e => setIncorrect(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Negative Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    value={negativeMarks}
                    onChange={e => setNegativeMarks(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Time Spent (Minutes)</label>
                <input
                  type="number"
                  value={timeSpentMinutes}
                  onChange={e => setTimeSpentMinutes(parseInt(e.target.value) || 180)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Post-Test Error Analysis & Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Which topics had maximum negative marks? Time management flaws?"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
