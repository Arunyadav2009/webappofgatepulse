import React from 'react';
import { GateProvider, useGateContext } from './context/GateContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SyllabusTracker } from './components/SyllabusTracker';
import { PyqTracker } from './components/PyqTracker';
import { MockTestAnalyzer } from './components/MockTestAnalyzer';
import { MistakeNotebook } from './components/MistakeNotebook';
import { FormulaHandbook } from './components/FormulaHandbook';
import { StudyPlanner } from './components/StudyPlanner';
import { ProfileSection } from './components/ProfileSection';
import { FocusSubjectSelector } from './components/FocusSubjectSelector';
import { VirtualGateCalculator } from './components/VirtualGateCalculator';
import { ShareLinkModal } from './components/ShareLinkModal';
import { RotateCcw, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, isCalculatorOpen, setIsCalculatorOpen, resetToDefaults } = useGateContext();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'focus' && <FocusSubjectSelector />}
        {activeTab === 'syllabus' && <SyllabusTracker />}
        {activeTab === 'pyqs' && <PyqTracker />}
        {activeTab === 'mocks' && <MockTestAnalyzer />}
        {activeTab === 'mistakes' && <MistakeNotebook />}
        {activeTab === 'formulas' && <FormulaHandbook />}
        {activeTab === 'planner' && <StudyPlanner />}
        {activeTab === 'profile' && <ProfileSection />}
      </main>

      {/* Official GATE Virtual Calculator Modal */}
      {isCalculatorOpen && (
        <VirtualGateCalculator onClose={() => setIsCalculatorOpen(false)} />
      )}

      {/* Share / Create Link Modal */}
      <ShareLinkModal />

      {/* Quiet Footer adhering to anti-slop rules */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GATE CS Tracker</span>
            <span>·</span>
            <span>Comprehensive Exam Preparation Workspace</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline-ready & LocalStorage synced</span>
            </span>
            <span>·</span>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
              title="Reset data to default sample state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GateProvider>
      <AppContent />
    </GateProvider>
  );
}
