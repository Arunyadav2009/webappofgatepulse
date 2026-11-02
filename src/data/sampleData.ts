import { PyqEntry, MockTest, MistakeEntry, DailyTarget, DailyStudyLog } from '../types/gate';

export const SAMPLE_PYQS: PyqEntry[] = [
  {
    id: 'pyq_1',
    subjectId: 'coa',
    topicName: 'Memory Hierarchy & Cache Memory',
    year: 2024,
    paper: 'Set 1',
    questionNumber: 38,
    marks: 2,
    type: 'NAT',
    difficulty: 'Hard',
    questionSnippet: 'A 4-way set-associative cache memory has 64 KB capacity with 32-byte block size. The CPU generates 32-bit byte-addressable addresses. What is the size of the Tag Directory in bits if each line has 1 valid bit and 1 dirty bit?',
    correctAnswer: '36864 bits (36 Kb)',
    keyTakeaway: 'Number of sets = 64KB / (4 * 32B) = 512 sets = 2^9. Set bits = 9. Word offset = log2(32) = 5. Tag bits = 32 - 9 - 5 = 18 bits. Tag entry per line = 18 (tag) + 1 (valid) + 1 (dirty) = 20 bits. Total lines = 2048. Total tag dir = 2048 * 20 = 40960 bits.',
    isBookmarked: true,
    solved: true,
    dateLogged: '2026-09-20'
  },
  {
    id: 'pyq_2',
    subjectId: 'operating_systems',
    topicName: 'Memory Management & Virtual Memory',
    year: 2023,
    paper: 'Set 1',
    questionNumber: 42,
    marks: 2,
    type: 'NAT',
    difficulty: 'Tricky',
    questionSnippet: 'In a 2-level paging scheme with 32-bit virtual addresses and 4 KB page size, each page table entry (PTE) takes 4 bytes. If the outer page table must fit exactly in ONE single physical page frame, how many bits are used for the inner page table index?',
    correctAnswer: '10 bits',
    keyTakeaway: 'Page size = 4 KB = 2^12 bytes ⇒ Offset = 12 bits. Outer page table fits in 1 page (4 KB) with 4-byte PTEs ⇒ can hold 4KB / 4B = 1024 = 2^10 entries ⇒ Outer table index uses 10 bits. Therefore, inner page table index = 32 - 12 (offset) - 10 (outer) = 10 bits.',
    isBookmarked: true,
    solved: true,
    dateLogged: '2026-09-22'
  },
  {
    id: 'pyq_3',
    subjectId: 'theory_of_computation',
    topicName: 'Finite Automata & Regular Languages',
    year: 2024,
    paper: 'Set 2',
    questionNumber: 22,
    marks: 1,
    type: 'MCQ',
    difficulty: 'Medium',
    questionSnippet: 'Let L = { w ∈ {0,1}* | number of 0s in w is divisible by 3 and number of 1s in w is divisible by 5 }. What is the minimum number of states in a minimal DFA for L?',
    correctAnswer: '15 states',
    keyTakeaway: 'Product automaton construction: gcd(3, 5) = 1. States = 3 * 5 = 15. All 15 states are reachable and pairwise distinguishable by Myhill-Nerode theorem.',
    isBookmarked: false,
    solved: true,
    dateLogged: '2026-09-21'
  },
  {
    id: 'pyq_4',
    subjectId: 'algorithms',
    topicName: 'Graph Algorithms',
    year: 2022,
    paper: 'Set 1',
    questionNumber: 45,
    marks: 2,
    type: 'MSQ',
    difficulty: 'Hard',
    questionSnippet: 'Which of the following statements is/are TRUE for any connected, undirected graph G = (V, E) with distinct positive edge weights?',
    correctAnswer: 'A, C, D',
    keyTakeaway: 'MST is unique if all edge weights are distinct. The minimum weight edge in any cut is ALWAYS part of MST (Cut property). Lightest edge in the entire graph is always in MST.',
    isBookmarked: true,
    solved: true,
    dateLogged: '2026-09-23'
  },
  {
    id: 'pyq_5',
    subjectId: 'computer_networks',
    topicName: 'Network Layer & IP Addressing',
    year: 2023,
    paper: 'Set 2',
    questionNumber: 51,
    marks: 2,
    type: 'NAT',
    difficulty: 'Medium',
    questionSnippet: 'An ISP has granted a classless block of addresses 200.10.0.0/20. An organization wants to create 8 subnets with equal number of usable hosts. What is the maximum number of usable host addresses in each subnet?',
    correctAnswer: '510',
    keyTakeaway: 'Starting prefix /20. Need 8 = 2^3 subnets ⇒ new prefix = 20 + 3 = /23. Host bits = 32 - 23 = 9 bits. Total IP addresses = 2^9 = 512. Usable hosts = 512 - 2 (Network & Broadcast) = 510.',
    isBookmarked: false,
    solved: true,
    dateLogged: '2026-09-24'
  },
  {
    id: 'pyq_6',
    subjectId: 'databases',
    topicName: 'Normalization & Functional Dependencies',
    year: 2021,
    paper: 'Set 1',
    questionNumber: 31,
    marks: 2,
    type: 'MCQ',
    difficulty: 'Medium',
    questionSnippet: 'Consider relation R(A, B, C, D, E) with FDs: { AB → C, C → D, D → B, D → E }. What is the highest normal form satisfied by R?',
    correctAnswer: '3NF',
    keyTakeaway: 'Candidate keys are AB, AC, AD. Prime attributes: A, B, C, D. Non-prime: E. In D → E: D is superkey? No. Is E prime? No! Fails BCNF. In C → D: D is prime (belongs to AD)! Satisfies 3NF. In D → B: B is prime! Satisfies 3NF. Thus highest NF is 3NF.',
    isBookmarked: true,
    solved: false,
    dateLogged: '2026-09-25'
  }
];

export const SAMPLE_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock_1',
    title: 'All India Open Mock 1 - Full Length',
    provider: 'Made Easy',
    testType: 'Full Length',
    date: '2026-09-15',
    totalMarks: 100,
    scoredMarks: 67.33,
    totalQuestions: 65,
    attempted: 54,
    correct: 46,
    incorrect: 8,
    negativeMarks: 4.67,
    timeSpentMinutes: 165,
    targetRankScore: 75,
    remarks: 'Strong performance in Math and OS. Lost 4 marks in COA pipelining due to missing branch delay slot stall cycles.'
  },
  {
    id: 'mock_2',
    title: 'GO Classes Subject Test - Algorithms & DS',
    provider: 'GO Classes',
    testType: 'Subject Test',
    date: '2026-09-18',
    totalMarks: 50,
    scoredMarks: 41.67,
    totalQuestions: 30,
    attempted: 27,
    correct: 24,
    incorrect: 3,
    negativeMarks: 1.66,
    timeSpentMinutes: 75,
    targetRankScore: 42,
    remarks: 'Dynamic Programming questions solved cleanly. Silly mistake in Heap building comparison count.'
  },
  {
    id: 'mock_3',
    title: 'Ace National Mock 2 - Full Length',
    provider: 'Ace Academy',
    testType: 'Full Length',
    date: '2026-09-24',
    totalMarks: 100,
    scoredMarks: 72.00,
    totalQuestions: 65,
    attempted: 58,
    correct: 50,
    incorrect: 8,
    negativeMarks: 4.33,
    timeSpentMinutes: 172,
    targetRankScore: 75,
    remarks: 'Consistent speed. General Aptitude was full score (15/15). Need revision in Computer Networks congestion control window sizes.'
  }
];

export const SAMPLE_MISTAKES: MistakeEntry[] = [
  {
    id: 'err_1',
    title: 'Branch Penalty Cycles Count in COA Pipeline',
    subjectId: 'coa',
    topic: 'Instruction Pipelining Hazards',
    testOrPyqSource: 'Made Easy FLT 1 (Q41)',
    category: 'conceptual',
    whatWentWrong: 'Counted branch target address resolution at Decode stage instead of Execute stage, leading to 1 stall cycle error.',
    correctConcept: 'If branch condition is evaluated in EX stage (stage 3), penalty is 2 stall cycles. If evaluated in ID stage (stage 2), penalty is 1 stall cycle.',
    formulaOrRule: 'Branch Stalls = (Stage where Target is known - 1) cycles without branch prediction.',
    resolved: false,
    dateAdded: '2026-09-15'
  },
  {
    id: 'err_2',
    title: 'Negative Edge Weights in Dijkstra Algorithm',
    subjectId: 'algorithms',
    topic: 'Graph Algorithms - Shortest Path',
    testOrPyqSource: 'GATE 2020 Question MSQ',
    category: 'misread',
    whatWentWrong: 'Assumed Dijkstra fails ONLY if there is a negative weight cycle. Actually Dijkstra can give wrong results even without negative cycles if any edge is negative!',
    correctConcept: 'Dijkstra assumes once a vertex is marked visited (extracted from min-priority queue), its shortest distance is finalized (greedy choice). Negative edge weights can violate this even without cycles.',
    formulaOrRule: 'Use Bellman-Ford (O(V*E)) whenever any negative edge weight exists.',
    resolved: true,
    dateAdded: '2026-09-19'
  },
  {
    id: 'err_3',
    title: 'Number of Host Addresses vs Usable Host Addresses',
    subjectId: 'computer_networks',
    topic: 'IPv4 Subnetting & CIDR',
    testOrPyqSource: 'Practice Set',
    category: 'calculation',
    whatWentWrong: 'Wrote 2^(32-26) = 64 instead of 64 - 2 = 62 usable hosts because forgot to subtract Network ID and Direct Broadcast Address.',
    correctConcept: 'Total IP count = 2^h. Usable Host count = 2^h - 2 (First address is Subnet ID, Last is Broadcast).',
    formulaOrRule: 'Usable Hosts = 2^(32 - Prefix) - 2',
    resolved: true,
    dateAdded: '2026-09-22'
  }
];

export const SAMPLE_DAILY_TARGETS: DailyTarget[] = [
  { id: 't_1', title: 'Solve 15 PYQs from COA Memory Hierarchy', subjectId: 'coa', completed: true, priority: 'high' },
  { id: 't_2', title: 'Revise Master Theorem & Recursion Trees', subjectId: 'algorithms', completed: true, priority: 'medium' },
  { id: 't_3', title: 'Practice 10 GATE Virtual Calculator Calculations', subjectId: 'general_aptitude', completed: false, priority: 'high' },
  { id: 't_4', title: 'Review 3NF vs BCNF Decomposition questions', subjectId: 'databases', completed: false, priority: 'medium' }
];

export const SAMPLE_STUDY_LOGS: DailyStudyLog[] = [
  { date: '2026-09-20', hours: 5.5, topicsStudied: ['COA Cache Mapping', 'Discrete Math Sets'], pyqsSolvedCount: 22 },
  { date: '2026-09-21', hours: 6.0, topicsStudied: ['TOC DFA Minimization', 'C Pointers'], pyqsSolvedCount: 28 },
  { date: '2026-09-22', hours: 4.5, topicsStudied: ['OS Paging', 'Virtual Memory'], pyqsSolvedCount: 18 },
  { date: '2026-09-23', hours: 7.0, topicsStudied: ['Algorithms DP', 'Graph BFS/DFS'], pyqsSolvedCount: 30 },
  { date: '2026-09-24', hours: 5.0, topicsStudied: ['Full Length Mock 1 Analysis'], pyqsSolvedCount: 15 },
  { date: '2026-09-25', hours: 6.5, topicsStudied: ['DBMS Normalization', 'CN Subnetting'], pyqsSolvedCount: 25 },
  { date: '2026-09-26', hours: 4.0, topicsStudied: ['Compiler Design LL(1)', 'General Aptitude'], pyqsSolvedCount: 16 }
];
