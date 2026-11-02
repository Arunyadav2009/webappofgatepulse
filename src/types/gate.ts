export type RevisionStatus = 'not_started' | 'in_progress' | 'completed';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Tricky';
export type ErrorCategory = 'conceptual' | 'calculation' | 'misread' | 'formula_forgotten' | 'time_pressure';

export interface SubTopic {
  id: string;
  name: string;
  completed: boolean;
  round1: boolean;
  round2: boolean;
  round3: boolean;
  shortNotesReady: boolean;
  notes?: string;
}

export interface SubjectTopic {
  id: string;
  name: string;
  subtopics: SubTopic[];
}

export interface GateSubject {
  id: string;
  name: string;
  shortCode: string;
  category: 'core' | 'math' | 'aptitude';
  avgMarks: number;
  iconName: string;
  topics: SubjectTopic[];
}

export interface PyqEntry {
  id: string;
  subjectId: string;
  topicName: string;
  year: number;
  paper?: 'Set 1' | 'Set 2' | 'Set 3';
  questionNumber?: number;
  marks: 1 | 2;
  type: QuestionType;
  difficulty: DifficultyLevel;
  questionSnippet: string;
  correctAnswer?: string;
  keyTakeaway: string;
  isBookmarked: boolean;
  solved: boolean;
  dateLogged: string;
}

export interface MockTest {
  id: string;
  title: string;
  provider: 'Made Easy' | 'GO Classes' | 'Ace Academy' | 'Gate Applied' | 'Testbook' | 'Self / PYQ Paper' | 'Other';
  testType: 'Full Length' | 'Subject Test' | 'Topic Test' | 'Multi-Subject';
  date: string;
  totalMarks: number;
  scoredMarks: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  negativeMarks: number;
  timeSpentMinutes: number;
  targetRankScore?: number;
  subjectBreakdown?: { subjectId: string; scored: number; total: number }[];
  remarks: string;
}

export interface MistakeEntry {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  testOrPyqSource: string;
  category: ErrorCategory;
  whatWentWrong: string;
  correctConcept: string;
  formulaOrRule?: string;
  resolved: boolean;
  dateAdded: string;
}

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  hours: number;
  topicsStudied: string[];
  pyqsSolvedCount: number;
  notes?: string;
}

export interface DailyTarget {
  id: string;
  title: string;
  subjectId: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface FormulaCard {
  id: string;
  subjectId: string;
  topic: string;
  title: string;
  formula: string;
  description: string;
  variablesExplanation?: string[];
  tip?: string;
  isBookmarked: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  targetRankDescription?: string;
  createdAt?: string;
}

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'unauthenticated';

export interface FocusStrategyPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  targetMarks: number;
  subjectIds: string[];
}


