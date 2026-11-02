import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  GateSubject,
  PyqEntry,
  MockTest,
  MistakeEntry,
  DailyTarget,
  DailyStudyLog,
  FormulaCard,
  UserProfile,
  CloudSyncStatus
} from '../types/gate';
import { INITIAL_GATE_SUBJECTS } from '../data/gateSyllabus';
import { HIGH_YIELD_FORMULAS } from '../data/formulaSheet';
import { FOCUS_STRATEGY_PRESETS } from '../data/focusPresets';
import {
  SAMPLE_PYQS,
  SAMPLE_MOCK_TESTS,
  SAMPLE_MISTAKES,
  SAMPLE_DAILY_TARGETS,
  SAMPLE_STUDY_LOGS
} from '../data/sampleData';
import { auth, db } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const STORAGE_KEY = 'gate_cs_tracker_data_v1';

export type ActiveTab = 'overview' | 'focus' | 'syllabus' | 'pyqs' | 'mocks' | 'mistakes' | 'formulas' | 'planner' | 'profile';

interface GateContextType {
  subjects: GateSubject[];
  pyqs: PyqEntry[];
  mockTests: MockTest[];
  mistakes: MistakeEntry[];
  dailyTargets: DailyTarget[];
  studyLogs: DailyStudyLog[];
  formulaCards: FormulaCard[];
  examDate: string;
  targetScore: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;

  // Selected Focus Subjects Strategy
  selectedSubjectIds: string[];
  isFocusScopeActive: boolean;
  setIsFocusScopeActive: (active: boolean) => void;
  toggleSubjectFocus: (subjectId: string) => void;
  selectAllFocusSubjects: () => void;
  clearAllFocusSubjects: () => void;
  applyFocusPreset: (presetId: string) => void;
  focusStats: {
    selectedCount: number;
    totalPossibleMarks: number;
    completedSubtopics: number;
    totalSubtopics: number;
    overallPercentage: number;
    round1Percentage: number;
    round2Percentage: number;
    round3Percentage: number;
  };

  // Share & Link state
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  createPlanShareUrl: (customSubjectIds?: string[]) => string;

  // Cloud & Profile state
  currentUser: UserProfile | null;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  isAuthLoading: boolean;

  // Cloud Auth actions
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<boolean>;
  syncToCloudNow: () => Promise<boolean>;
  reloadFromCloud: () => Promise<boolean>;

  // Data Actions
  toggleSubtopicField: (
    subjectId: string,
    topicId: string,
    subtopicId: string,
    field: 'completed' | 'round1' | 'round2' | 'round3' | 'shortNotesReady'
  ) => void;
  batchUpdateSubjectRound: (subjectId: string, field: 'round1' | 'round2' | 'round3' | 'completed', value: boolean) => void;

  addPyq: (entry: Omit<PyqEntry, 'id' | 'dateLogged'>) => void;
  updatePyq: (id: string, updates: Partial<PyqEntry>) => void;
  deletePyq: (id: string) => void;
  togglePyqBookmark: (id: string) => void;
  togglePyqSolved: (id: string) => void;

  addMockTest: (mock: Omit<MockTest, 'id'>) => void;
  deleteMockTest: (id: string) => void;

  addMistake: (mistake: Omit<MistakeEntry, 'id' | 'dateAdded'>) => void;
  toggleMistakeResolved: (id: string) => void;
  deleteMistake: (id: string) => void;

  addDailyTarget: (title: string, subjectId: string, priority: 'high' | 'medium' | 'low') => void;
  toggleDailyTarget: (id: string) => void;
  deleteDailyTarget: (id: string) => void;

  logStudySession: (hours: number, topicsStudied: string[], pyqsCount: number, notes?: string) => void;
  setExamDate: (date: string) => void;
  setTargetScore: (score: number) => void;
  toggleFormulaBookmark: (id: string) => void;

  exportBackup: () => void;
  importBackup: (jsonContent: string) => boolean;
  resetToDefaults: () => void;

  // Analytics
  stats: {
    overallPercentage: number;
    round1Percentage: number;
    round2Percentage: number;
    round3Percentage: number;
    shortNotesPercentage: number;
    totalSubtopics: number;
    completedSubtopics: number;
    totalPyqsSolved: number;
    totalPyqsBookmarked: number;
    unresolvedMistakes: number;
    averageMockScore: number;
    highestMockScore: number;
    daysLeft: number;
    studyStreakDays: number;
    totalHoursLogged: number;
  };
}

const GateContext = createContext<GateContextType | undefined>(undefined);

export const GateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [subjects, setSubjects] = useState<GateSubject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subjects && parsed.subjects.length > 0) return parsed.subjects;
      }
    } catch {
      // ignore
    }
    const seeded = JSON.parse(JSON.stringify(INITIAL_GATE_SUBJECTS));
    if (seeded[0]?.topics[0]?.subtopics[0]) {
      seeded[0].topics[0].subtopics[0].completed = true;
      seeded[0].topics[0].subtopics[0].round1 = true;
      seeded[0].topics[0].subtopics[0].shortNotesReady = true;
    }
    if (seeded[3]?.topics[0]?.subtopics[0]) {
      seeded[3].topics[0].subtopics[0].completed = true;
      seeded[3].topics[0].subtopics[0].round1 = true;
    }
    return seeded;
  });

  const [pyqs, setPyqs] = useState<PyqEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pyqs) return parsed.pyqs;
      }
    } catch {
      // ignore
    }
    return SAMPLE_PYQS;
  });

  const [mockTests, setMockTests] = useState<MockTest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mockTests) return parsed.mockTests;
      }
    } catch {
      // ignore
    }
    return SAMPLE_MOCK_TESTS;
  });

  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mistakes) return parsed.mistakes;
      }
    } catch {
      // ignore
    }
    return SAMPLE_MISTAKES;
  });

  const [dailyTargets, setDailyTargets] = useState<DailyTarget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyTargets) return parsed.dailyTargets;
      }
    } catch {
      // ignore
    }
    return SAMPLE_DAILY_TARGETS;
  });

  const [studyLogs, setStudyLogs] = useState<DailyStudyLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studyLogs) return parsed.studyLogs;
      }
    } catch {
      // ignore
    }
    return SAMPLE_STUDY_LOGS;
  });

  const [formulaCards, setFormulaCards] = useState<FormulaCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formulaCards) return parsed.formulaCards;
      }
    } catch {
      // ignore
    }
    return HIGH_YIELD_FORMULAS;
  });

  const [examDate, setExamDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.examDate) return parsed.examDate;
      }
    } catch {
      // ignore
    }
    return '2027-02-07';
  });

  const [targetScore, setTargetScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.targetScore) return parsed.targetScore;
      }
    } catch {
      // ignore
    }
    return 75;
  });

  // Selected Focus Subjects Strategy state
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedSubjectIds && Array.isArray(parsed.selectedSubjectIds)) {
          return parsed.selectedSubjectIds;
        }
      }
    } catch {
      // ignore
    }
    // Default to the high-yield 5-subject core
    return ['general_aptitude', 'discrete_math', 'operating_systems', 'databases', 'theory_of_computation'];
  });

  const [isFocusScopeActive, setIsFocusScopeActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isFocusScopeActive === 'boolean') {
          return parsed.isFocusScopeActive;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Auto-detect focus plan or target score from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const focusParam = params.get('focus');
        const targetParam = params.get('target');
        const examParam = params.get('exam');

        if (focusParam) {
          const ids = focusParam.split(',').map(s => s.trim()).filter(Boolean);
          if (ids.length > 0) {
            setSelectedSubjectIds(ids);
            setIsFocusScopeActive(true);
          }
        }
        if (targetParam && !isNaN(Number(targetParam))) {
          const parsed = Number(targetParam);
          if (parsed > 0 && parsed <= 100) {
            setTargetScore(parsed);
          }
        }
        if (examParam && /^\d{4}-\d{2}-\d{2}$/.test(examParam)) {
          setExamDate(examParam);
        }
      } catch (err) {
        console.error('Failed reading URL params', err);
      }
    }
  }, []);

  const createPlanShareUrl = (customSubjectIds?: string[]): string => {
    const ids = customSubjectIds || selectedSubjectIds;
    const origin = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://ais-pre-3anh5o4bwt2guz4a4g5gk4-145906123220.asia-southeast1.run.app';

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    const params = new URLSearchParams();
    if (ids.length > 0) {
      params.set('focus', ids.join(','));
    }
    if (targetScore) {
      params.set('target', targetScore.toString());
    }
    if (examDate) {
      params.set('exam', examDate);
    }
    return `${origin}${pathname}?${params.toString()}`;
  };

  // Cloud auth & sync states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('unauthenticated');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCloudLoadingRef = useRef<boolean>(false);

  // Save to local storage whenever state changes
  useEffect(() => {
    try {
      const payload = {
        subjects,
        pyqs,
        mockTests,
        mistakes,
        dailyTargets,
        studyLogs,
        formulaCards,
        examDate,
        targetScore,
        selectedSubjectIds,
        isFocusScopeActive
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Failed saving to localStorage', err);
    }
  }, [subjects, pyqs, mockTests, mistakes, dailyTargets, studyLogs, formulaCards, examDate, targetScore, selectedSubjectIds, isFocusScopeActive]);

  // Load user data from Firestore
  const fetchCloudData = async (uid: string) => {
    try {
      isCloudLoadingRef.current = true;
      setSyncStatus('syncing');
      const trackerDocRef = doc(db, 'users', uid, 'gateData', 'tracker');
      const docSnap = await getDoc(trackerDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.subjects) setSubjects(data.subjects);
        if (data.pyqs) setPyqs(data.pyqs);
        if (data.mockTests) setMockTests(data.mockTests);
        if (data.mistakes) setMistakes(data.mistakes);
        if (data.dailyTargets) setDailyTargets(data.dailyTargets);
        if (data.studyLogs) setStudyLogs(data.studyLogs);
        if (data.formulaCards) setFormulaCards(data.formulaCards);
        if (data.examDate) setExamDate(data.examDate);
        if (data.targetScore) setTargetScore(data.targetScore);
        if (data.selectedSubjectIds) setSelectedSubjectIds(data.selectedSubjectIds);
        if (typeof data.isFocusScopeActive === 'boolean') setIsFocusScopeActive(data.isFocusScopeActive);
        if (data.lastSyncedAt) setLastSyncedAt(data.lastSyncedAt);

        setSyncStatus('synced');
      } else {
        await pushDataToCloud(uid);
      }
    } catch (err) {
      console.error('Error fetching cloud data:', err);
      setSyncStatus('error');
    } finally {
      setTimeout(() => {
        isCloudLoadingRef.current = false;
      }, 500);
    }
  };

  // Push data to Firestore
  const pushDataToCloud = async (uid: string): Promise<boolean> => {
    try {
      setSyncStatus('syncing');
      const trackerDocRef = doc(db, 'users', uid, 'gateData', 'tracker');
      const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const payload = {
        subjects,
        pyqs,
        mockTests,
        mistakes,
        dailyTargets,
        studyLogs,
        formulaCards,
        examDate,
        targetScore,
        selectedSubjectIds,
        isFocusScopeActive,
        lastSyncedAt: timestampStr,
        updatedAt: serverTimestamp()
      };

      await setDoc(trackerDocRef, payload, { merge: true });
      setLastSyncedAt(timestampStr);
      setSyncStatus('synced');
      return true;
    } catch (err) {
      console.error('Error pushing data to cloud:', err);
      setSyncStatus('error');
      return false;
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setIsAuthLoading(true);
      if (user) {
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'GATE Aspirant',
          createdAt: user.metadata.creationTime
        };
        setCurrentUser(profile);
        await fetchCloudData(user.uid);
      } else {
        setCurrentUser(null);
        setSyncStatus('unauthenticated');
        setLastSyncedAt(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debounced auto-save to cloud
  useEffect(() => {
    if (!currentUser || isCloudLoadingRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      pushDataToCloud(currentUser.uid);
    }, 1800);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [subjects, pyqs, mockTests, mistakes, dailyTargets, studyLogs, formulaCards, examDate, targetScore, selectedSubjectIds, isFocusScopeActive, currentUser]);

  // Focus Strategy Methods
  const toggleSubjectFocus = (subjectId: string) => {
    setSelectedSubjectIds(prev => {
      if (prev.includes(subjectId)) {
        // Prevent deselecting down to zero
        if (prev.length <= 1) return prev;
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const selectAllFocusSubjects = () => {
    setSelectedSubjectIds(subjects.map(s => s.id));
  };

  const clearAllFocusSubjects = () => {
    // Keep at least one subject
    setSelectedSubjectIds(['general_aptitude']);
  };

  const applyFocusPreset = (presetId: string) => {
    const preset = FOCUS_STRATEGY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedSubjectIds(preset.subjectIds);
    }
  };

  // Auth Functions
  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setAuthError(null);
      setIsAuthLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchCloudData(cred.user.uid);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setAuthError(message);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<boolean> => {
    try {
      setAuthError(null);
      setIsAuthLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      await pushDataToCloud(cred.user.uid);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setAuthError(message);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setSyncStatus('unauthenticated');
      setLastSyncedAt(null);
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const resetUserPassword = async (email: string): Promise<boolean> => {
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setAuthError(message);
      return false;
    }
  };

  const syncToCloudNow = async (): Promise<boolean> => {
    if (!currentUser) return false;
    return await pushDataToCloud(currentUser.uid);
  };

  const reloadFromCloud = async (): Promise<boolean> => {
    if (!currentUser) return false;
    await fetchCloudData(currentUser.uid);
    return true;
  };

  // Actions
  const toggleSubtopicField = (
    subjectId: string,
    topicId: string,
    subtopicId: string,
    field: 'completed' | 'round1' | 'round2' | 'round3' | 'shortNotesReady'
  ) => {
    setSubjects(prev =>
      prev.map(subject => {
        if (subject.id !== subjectId) return subject;
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              subtopics: topic.subtopics.map(sub => {
                if (sub.id !== subtopicId) return sub;
                const nextVal = !sub[field];
                const updated = { ...sub, [field]: nextVal };
                if (field === 'round3' && nextVal) {
                  updated.completed = true;
                  updated.round1 = true;
                  updated.round2 = true;
                }
                if (field === 'completed' && nextVal && !sub.round1) {
                  updated.round1 = true;
                }
                return updated;
              })
            };
          })
        };
      })
    );
  };

  const batchUpdateSubjectRound = (
    subjectId: string,
    field: 'round1' | 'round2' | 'round3' | 'completed',
    value: boolean
  ) => {
    setSubjects(prev =>
      prev.map(subject => {
        if (subject.id !== subjectId) return subject;
        return {
          ...subject,
          topics: subject.topics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(sub => ({
              ...sub,
              [field]: value,
              ...(field === 'completed' && value ? { round1: true } : {})
            }))
          }))
        };
      })
    );
  };

  const addPyq = (entry: Omit<PyqEntry, 'id' | 'dateLogged'>) => {
    const newEntry: PyqEntry = {
      ...entry,
      id: 'pyq_' + Date.now(),
      dateLogged: new Date().toISOString().split('T')[0]
    };
    setPyqs(prev => [newEntry, ...prev]);
  };

  const updatePyq = (id: string, updates: Partial<PyqEntry>) => {
    setPyqs(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePyq = (id: string) => {
    setPyqs(prev => prev.filter(p => p.id !== id));
  };

  const togglePyqBookmark = (id: string) => {
    setPyqs(prev => prev.map(p => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p)));
  };

  const togglePyqSolved = (id: string) => {
    setPyqs(prev => prev.map(p => (p.id === id ? { ...p, solved: !p.solved } : p)));
  };

  const addMockTest = (mock: Omit<MockTest, 'id'>) => {
    const newTest: MockTest = {
      ...mock,
      id: 'mock_' + Date.now()
    };
    setMockTests(prev => [newTest, ...prev]);
  };

  const deleteMockTest = (id: string) => {
    setMockTests(prev => prev.filter(m => m.id !== id));
  };

  const addMistake = (mistake: Omit<MistakeEntry, 'id' | 'dateAdded'>) => {
    const newMistake: MistakeEntry = {
      ...mistake,
      id: 'mistake_' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setMistakes(prev => [newMistake, ...prev]);
  };

  const toggleMistakeResolved = (id: string) => {
    setMistakes(prev => prev.map(m => (m.id === id ? { ...m, resolved: !m.resolved } : m)));
  };

  const deleteMistake = (id: string) => {
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const addDailyTarget = (title: string, subjectId: string, priority: 'high' | 'medium' | 'low') => {
    const newTarget: DailyTarget = {
      id: 'target_' + Date.now(),
      title,
      subjectId,
      completed: false,
      priority
    };
    setDailyTargets(prev => [...prev, newTarget]);
  };

  const toggleDailyTarget = (id: string) => {
    setDailyTargets(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteDailyTarget = (id: string) => {
    setDailyTargets(prev => prev.filter(t => t.id !== id));
  };

  const logStudySession = (hours: number, topicsStudied: string[], pyqsCount: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setStudyLogs(prev => {
      const existingIndex = prev.findIndex(l => l.date === today);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          hours: copy[existingIndex].hours + hours,
          pyqsSolvedCount: copy[existingIndex].pyqsSolvedCount + pyqsCount,
          topicsStudied: Array.from(new Set([...copy[existingIndex].topicsStudied, ...topicsStudied])),
          notes: notes || copy[existingIndex].notes
        };
        return copy;
      } else {
        return [...prev, { date: today, hours, topicsStudied, pyqsSolvedCount: pyqsCount, notes }];
      }
    });
  };

  const toggleFormulaBookmark = (id: string) => {
    setFormulaCards(prev => prev.map(f => (f.id === id ? { ...f, isBookmarked: !f.isBookmarked } : f)));
  };

  const exportBackup = () => {
    const payload = {
      exportVersion: '1.0',
      exportDate: new Date().toISOString(),
      subjects,
      pyqs,
      mockTests,
      mistakes,
      dailyTargets,
      studyLogs,
      formulaCards,
      examDate,
      targetScore,
      selectedSubjectIds,
      isFocusScopeActive
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gate_cs_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonContent: string): boolean => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.subjects && Array.isArray(parsed.subjects)) {
        setSubjects(parsed.subjects);
        if (parsed.pyqs) setPyqs(parsed.pyqs);
        if (parsed.mockTests) setMockTests(parsed.mockTests);
        if (parsed.mistakes) setMistakes(parsed.mistakes);
        if (parsed.dailyTargets) setDailyTargets(parsed.dailyTargets);
        if (parsed.studyLogs) setStudyLogs(parsed.studyLogs);
        if (parsed.formulaCards) setFormulaCards(parsed.formulaCards);
        if (parsed.examDate) setExamDate(parsed.examDate);
        if (parsed.targetScore) setTargetScore(parsed.targetScore);
        if (parsed.selectedSubjectIds) setSelectedSubjectIds(parsed.selectedSubjectIds);
        if (typeof parsed.isFocusScopeActive === 'boolean') setIsFocusScopeActive(parsed.isFocusScopeActive);

        if (currentUser) {
          pushDataToCloud(currentUser.uid);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all tracker data to sample data? This will clear recent modifications.')) {
      setSubjects(INITIAL_GATE_SUBJECTS);
      setPyqs(SAMPLE_PYQS);
      setMockTests(SAMPLE_MOCK_TESTS);
      setMistakes(SAMPLE_MISTAKES);
      setDailyTargets(SAMPLE_DAILY_TARGETS);
      setStudyLogs(SAMPLE_STUDY_LOGS);
      setFormulaCards(HIGH_YIELD_FORMULAS);
      setSelectedSubjectIds(['general_aptitude', 'discrete_math', 'operating_systems', 'databases', 'theory_of_computation']);
      setIsFocusScopeActive(false);
    }
  };

  // Focus Statistics (computed strictly for selected subjects)
  const focusStats = useMemo(() => {
    let totalMarks = 0;
    let totalSub = 0;
    let compSub = 0;
    let r1Sub = 0;
    let r2Sub = 0;
    let r3Sub = 0;

    subjects.forEach(s => {
      if (selectedSubjectIds.includes(s.id)) {
        totalMarks += s.avgMarks;
        s.topics.forEach(t => {
          t.subtopics.forEach(sub => {
            totalSub++;
            if (sub.completed) compSub++;
            if (sub.round1) r1Sub++;
            if (sub.round2) r2Sub++;
            if (sub.round3) r3Sub++;
          });
        });
      }
    });

    const overallPercentage = totalSub > 0 ? Math.round((compSub / totalSub) * 100) : 0;
    const round1Percentage = totalSub > 0 ? Math.round((r1Sub / totalSub) * 100) : 0;
    const round2Percentage = totalSub > 0 ? Math.round((r2Sub / totalSub) * 100) : 0;
    const round3Percentage = totalSub > 0 ? Math.round((r3Sub / totalSub) * 100) : 0;

    return {
      selectedCount: selectedSubjectIds.length,
      totalPossibleMarks: totalMarks,
      completedSubtopics: compSub,
      totalSubtopics: totalSub,
      overallPercentage,
      round1Percentage,
      round2Percentage,
      round3Percentage
    };
  }, [subjects, selectedSubjectIds]);

  // Global Computed statistics
  const stats = useMemo(() => {
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    let round1Count = 0;
    let round2Count = 0;
    let round3Count = 0;
    let shortNotesCount = 0;

    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.subtopics.forEach(sub => {
          totalSubtopics++;
          if (sub.completed) completedSubtopics++;
          if (sub.round1) round1Count++;
          if (sub.round2) round2Count++;
          if (sub.round3) round3Count++;
          if (sub.shortNotesReady) shortNotesCount++;
        });
      });
    });

    const overallPercentage = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    const round1Percentage = totalSubtopics > 0 ? Math.round((round1Count / totalSubtopics) * 100) : 0;
    const round2Percentage = totalSubtopics > 0 ? Math.round((round2Count / totalSubtopics) * 100) : 0;
    const round3Percentage = totalSubtopics > 0 ? Math.round((round3Count / totalSubtopics) * 100) : 0;
    const shortNotesPercentage = totalSubtopics > 0 ? Math.round((shortNotesCount / totalSubtopics) * 100) : 0;

    const totalPyqsSolved = pyqs.filter(p => p.solved).length;
    const totalPyqsBookmarked = pyqs.filter(p => p.isBookmarked).length;
    const unresolvedMistakes = mistakes.filter(m => !m.resolved).length;

    const avgScore =
      mockTests.length > 0
        ? Number((mockTests.reduce((acc, m) => acc + m.scoredMarks, 0) / mockTests.length).toFixed(2))
        : 0;
    const highestScore =
      mockTests.length > 0 ? Math.max(...mockTests.map(m => m.scoredMarks)) : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(examDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalHoursLogged = studyLogs.reduce((acc, log) => acc + log.hours, 0);
    const studyStreakDays = studyLogs.length;

    return {
      overallPercentage,
      round1Percentage,
      round2Percentage,
      round3Percentage,
      shortNotesPercentage,
      totalSubtopics,
      completedSubtopics,
      totalPyqsSolved,
      totalPyqsBookmarked,
      unresolvedMistakes,
      averageMockScore: avgScore,
      highestMockScore: highestScore,
      daysLeft,
      studyStreakDays,
      totalHoursLogged: Number(totalHoursLogged.toFixed(1))
    };
  }, [subjects, pyqs, mockTests, mistakes, examDate, studyLogs]);

  return (
    <GateContext.Provider
      value={{
        subjects,
        pyqs,
        mockTests,
        mistakes,
        dailyTargets,
        studyLogs,
        formulaCards,
        examDate,
        targetScore,
        activeTab,
        setActiveTab,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        createPlanShareUrl,
        selectedSubjectIds,
        isFocusScopeActive,
        setIsFocusScopeActive,
        toggleSubjectFocus,
        selectAllFocusSubjects,
        clearAllFocusSubjects,
        applyFocusPreset,
        focusStats,
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
        toggleSubtopicField,
        batchUpdateSubjectRound,
        addPyq,
        updatePyq,
        deletePyq,
        togglePyqBookmark,
        togglePyqSolved,
        addMockTest,
        deleteMockTest,
        addMistake,
        toggleMistakeResolved,
        deleteMistake,
        addDailyTarget,
        toggleDailyTarget,
        deleteDailyTarget,
        logStudySession,
        setExamDate,
        setTargetScore,
        toggleFormulaBookmark,
        exportBackup,
        importBackup,
        resetToDefaults,
        stats
      }}
    >
      {children}
    </GateContext.Provider>
  );
};

export const useGateContext = () => {
  const context = useContext(GateContext);
  if (!context) {
    throw new Error('useGateContext must be used within a GateProvider');
  }
  return context;
};
