import React, { useRef } from 'react';
import { useGateContext, ActiveTab } from '../context/GateContext';
import { Calculator, Download, Upload, Calendar, Target, Cloud, User, Link2, Share2, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCalculatorOpen,
    setIsShareModalOpen,
    exportBackup,
    importBackup,
    stats,
    targetScore,
    currentUser,
    selectedSubjectIds,
    isFocusScopeActive,
    focusStats
  } = useGateContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems: { id: ActiveTab; label: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview' },
    {
      id: 'focus',
      label: 'Selected Subjects',
      badge: isFocusScopeActive ? `${selectedSubjectIds.length} sub` : undefined
    },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'pyqs', label: 'PYQ Bank' },
    { id: 'mocks', label: 'Mock Tests' },
    { id: 'mistakes', label: 'Mistake Book' },
    { id: 'formulas', label: 'Formulas' },
    { id: 'planner', label: 'Planner' },
    { id: 'profile', label: 'Cloud Profile' }
  ];


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackup(content);
        if (success) {
          alert('Backup restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-left shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm shadow-indigo-500/20">
            GT
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            GATE CS Tracker
          </span>
        </button>

        {/* Zone 2: Nav links, 1-2 word labels, single-line with subtle hover underline */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick exam countdown metadata (clean unboxed text) */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono pr-2 border-r border-slate-800">
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{stats.daysLeft}d left</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target: {targetScore}+</span>
            </span>
          </div>

          {/* Create & Share Plan Link Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 transition-colors whitespace-nowrap hover:border-slate-600"
            title="Create and share link for your study plan or web app"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Create Link</span>
          </button>

          {/* Virtual GATE Calculator launcher */}
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 rounded-lg transition-colors whitespace-nowrap"
            title="Launch official GATE Scientific Calculator replica"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">GATE Calc</span>
          </button>

          {/* Profile / Cloud Sync Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              currentUser
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
            }`}
            title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in to sync your data to the cloud'}
          >
            {currentUser ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[90px] truncate hidden sm:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Log In</span>
              </>
            )}
          </button>

          {/* Backup dropdown / actions */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={exportBackup}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Export JSON Backup"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Import JSON Backup"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Mobile nav drawer / scrollbar */}
      <div className="md:hidden flex items-center gap-1 px-4 py-1.5 border-t border-slate-800/80 overflow-x-auto bg-slate-900/90 text-xs">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

