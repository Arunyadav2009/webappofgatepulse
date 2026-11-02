import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { ErrorCategory, MistakeEntry } from '../types/gate';
import {
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
  X
} from 'lucide-react';

export const MistakeNotebook: React.FC = () => {
  const { mistakes, subjects, addMistake, toggleMistakeResolved, deleteMistake } = useGateContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [onlyUnresolved, setOnlyUnresolved] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Mistake Form
  const [title, setTitle] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || 'coa');
  const [topic, setTopic] = useState<string>('');
  const [testSource, setTestSource] = useState<string>('');
  const [category, setCategory] = useState<ErrorCategory>('conceptual');
  const [whatWentWrong, setWhatWentWrong] = useState<string>('');
  const [correctConcept, setCorrectConcept] = useState<string>('');
  const [formulaOrRule, setFormulaOrRule] = useState<string>('');

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whatWentWrong.trim()) return;

    addMistake({
      title,
      subjectId,
      topic: topic || 'General Topic',
      testOrPyqSource: testSource || 'Test Series',
      category,
      whatWentWrong,
      correctConcept,
      formulaOrRule,
      resolved: false
    });

    setIsAddModalOpen(false);
    setTitle('');
    setTopic('');
    setTestSource('');
    setWhatWentWrong('');
    setCorrectConcept('');
    setFormulaOrRule('');
  };

  const filteredMistakes = mistakes.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedSubject !== 'all' && m.subjectId !== selectedSubject) return false;
    if (onlyUnresolved && m.resolved) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.whatWentWrong.toLowerCase().includes(q) ||
        m.correctConcept.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryLabels: Record<ErrorCategory, { label: string; color: string }> = {
    conceptual: { label: 'Conceptual Error', color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' },
    calculation: { label: 'Calculation / Silly Mistake', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' },
    misread: { label: 'Misread Question / Trap', color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' },
    formula_forgotten: { label: 'Formula Forgotten', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' },
    time_pressure: { label: 'Time Pressure / Rushed', color: 'text-orange-400 bg-orange-950/60 border-orange-800/60' }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              GATE Topper&apos;s Error Notebook
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Document your negative marks and conceptual flaws. Top rankers convert weak areas into strengths here.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Mistake</span>
          </button>
        </div>

        {/* Filters and search */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Errors ({mistakes.length})
            </button>
            {(Object.keys(categoryLabels) as ErrorCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {categoryLabels[cat].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyUnresolved(prev => !prev)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                onlyUnresolved ? 'bg-rose-950 text-rose-300 border border-rose-800 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unresolved Only ({mistakes.filter(m => !m.resolved).length})
            </button>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search error..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mistake Entries Cards */}
      <div className="space-y-3">
        {filteredMistakes.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No mistake entries match the selected filter.
          </div>
        ) : (
          filteredMistakes.map(m => {
            const subject = subjects.find(s => s.id === m.subjectId);
            const catInfo = categoryLabels[m.category];

            return (
              <div
                key={m.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3 ${
                  m.resolved
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{m.title}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-indigo-400 font-medium">
                      {subject?.shortCode || m.subjectId}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{m.topic}</span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                    <button
                      onClick={() => deleteMistake(m.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete mistake entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Source & date */}
                <div className="text-[11px] text-slate-500 font-mono">
                  Source: {m.testOrPyqSource} · Logged: {m.dateAdded}
                </div>

                {/* 2-box Comparison: What Went Wrong vs Correct Concept */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      What Went Wrong / Trap Fallacy:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{m.whatWentWrong}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct Concept / Core Rule:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{m.correctConcept}</p>
                  </div>
                </div>

                {/* Formula / Golden rule */}
                {m.formulaOrRule && (
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-indigo-300">
                    <span className="text-slate-500 block text-[10px] font-sans">Formula / Verification Rule:</span>
                    {m.formulaOrRule}
                  </div>
                )}

                {/* Footer status toggle */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400">
                    Status: {m.resolved ? 'Mastered (No longer repeating)' : 'Needs regular revision'}
                  </span>

                  <button
                    onClick={() => toggleMistakeResolved(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      m.resolved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{m.resolved ? 'Mastered' : 'Mark as Mastered'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Mistake Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Log Error in Mistake Notebook</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMistake} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mistake Summary / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dijkstra Negative Weights, Subnetting host subtraction"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={e => setSubjectId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.shortCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Topic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Cache Mapping, Paging"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Error Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ErrorCategory)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="conceptual">Conceptual Error</option>
                    <option value="calculation">Calculation / Silly Mistake</option>
                    <option value="misread">Misread Question / Trap</option>
                    <option value="formula_forgotten">Formula Forgotten</option>
                    <option value="time_pressure">Time Pressure / Rushed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Source / Test Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Made Easy FLT 2 Q33, GATE 2022"
                    value={testSource}
                    onChange={e => setTestSource(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-rose-400 font-semibold mb-1">What went wrong? (Your false assumption) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain exactly how your brain slipped up..."
                  value={whatWentWrong}
                  onChange={e => setWhatWentWrong(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">What is the correct concept? *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="The actual theorem, textbook rule, or standard behavior..."
                  value={correctConcept}
                  onChange={e => setCorrectConcept(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Formula / Quick Verification Trick (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Usable Hosts = 2^(32-prefix) - 2"
                  value={formulaOrRule}
                  onChange={e => setFormulaOrRule(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
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
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg"
                >
                  Save to Mistake Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
