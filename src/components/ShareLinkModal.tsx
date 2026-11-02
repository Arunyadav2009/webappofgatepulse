import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import { FOCUS_STRATEGY_PRESETS } from '../data/focusPresets';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  Target,
  Send,
  MessageCircle,
  FileText,
  Smartphone
} from 'lucide-react';

export const ShareLinkModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    selectedSubjectIds,
    subjects,
    focusStats,
    targetScore,
    examDate,
    createPlanShareUrl
  } = useGateContext();

  const [activeTab, setActiveTab] = useState<'plan' | 'app' | 'presets'>('plan');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<boolean>(true);

  if (!isShareModalOpen) return null;

  const currentPlanUrl = createPlanShareUrl();
  const appBaseUrl = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://ais-pre-3anh5o4bwt2guz4a4g5gk4-145906123220.asia-southeast1.run.app';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const selectedSubjectsList = subjects.filter(s => selectedSubjectIds.includes(s.id));

  // Markdown summary for study groups / Discord
  const planSummaryMarkdown = `🎯 *My GATE CS Upcoming Exam Strategy Plan*
• Target Subjects (${selectedSubjectIds.length}/11): ${selectedSubjectsList.map(s => s.shortCode).join(', ')}
• Target Marks Potential: ~${focusStats.totalPossibleMarks}/100 Marks
• Target Score Benchmark: ${targetScore}+
• Current Readiness: ${focusStats.overallPercentage}%
🔗 Open my study scope in GATE CS Tracker: ${currentPlanUrl}`;

  const shareWhatsApp = (url: string, message: string) => {
    const text = encodeURIComponent(`${message}\n\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegram = (url: string, message: string) => {
    const text = encodeURIComponent(message);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Create & Share Link</h2>
              <p className="text-xs text-slate-400">
                Generate instant shareable links for your study plan or web app
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-2 text-xs gap-4">
          <button
            onClick={() => setActiveTab('plan')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'plan'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Exam Plan Link</span>
          </button>

          <button
            onClick={() => setActiveTab('app')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'app'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Web App Link</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Strategy Links</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: Selected Subjects Plan Link */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              {/* Plan Metadata Preview Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Your Selected Focus Scope:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    ~{focusStats.totalPossibleMarks} / 100 Marks Max
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedSubjectsList.map(s => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 font-medium"
                    >
                      {s.shortCode} (~{s.avgMarks}M)
                    </span>
                  ))}
                  {selectedSubjectsList.length === 0 && (
                    <span className="text-slate-500 text-xs italic">No subjects selected yet.</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {targetScore}+ Marks</span>
                  <span>Exam Date: {examDate}</span>
                </div>
              </div>

              {/* URL input and Copy button */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Shareable Focus Plan URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentPlanUrl}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(currentPlanUrl, 'plan-url')}
                    className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                      copiedType === 'plan-url'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedType === 'plan-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'plan-url' ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Anyone who opens this link will instantly load your selected subjects, target score, and exam countdown.
                </p>
              </div>

              {/* Social sharing buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 block font-medium">Share Plan Directly</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => shareWhatsApp(currentPlanUrl, `Check out my GATE CS upcoming exam target plan (${selectedSubjectIds.length} subjects, ~${focusStats.totalPossibleMarks}M target)`)}
                    className="flex items-center justify-center gap-2 p-2 bg-slate-950 border border-slate-800 hover:border-emerald-600/50 hover:bg-emerald-950/20 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => shareTelegram(currentPlanUrl, `My GATE CS upcoming exam strategy plan (${selectedSubjectIds.length} subjects, ~${focusStats.totalPossibleMarks} marks potential)`)}
                    className="flex items-center justify-center gap-2 p-2 bg-slate-950 border border-slate-800 hover:border-sky-600/50 hover:bg-sky-950/20 text-slate-300 hover:text-sky-400 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => handleCopy(planSummaryMarkdown, 'plan-md')}
                    className="flex items-center justify-center gap-2 p-2 bg-slate-950 border border-slate-800 hover:border-indigo-600/50 hover:bg-indigo-950/20 text-slate-300 hover:text-indigo-300 rounded-lg transition-colors col-span-2 sm:col-span-1"
                  >
                    {copiedType === 'plan-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{copiedType === 'plan-md' ? 'Text Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showQr ? 'Hide Mobile QR Code' : 'Show Mobile QR Code for Phone'}</span>
                </button>

                {showQr && (
                  <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={`https://api.quickchart.io/qr?text=${encodeURIComponent(currentPlanUrl)}&size=130&margin=1`}
                      alt="Plan QR Code"
                      className="w-28 h-28 rounded-lg bg-white p-1 shrink-0"
                    />
                    <div className="space-y-1.5 text-center sm:text-left">
                      <h4 className="font-semibold text-white">Scan on Mobile</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Point your mobile camera to open your customized GATE preparation plan on your phone immediately.
                      </p>
                      <button
                        onClick={() => handleCopy(currentPlanUrl, 'qr-url')}
                        className="text-[11px] text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        {copiedType === 'qr-url' ? '✓ Link copied' : 'Copy direct plan link'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Full App Link */}
          {activeTab === 'app' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-semibold text-white">GATE CS Tracker App Link</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share the full comprehensive exam workspace including the 3-round syllabus tracker, official GATE Virtual Calculator, PYQ database, error notebook, and Pomodoro study timer.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Web App Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appBaseUrl}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(appBaseUrl, 'app-url')}
                    className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                      copiedType === 'app-url'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedType === 'app-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'app-url' ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={`https://api.quickchart.io/qr?text=${encodeURIComponent(appBaseUrl)}&size=130&margin=1`}
                  alt="App QR Code"
                  className="w-28 h-28 rounded-lg bg-white p-1 shrink-0"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="font-semibold text-white">Scan to Open App on Mobile</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Install or run GATE CS Tracker directly on your mobile browser for portable revision anywhere.
                  </p>
                  <a
                    href={appBaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Strategy Presets Links */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-slate-400">
                Generate direct links for proven topper study packages. Anyone opening these links will have the preset loaded automatically:
              </p>

              <div className="space-y-2">
                {FOCUS_STRATEGY_PRESETS.map(preset => {
                  const presetUrl = createPlanShareUrl(preset.subjectIds);
                  const isCopied = copiedType === preset.id;

                  return (
                    <div
                      key={preset.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{preset.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
                      </div>

                      <button
                        onClick={() => handleCopy(presetUrl, preset.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>GATE CS Preparation Workspace</span>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
