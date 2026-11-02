import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import {
  Search,
  Bookmark,
  Copy,
  Check,
  Star,
  Sparkles,
  Info,
  Lightbulb
} from 'lucide-react';

export const FormulaHandbook: React.FC = () => {
  const { formulaCards, subjects, toggleFormulaBookmark } = useGateContext();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyFormula = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredFormulas = formulaCards.filter(f => {
    if (selectedSubject !== 'all' && f.subjectId !== selectedSubject) return false;
    if (onlyBookmarked && !f.isBookmarked) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.formula.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              High-Yield Formulas & Cheat Sheets
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated equations, theorems, and boundary conditions that appear frequently in numerical answer type (NAT) questions.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search formula, theorem..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubject === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === s.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s.shortCode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyBookmarked(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              onlyBookmarked
                ? 'bg-amber-950 text-amber-300 border border-amber-800/80 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Bookmarked only</span>
          </button>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No formulas match the current filters.
          </div>
        ) : (
          filteredFormulas.map(f => {
            const subject = subjects.find(s => s.id === f.subjectId);
            const isCopied = copiedId === f.id;

            return (
              <div
                key={f.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        {subject?.shortCode || f.subjectId}
                      </span>
                      <span className="text-slate-400 text-xs">{f.topic}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyFormula(f.id, f.formula)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Copy formula text"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => toggleFormulaBookmark(f.id)}
                        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                          f.isBookmarked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title="Bookmark formula"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-white">
                    {f.title}
                  </h2>

                  {/* Formula Code Box */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 select-all overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {f.formula}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {f.description}
                  </p>

                  {/* Variable breakdown */}
                  {f.variablesExplanation && f.variablesExplanation.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Variable Definitions & Cases:
                      </span>
                      <ul className="text-xs text-slate-400 font-mono space-y-1 pl-2">
                        {f.variablesExplanation.map((v, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-slate-600">›</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exam Tip */}
                  {f.tip && (
                    <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300/90 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-sans">{f.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
