import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import {
  Search,
  Filter,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  RotateCcw,
  Target,
  Sliders
} from 'lucide-react';

export const SyllabusTracker: React.FC = () => {
  const {
    subjects,
    toggleSubtopicField,
    batchUpdateSubjectRound,
    selectedSubjectIds,
    isFocusScopeActive,
    setIsFocusScopeActive,
    focusStats,
    setActiveTab
  } = useGateContext();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(isFocusScopeActive ? 'focus' : 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'completed' | 'missing_notes'>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Filter subjects and topics
  const filteredSubjects = subjects
    .filter(subj => {
      if (selectedSubjectId === 'focus') {
        return selectedSubjectIds.includes(subj.id);
      }
      return selectedSubjectId === 'all' || subj.id === selectedSubjectId;
    })
    .map(subj => {

      const matchingTopics = subj.topics.map(topic => {
        const matchingSubtopics = topic.subtopics.filter(sub => {
          const matchesSearch =
            searchQuery.trim() === '' ||
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subj.name.toLowerCase().includes(searchQuery.toLowerCase());

          if (!matchesSearch) return false;

          if (statusFilter === 'incomplete') return !sub.completed;
          if (statusFilter === 'completed') return sub.completed;
          if (statusFilter === 'missing_notes') return !sub.shortNotesReady;
          return true;
        });

        return {
          ...topic,
          subtopics: matchingSubtopics
        };
      }).filter(topic => topic.subtopics.length > 0);

      return {
        ...subj,
        topics: matchingTopics
      };
    }).filter(subj => subj.topics.length > 0);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Official GATE CS Syllabus & 3-Round Revision Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Mark subtopics through three progressive revision stages and track short notes preparation.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics, keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filters & Segmented Subject Bar */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubjectId === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Subjects (11)
            </button>
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubjectId === s.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s.shortCode} <span className="text-[10px] text-slate-400">({s.avgMarks}M)</span>
              </button>
            ))}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs hidden sm:inline">Status:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('incomplete')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === 'incomplete' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Incomplete
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === 'completed' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('missing_notes')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === 'missing_notes' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Missing Notes
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                R1: Theory
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                R2: PYQs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                R3: Mocks/Edge
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cards & Topic Lists */}
      <div className="space-y-6">
        {filteredSubjects.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No topics match the selected search and filter criteria.
          </div>
        ) : (
          filteredSubjects.map(subject => {
            let totalSub = 0;
            let compSub = 0;
            subject.topics.forEach(t => {
              t.subtopics.forEach(s => {
                totalSub++;
                if (s.completed) compSub++;
              });
            });
            const subjectPct = totalSub > 0 ? Math.round((compSub / totalSub) * 100) : 0;

            return (
              <div
                key={subject.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Subject Header */}
                <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        {subject.shortCode}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {subject.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Weightage: ~{subject.avgMarks} Marks</span>
                      <span aria-hidden="true">·</span>
                      <span>{compSub} of {totalSub} subtopics completed ({subjectPct}%)</span>
                    </div>
                  </div>

                  {/* Batch Update Actions */}
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => batchUpdateSubjectRound(subject.id, 'round1', true)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium transition-colors"
                      title="Mark all subtopics in this subject as Round 1 done"
                    >
                      + All R1
                    </button>
                    <button
                      onClick={() => batchUpdateSubjectRound(subject.id, 'round2', true)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium transition-colors"
                      title="Mark all subtopics in this subject as Round 2 done"
                    >
                      + All R2
                    </button>
                    <button
                      onClick={() => batchUpdateSubjectRound(subject.id, 'round3', true)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium transition-colors"
                      title="Mark all subtopics in this subject as Round 3 done"
                    >
                      + All R3
                    </button>
                  </div>
                </div>

                {/* Topics Container */}
                <div className="divide-y divide-slate-800/60">
                  {subject.topics.map(topic => {
                    const isExpanded = expandedTopics[topic.id] !== false; // expanded by default
                    const topicTotal = topic.subtopics.length;
                    const topicComp = topic.subtopics.filter(s => s.completed).length;

                    return (
                      <div key={topic.id} className="p-4">
                        {/* Topic Header Accordion toggle */}
                        <div
                          onClick={() => toggleTopicExpand(topic.id)}
                          className="flex items-center justify-between py-1 cursor-pointer select-none group"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                              {topic.name}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400">
                              ({topicComp}/{topicTotal})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Subtopics Table */}
                        {isExpanded && (
                          <div className="mt-3 space-y-2">
                            {topic.subtopics.map(sub => (
                              <div
                                key={sub.id}
                                className={`p-3 rounded-lg border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                  sub.completed
                                    ? 'bg-slate-950/40 border-slate-800/50'
                                    : 'bg-slate-950/80 border-slate-800'
                                }`}
                              >
                                {/* Left: Completed checkbox & Name */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={sub.completed}
                                    onChange={() =>
                                      toggleSubtopicField(subject.id, topic.id, sub.id, 'completed')
                                    }
                                    className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                                  />
                                  <div>
                                    <p
                                      className={`text-xs sm:text-sm font-medium ${
                                        sub.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                                      }`}
                                    >
                                      {sub.name}
                                    </p>
                                  </div>
                                </div>

                                {/* Right: Revision Round Badges (Interactive Buttons) & Short Notes */}
                                <div className="flex items-center gap-2 flex-wrap text-xs">
                                  {/* Round 1: Theory */}
                                  <button
                                    onClick={() =>
                                      toggleSubtopicField(subject.id, topic.id, sub.id, 'round1')
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors flex items-center gap-1 ${
                                      sub.round1
                                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                    title="Round 1: Full Theory & Standard Textbook Examples"
                                  >
                                    {sub.round1 && <Check className="w-3 h-3 text-indigo-400" />}
                                    <span>R1 (Theory)</span>
                                  </button>

                                  {/* Round 2: PYQ */}
                                  <button
                                    onClick={() =>
                                      toggleSubtopicField(subject.id, topic.id, sub.id, 'round2')
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors flex items-center gap-1 ${
                                      sub.round2
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                    title="Round 2: Previous Year Questions & High Accuracy"
                                  >
                                    {sub.round2 && <Check className="w-3 h-3 text-emerald-400" />}
                                    <span>R2 (PYQ)</span>
                                  </button>

                                  {/* Round 3: Edge Cases */}
                                  <button
                                    onClick={() =>
                                      toggleSubtopicField(subject.id, topic.id, sub.id, 'round3')
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors flex items-center gap-1 ${
                                      sub.round3
                                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                    title="Round 3: Advanced Mocks & Edge Cases"
                                  >
                                    {sub.round3 && <Check className="w-3 h-3 text-amber-400" />}
                                    <span>R3 (Mock)</span>
                                  </button>

                                  {/* Short Notes Check */}
                                  <button
                                    onClick={() =>
                                      toggleSubtopicField(subject.id, topic.id, sub.id, 'shortNotesReady')
                                    }
                                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                                      sub.shortNotesReady
                                        ? 'bg-purple-950 text-purple-300 border border-purple-700/60'
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                    title="Short notes and formula summary drafted"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>Notes</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
