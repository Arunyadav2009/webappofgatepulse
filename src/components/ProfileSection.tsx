import React, { useState } from 'react';
import { useGateContext } from '../context/GateContext';
import {
  Cloud,
  RefreshCw,
  LogOut,
  Mail,
  Lock,
  User,
  Shield,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Link2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const {
    currentUser,
    syncStatus,
    lastSyncedAt,
    authError,
    setAuthError,
    isAuthLoading,
    signInWithEmail,
    signUpWithEmail,
    logout,
    resetUserPassword,
    syncToCloudNow,
    reloadFromCloud,
    exportBackup,
    stats
  } = useGateContext();

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sharedAppUrl = 'https://ais-pre-3anh5o4bwt2guz4a4g5gk4-145906123220.asia-southeast1.run.app';
  const devAppUrl = 'https://ais-dev-3anh5o4bwt2guz4a4g5gk4-145906123220.asia-southeast1.run.app';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setAuthError(null);

    if (authMode === 'forgot') {
      if (!email.trim()) return;
      const ok = await resetUserPassword(email.trim());
      if (ok) {
        setStatusMessage('Password reset link sent to your email. Check your inbox.');
      }
      return;
    }

    if (!email.trim() || !password.trim()) return;

    if (authMode === 'signup') {
      const ok = await signUpWithEmail(email.trim(), password.trim(), displayName.trim() || undefined);
      if (ok) {
        setStatusMessage('Account created and cloud database initialized successfully!');
      }
    } else {
      const ok = await signInWithEmail(email.trim(), password.trim());
      if (ok) {
        setStatusMessage('Successfully logged in! Your preparation data was restored from the cloud.');
      }
    }
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setStatusMessage(null);
    const ok = await syncToCloudNow();
    setIsManualSyncing(false);
    if (ok) {
      setStatusMessage('All data synced successfully to Firestore Cloud!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleReloadCloud = async () => {
    setIsManualSyncing(true);
    setStatusMessage(null);
    const ok = await reloadFromCloud();
    setIsManualSyncing(false);
    if (ok) {
      setStatusMessage('Data freshly loaded from your cloud database!');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <Cloud className="w-4 h-4" />
              <span>Firebase Firestore Cloud Integration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cloud Profile & Multi-Device Sync
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Sign in with your email to store your complete GATE preparation workspace in Google Cloud. If you log out and log back in, all your syllabus progress, mock tests, and mistake notes are immediately restored.
            </p>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-ping'
                  : syncStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-slate-300 capitalize">
              {syncStatus === 'synced'
                ? 'Cloud Synced'
                : syncStatus === 'syncing'
                ? 'Syncing to Cloud...'
                : syncStatus === 'error'
                ? 'Sync Error'
                : 'Offline / Not Logged In'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Logged in View vs Auth Form */}
      {currentUser ? (
        <div className="space-y-6">
          {/* User Profile Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-lg font-mono">
                  {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'GT'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{currentUser.displayName}</span>
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      Cloud Active
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 hover:border-rose-800/50 border border-slate-700/60 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Cloud Status bar & Last synced */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>
                  Connected to cloud database (Document: <span className="font-mono text-slate-300">users/{currentUser.uid.slice(0, 8)}...</span>)
                </span>
                {lastSyncedAt && (
                  <>
                    <span>·</span>
                    <span className="text-slate-400">Last sync: {lastSyncedAt}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualSync}
                  disabled={isManualSyncing}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isManualSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button
                  onClick={handleReloadCloud}
                  disabled={isManualSyncing}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                  title="Reload data from Firestore"
                >
                  Reload
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Cloud Stored Data Inventory Cards */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Cloud Stored Preparation Data Inventory</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Subtopics Prepared</span>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  {stats.completedSubtopics} / {stats.totalSubtopics}
                </div>
                <span className="text-[11px] text-slate-500">{stats.overallPercentage}% syllabus</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">PYQs Logged</span>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  {stats.totalPyqsSolved} Solved
                </div>
                <span className="text-[11px] text-slate-500">{stats.totalPyqsBookmarked} starred</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Mock Score Avg</span>
                <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums mt-0.5">
                  {stats.averageMockScore}M
                </div>
                <span className="text-[11px] text-slate-500">Peak: {stats.highestMockScore}M</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Study Streak & Hours</span>
                <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                  {stats.studyStreakDays}d · {stats.totalHoursLogged}h
                </div>
                <span className="text-[11px] text-slate-500">Persistent across logins</span>
              </div>
            </div>
          </div>

          {/* Backup & Data Safety info */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h2 className="text-sm font-semibold text-white">Device Independence & Backup</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your preparation data is continuously saved in real time to your cloud account. If you log out on this computer and open the application on your phone, tablet, or another laptop, simply log in with your email <span className="font-mono text-slate-300">({currentUser.email})</span> and all your data will automatically load.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={exportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download Offline JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Login / Sign Up Form */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-sm space-y-5">
          {/* Segmented Auth Mode Switch */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                  setStatusMessage(null);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  authMode === 'signin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In with Email
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                  setStatusMessage(null);
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  authMode === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create New Account
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
              Secure Cloud Persistence
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md">
            <div>
              <h2 className="text-base font-bold text-white">
                {authMode === 'signin'
                  ? 'Welcome Back to Your GATE Workspace'
                  : authMode === 'signup'
                  ? 'Create Your Cloud Account'
                  : 'Reset Account Password'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {authMode === 'signin'
                  ? 'Sign in with your email to pull your syllabus checklist, mock tests, and mistakes from the cloud.'
                  : authMode === 'signup'
                  ? 'Register with your email to persist your study hours, revisions, and notes across all devices.'
                  : 'Enter your email to receive a password reset link.'}
              </p>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-slate-400 text-xs mb-1">Your Name / Aspirant Handle</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Arun Yadav"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-xs mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="text-slate-400">Password *</label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-indigo-400 hover:text-indigo-300 text-[11px]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error & Success Messages */}
            {authError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {statusMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {authMode === 'signin'
                    ? 'Log In & Load My Data'
                    : authMode === 'signup'
                    ? 'Create Account & Sync to Cloud'
                    : 'Send Password Reset Email'}
                </span>
              )}
            </button>

            {authMode === 'forgot' && (
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
              >
                Back to Sign In
              </button>
            )}
          </form>

          {/* Value Prop banner */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Automatic cloud backup on every edit</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full data restoration upon re-login</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Isolated database document per user</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Web App Links & Cross-Device Access Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Live Web App Links & Access</h2>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online & Hosted</span>
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Open your GATE CS Tracker on any mobile phone, tablet, or browser using these cloud links. Sign in with your email to access all your synced data.
        </p>

        <div className="space-y-3">
          {/* Shared App Link */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Shareable Web App Link</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px] font-mono">Production</span>
              </div>
              <p className="text-slate-400 font-mono text-[11px] truncate">
                {sharedAppUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(sharedAppUrl, 'shared')}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedKey === 'shared' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'shared' ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={sharedAppUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Development Live Link */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Active Workspace Dev URL</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">Dev Server</span>
              </div>
              <p className="text-slate-400 font-mono text-[11px] truncate">
                {devAppUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard(devAppUrl, 'dev')}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedKey === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'dev' ? 'Copied!' : 'Copy URL'}</span>
              </button>
              <a
                href={devAppUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
