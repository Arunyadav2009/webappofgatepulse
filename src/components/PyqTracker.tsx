import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { QuestionType, DifficultyLevel } from '../types/gate';
import {
  Search,
  Plus,
  Star,
  CheckCircle2,
  Trash2,
  Filter,
  Bookmark,
  Check,
  X
} from 'lucide-react';

export const PyqTracker: React.FC = () => {
  const { pyqs, subjects, addPyq, deletePyq, togglePyqBookmark, togglePyqSolved } = useGateContext();

  const [search, setSearch] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [onlyUnsolved, setOnlyUnsolved] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New PYQ Form State
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || 'coa');
  const [newTopicName, setNewTopicName] = useState<string>('');
  const [newYear, setNewYear] = useState<number>(2024);
  const [newMarks, setNewMarks] = useState<1 | 2>(2);
  const [newType, setNewType] = useState<QuestionType>('NAT');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Hard');
  const [newSnippet, setNewSnippet] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newTakeaway, setNewTakeaway] = useState<string>('');

  const handleAddPyq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippet.trim()) return;

    addPyq({
      subjectId: newSubjectId,
      topicName: newTopicName || 'General Topic',
      year: newYear,
      marks: newMarks,
      type: newType,
      difficulty: newDifficulty,
      questionSnippet: newSnippet,
      correctAnswer: newAnswer,
      keyTakeaway: newTakeaway,
      isBookmarked: true,
      solved: false
    });

    setIsAddModalOpen(false);
    setNewSnippet('');
    setNewAnswer('');
    setNewTakeaway('');
    setNewTopicName('');
  };

  const filteredPyqs = pyqs.filter(p => {
    if (selectedSubject !== 'all' && p.subjectId !== selectedSubject) return false;
    if (selectedType !== 'all' && p.type !== selectedType) return false;
    if (onlyBookmarked && !p.isBookmarked) return false;
    if (onlyUnsolved && p.solved) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.questionSnippet.toLowerCase().includes(q) ||
        p.keyTakeaway.toLowerCase().includes(q) ||
        p.topicName.toLowerCase().includes(q) ||
        String(p.year).includes(q)
      );
    }
    return true;
  });

  const totalSolved = pyqs.filter(p => p.solved).length;
  const totalBookmarked = pyqs.filter(p => p.isBookmarked).length;

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Previous Year Questions (PYQ) Bank & Starred Problems
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curate and log high-yield GATE questions with trick notes, trap patterns, and solutions.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
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

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search snippet, concept..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Sub-Filters: Type, Bookmarked, Unsolved */}
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Type:</span>
            {['all', 'NAT', 'MCQ', 'MSQ'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  selectedType === t ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyBookmarked(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                onlyBookmarked ? 'bg-amber-950 text-amber-300 border border-amber-800/80 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Starred only ({totalBookmarked})</span>
            </button>

            <button
              onClick={() => setOnlyUnsolved(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                onlyUnsolved ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Unsolved only ({pyqs.length - totalSolved})</span>
            </button>
          </div>
        </div>
      </div>

      {/* PYQ Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPyqs.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No questions match your current filters.
          </div>
        ) : (
          filteredPyqs.map(p => {
            const subject = subjects.find(s => s.id === p.subjectId);

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  p.solved
                    ? 'bg-slate-900/60 border-slate-800/80'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Meta Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300 font-mono">
                        GATE {p.year}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-indigo-400 font-medium">
                        {subject?.shortCode || p.subjectId}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-slate-400">{p.marks} Mark{p.marks > 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {p.type}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                          p.difficulty === 'Hard' || p.difficulty === 'Tricky'
                            ? 'text-rose-400 bg-rose-950/40'
                            : p.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-950/40'
                            : 'text-emerald-400 bg-emerald-950/40'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                      <button
                        onClick={() => togglePyqBookmark(p.id)}
                        className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                          p.isBookmarked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title="Star / Bookmark for high-yield revision"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Topic name */}
                  <div className="text-xs font-semibold text-slate-200">
                    {p.topicName}
                  </div>

                  {/* Question Snippet */}
                  <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    {p.questionSnippet}
                  </div>

                  {/* Answer & Key Takeaway */}
                  {p.correctAnswer && (
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-400">Answer:</span>
                      <span className="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">{p.correctAnswer}</span>
                    </div>
                  )}

                  {p.keyTakeaway && (
                    <div className="text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40">
                      <span className="text-indigo-400 font-semibold block mb-0.5">Takeaway / Trap:</span>
                      <p className="leading-relaxed">{p.keyTakeaway}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => togglePyqSolved(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      p.solved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{p.solved ? 'Solved' : 'Mark as Solved'}</span>
                  </button>

                  <button
                    onClick={() => deletePyq(p.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Delete question entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add PYQ Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Log High-Yield GATE Question</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPyq} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value)}
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
                    placeholder="e.g. Cache Mapping, EMAT"
                    value={newTopicName}
                    onChange={e => setNewTopicName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={e => setNewYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Marks</label>
                  <select
                    value={newMarks}
                    onChange={e => setNewMarks(parseInt(e.target.value) as 1 | 2)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  >
                    <option value={1}>1 Mark</option>
                    <option value={2}>2 Marks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as QuestionType)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="NAT">NAT</option>
                    <option value="MCQ">MCQ</option>
                    <option value="MSQ">MSQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={e => setNewDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Tricky">Tricky</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Question Statement / Snippet *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Paste or summarize the question text..."
                  value={newSnippet}
                  onChange={e => setNewSnippet(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Correct Answer / Value</label>
                <input
                  type="text"
                  placeholder="e.g. 10 bits, 510, Option B"
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Key Takeaway / Solution Trap to Avoid</label>
                <textarea
                  rows={2}
                  placeholder="What is the concept trick? Why do students get negative marks here?"
                  value={newTakeaway}
                  onChange={e => setNewTakeaway(e.target.value)}
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
