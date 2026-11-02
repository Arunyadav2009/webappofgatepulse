import { GateSubject } from '../types/gate';

export const INITIAL_GATE_SUBJECTS: GateSubject[] = [
  {
    id: 'discrete_math',
    name: 'Discrete Mathematics & Engg Math',
    shortCode: 'EM & DM',
    category: 'math',
    avgMarks: 13,
    iconName: 'Binary',
    topics: [
      {
        id: 'prop_logic',
        name: 'Mathematical Logic',
        subtopics: [
          { id: 'dm_1', name: 'Propositional Logic & Truth Tables', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_2', name: 'First-Order Predicate Logic & Quantifiers', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_3', name: 'Logical Equivalences & Valid Arguments', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'sets_relations',
        name: 'Sets, Relations & Functions',
        subtopics: [
          { id: 'dm_4', name: 'Set Operations, Inclusion-Exclusion Principle', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_5', name: 'Relations: Equivalence, Reflexive, Symmetric, Transitive', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_6', name: 'Partial Orders, Hasse Diagrams & Lattices', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_7', name: 'Functions: Injective, Surjective, Bijective, Pigeonhole', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'combinatorics',
        name: 'Combinatorics & Recurrence',
        subtopics: [
          { id: 'dm_8', name: 'Permutations, Combinations & Counting Rules', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_9', name: 'Generating Functions & Derangements', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_10', name: 'Recurrence Relations (Homogeneous & Non-Homogeneous)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'graph_theory',
        name: 'Graph Theory',
        subtopics: [
          { id: 'dm_11', name: 'Handshaking Lemma, Degrees, Subgraphs', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_12', name: 'Connectivity, Paths, Cycles, Euler & Hamiltonian Graphs', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_13', name: 'Trees, Spanning Trees, Planar Graphs & Kuratowski', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_14', name: 'Graph Coloring, Chromatic Number & Matching', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'linear_algebra',
        name: 'Linear Algebra',
        subtopics: [
          { id: 'dm_15', name: 'Matrices, Determinants & Rank of Matrix', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_16', name: 'System of Linear Equations (AX = B Consistency)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_17', name: 'Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_18', name: 'LU Decomposition & Vector Spaces', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'probability',
        name: 'Probability & Calculus',
        subtopics: [
          { id: 'dm_19', name: 'Conditional Probability & Bayes Theorem', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_20', name: 'Random Variables, Expectation, Variance & Covariance', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_21', name: 'Distributions (Uniform, Binomial, Poisson, Normal, Exponential)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dm_22', name: 'Calculus: Limits, Continuity, Maxima/Minima, Integration', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'digital_logic',
    name: 'Digital Logic',
    shortCode: 'DL',
    category: 'core',
    avgMarks: 6,
    iconName: 'Cpu',
    topics: [
      {
        id: 'bool_algebra',
        name: 'Boolean Algebra & Minimization',
        subtopics: [
          { id: 'dl_1', name: 'Boolean Laws, Canonical SOP & POS forms', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_2', name: 'Logic Gates, Universal Gates (NAND, NOR)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_3', name: 'K-Maps (up to 4-5 variables, Don\'t Care terms)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'comb_circuits',
        name: 'Combinational Circuits',
        subtopics: [
          { id: 'dl_4', name: 'Adders (Half/Full), Carry Look-Ahead Adder', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_5', name: 'Multiplexers & Demultiplexers implementation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_6', name: 'Decoders, Encoders & Priority Encoders', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_7', name: 'Magnitude Comparators & Code Converters', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'seq_circuits',
        name: 'Sequential Circuits & Number Systems',
        subtopics: [
          { id: 'dl_8', name: 'Latches & Flip-Flops (SR, JK, D, T), Conversions', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_9', name: 'Counters (Synchronous, Asynchronous/Ripple, Ring, Johnson)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_10', name: 'Finite State Machines (Mealy & Moore models)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'dl_11', name: 'Number Representations, 1s & 2s Complement, Floating Point', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'coa',
    name: 'Computer Organization & Architecture',
    shortCode: 'COA',
    category: 'core',
    avgMarks: 9,
    iconName: 'Server',
    topics: [
      {
        id: 'machine_inst',
        name: 'Machine Instructions & Addressing',
        subtopics: [
          { id: 'coa_1', name: 'Instruction Formats, Opcode, Addressing Modes', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_2', name: 'ALU, Data Path & Control Unit (Hardwired vs Microprogrammed)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'pipelining',
        name: 'Instruction Pipelining & Performance',
        subtopics: [
          { id: 'coa_3', name: 'Pipelining Stages, Clock Cycle, Non-overlapped vs Overlapped', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_4', name: 'Pipeline Hazards (Structural, Data, Control)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_5', name: 'Speedup, CPI, Throughput, Branch Prediction & Stalls', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'memory_hierarchy',
        name: 'Memory Hierarchy & Cache Memory',
        subtopics: [
          { id: 'coa_6', name: 'Cache Mapping: Direct, Fully Associative, Set-Associative', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_7', name: 'Tag, Set, Word Offset address bits breakdown', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_8', name: 'Cache Replacement Policies & Write Policies (Write-through vs Write-back)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_9', name: 'Multi-Level Cache & Average Memory Access Time (AMAT)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'io_interface',
        name: 'I/O Organization & Secondary Storage',
        subtopics: [
          { id: 'coa_10', name: 'Programmed I/O, Interrupt Driven I/O', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_11', name: 'Direct Memory Access (DMA) & Cycle Stealing', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'coa_12', name: 'Secondary Storage, Disk Access Time & Bus Standards', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'programming_ds',
    name: 'Programming & Data Structures',
    shortCode: 'PDS',
    category: 'core',
    avgMarks: 11,
    iconName: 'Code',
    topics: [
      {
        id: 'c_programming',
        name: 'C Programming',
        subtopics: [
          { id: 'pds_1', name: 'Data Types, Operators, Precedence & Associativity', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_2', name: 'Control Flow, Loops, Switch & Conditionals', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_3', name: 'Functions, Parameter Passing (Value vs Reference)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_4', name: 'Recursion, Call Stack, Tree Recursion & Static variables', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_5', name: 'Pointers, Pointer Arithmetic, Arrays & Strings', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_6', name: 'Dynamic Memory Allocation (malloc, free), Structures & Unions', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'linear_ds',
        name: 'Linear Data Structures',
        subtopics: [
          { id: 'pds_7', name: 'Arrays (1D, 2D Row-major / Column-major addressing)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_8', name: 'Stacks: Infix to Postfix/Prefix, Evaluation, Bracket matching', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_9', name: 'Queues: Circular Queue, Deque, Priority Queue implementation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_10', name: 'Linked Lists (Singly, Doubly, Circular, operations & reversal)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'non_linear_ds',
        name: 'Trees & Non-Linear Structures',
        subtopics: [
          { id: 'pds_11', name: 'Binary Trees, Properties, Traversals (Pre, In, Post, Level)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_12', name: 'Binary Search Trees (BST): Insertion, Deletion, Search', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_13', name: 'Balanced BSTs: AVL Trees & Rotations', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'pds_14', name: 'Binary Heaps (Min/Max Heap, Build-Heap, Heapify, Heap-Sort)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    shortCode: 'ALGO',
    category: 'core',
    avgMarks: 9,
    iconName: 'Boxes',
    topics: [
      {
        id: 'asymptotics',
        name: 'Asymptotic Analysis & Recurrences',
        subtopics: [
          { id: 'algo_1', name: 'Asymptotic Notations (O, Ω, Θ, o, ω), Rate of Growth', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_2', name: 'Solving Recurrence Relations (Master Method, Substitution, Recursion Tree)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'divide_sorting',
        name: 'Searching, Sorting & Hashing',
        subtopics: [
          { id: 'algo_3', name: 'Divide & Conquer, Binary Search variations', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_4', name: 'Sorting: Merge Sort, Quick Sort (Best/Worst/Average, Randomized)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_5', name: 'Linear Sorting: Counting Sort, Radix Sort, Comparison bounds', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_6', name: 'Hashing: Hash functions, Separate Chaining, Open Addressing (Linear, Quadratic, Double)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'greedy_dp',
        name: 'Greedy & Dynamic Programming',
        subtopics: [
          { id: 'algo_7', name: 'Greedy: Activity Selection, Huffman Coding, Fractional Knapsack', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_8', name: 'DP: 0/1 Knapsack, Longest Common Subsequence (LCS)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_9', name: 'DP: Matrix Chain Multiplication, Subset Sum, Optimal BST', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'graph_algos',
        name: 'Graph Algorithms',
        subtopics: [
          { id: 'algo_10', name: 'Breadth First Search (BFS) & Depth First Search (DFS)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_11', name: 'Topological Sort & Strongly Connected Components (Kosaraju)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_12', name: 'Minimum Spanning Trees: Kruskal\'s & Prim\'s Algorithm', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_13', name: 'Single Source Shortest Path: Dijkstra\'s & Bellman-Ford', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'algo_14', name: 'All Pairs Shortest Path: Floyd-Warshall Algorithm', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'theory_of_computation',
    name: 'Theory of Computation',
    shortCode: 'TOC',
    category: 'core',
    avgMarks: 8,
    iconName: 'Network',
    topics: [
      {
        id: 'finite_automata',
        name: 'Finite Automata & Regular Languages',
        subtopics: [
          { id: 'toc_1', name: 'DFA, NFA, Epsilon-NFA constructions & state transitions', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_2', name: 'DFA Minimization (Equivalence Theorem & Myhill-Nerode)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_3', name: 'Regular Expressions & Regular Grammars', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_4', name: 'Closure Properties of Regular Languages', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_5', name: 'Pumping Lemma for Regular Languages & Non-regularity proofs', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'cfg_pda',
        name: 'Context-Free Grammars & PDA',
        subtopics: [
          { id: 'toc_6', name: 'Context-Free Grammars (CFG), Derivations, Ambiguity', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_7', name: 'Chomsky Normal Form (CNF) & Simplification of CFG', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_8', name: 'Pushdown Automata (DPDA vs NPDA, acceptance by empty stack / final state)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_9', name: 'Context-Free Languages (CFL) & DCFL Properties, Closure Properties', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'turing_decidability',
        name: 'Turing Machines & Decidability',
        subtopics: [
          { id: 'toc_10', name: 'Turing Machines (Definition, Transitions, Variations)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_11', name: 'Recursive (REC) & Recursively Enumerable (RE) Languages', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_12', name: 'Chomsky Hierarchy Classification Table', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'toc_13', name: 'Decidability, Undecidability, Halting Problem, PCP, Rice\'s Theorem', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'compiler_design',
    name: 'Compiler Design',
    shortCode: 'CD',
    category: 'core',
    avgMarks: 5,
    iconName: 'TerminalSquare',
    topics: [
      {
        id: 'lexical_analysis',
        name: 'Lexical Analysis',
        subtopics: [
          { id: 'cd_1', name: 'Tokens, Lexemes, Patterns & Regular Expressions in Lex', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_2', name: 'Lexical Errors & Transition Diagrams', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'syntax_analysis',
        name: 'Syntax Analysis & Parsing',
        subtopics: [
          { id: 'cd_3', name: 'Top-Down Parsing: LL(1) Parsing Table, First & Follow Sets', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_4', name: 'Bottom-Up Parsing: Shift-Reduce, LR(0), SLR(1) items & parsing', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_5', name: 'LALR(1) & CLR(1) Parsing Tables, Conflicts (Shift/Reduce, Reduce/Reduce)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_6', name: 'Operator Precedence Grammar & Ambiguity resolution', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'sdt_runtime_opt',
        name: 'SDT, Runtime & Code Optimization',
        subtopics: [
          { id: 'cd_7', name: 'Syntax-Directed Translation (SDT): S-attributed vs L-attributed definitions', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_8', name: 'Intermediate Code Generation: Three-Address Code, Quadruples, Triples, DAG', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_9', name: 'Runtime Environments, Activation Records, Parameter Passing', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cd_10', name: 'Code Optimization: Basic Blocks, Flow Graphs, Loop Invariants & Common Subexpressions', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'operating_systems',
    name: 'Operating Systems',
    shortCode: 'OS',
    category: 'core',
    avgMarks: 9,
    iconName: 'Layers',
    topics: [
      {
        id: 'process_threads',
        name: 'Processes, Threads & CPU Scheduling',
        subtopics: [
          { id: 'os_1', name: 'Process States, PCB, Context Switching, System Calls (fork, exec, wait)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_2', name: 'Threads (User vs Kernel Level, Multi-threading models)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_3', name: 'CPU Scheduling Algorithms: FCFS, SJF, SRTF, Round Robin, Priority, Multilevel Queue', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_4', name: 'Turnaround Time, Waiting Time, Response Time, Throughput calculation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'sync_deadlocks',
        name: 'Process Synchronization & Deadlocks',
        subtopics: [
          { id: 'os_5', name: 'Critical Section Problem, Mutual Exclusion, Progress, Bounded Waiting', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_6', name: 'Peterson\'s Solution, Test-And-Set hardware instruction', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_7', name: 'Semaphores (Counting & Binary), Mutex Locks, Synchronization Problems (Producer-Consumer, Reader-Writer, Dining Philosophers)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_8', name: 'Deadlock Conditions, Resource Allocation Graphs (RAG)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_9', name: 'Deadlock Prevention, Avoidance: Banker\'s Algorithm Safe Sequences, Detection & Recovery', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'memory_mgmt',
        name: 'Memory Management & Virtual Memory',
        subtopics: [
          { id: 'os_10', name: 'Contiguous Allocation, Fixed & Variable Partitioning, Fragmentation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_11', name: 'Paging, Page Tables, Logical to Physical Address Translation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_12', name: 'Multi-Level Paging, Page Table Size & Inverted Page Tables', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_13', name: 'Translation Lookaside Buffer (TLB) & Effective Memory Access Time (EMAT)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_14', name: 'Virtual Memory, Demand Paging, Page Fault Service Time', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_15', name: 'Page Replacement: FIFO (Belady\'s Anomaly), Optimal, LRU, Thrashing', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'file_storage',
        name: 'File Systems & Disk Scheduling',
        subtopics: [
          { id: 'os_16', name: 'File Allocation Methods (Contiguous, Linked, Indexed, Inode structure)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'os_17', name: 'Disk Scheduling Algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'databases',
    name: 'Databases (DBMS)',
    shortCode: 'DBMS',
    category: 'core',
    avgMarks: 8,
    iconName: 'Database',
    topics: [
      {
        id: 'er_relational',
        name: 'ER Model & Relational Algebra',
        subtopics: [
          { id: 'db_1', name: 'ER Diagrams, Entity sets, Relationships, Cardinality & Participation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_2', name: 'Converting ER Diagram into Relational Schema (Minimum Tables)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_3', name: 'Relational Algebra Operators: Select, Project, Join, Division, Set operations', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_4', name: 'Tuple Relational Calculus (TRC) & Domain Relational Calculus (DRC)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_5', name: 'SQL: SELECT, GROUP BY, HAVING, Aggregate functions, Correlated subqueries', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'normalization',
        name: 'Normalization & Functional Dependencies',
        subtopics: [
          { id: 'db_6', name: 'Functional Dependencies, Attribute Closure & Candidate Key discovery', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_7', name: 'Canonical Cover / Minimal Cover of FDs', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_8', name: 'Normal Forms: 1NF, 2NF, 3NF, BCNF definition & checks', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_9', name: 'Decompositions: Lossless Join & Dependency Preservation verification', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'transactions_indexing',
        name: 'Transactions, Concurrency & Indexing',
        subtopics: [
          { id: 'db_10', name: 'Transactions & ACID properties', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_11', name: 'Serializability: Conflict Serializability (Precedence Graph) & View Serializability', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_12', name: 'Recoverability: Irrecoverable, Recoverable, Avoids Cascading Aborts (ACA), Strict', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_13', name: 'Concurrency Control: Two-Phase Locking (Basic, Strict, Rigorous 2PL), Timestamp Ordering', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_14', name: 'File Organization & Indexing (Primary, Clustering, Secondary Indexes)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'db_15', name: 'B-Trees & B+ Trees: Order, Node structure, Maximum/Minimum keys, Search/Insert costs', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'computer_networks',
    name: 'Computer Networks',
    shortCode: 'CN',
    category: 'core',
    avgMarks: 9,
    iconName: 'Globe',
    topics: [
      {
        id: 'layers_datalink',
        name: 'Network Models & Data Link Layer',
        subtopics: [
          { id: 'cn_1', name: 'OSI & TCP/IP Layered Architecture, Encapsulation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_2', name: 'Framing, Error Detection: Checksum, CRC (Polynomial division), Hamming Code', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_3', name: 'Flow Control: Stop-and-Wait, Go-Back-N, Selective Repeat efficiency & window sizes', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_4', name: 'MAC Protocols: Pure ALOHA, Slotted ALOHA, CSMA/CD minimum frame size & backoff', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'network_layer',
        name: 'Network Layer & IP Addressing',
        subtopics: [
          { id: 'cn_5', name: 'IPv4 Addressing, Subnetting, Supernetting & Subnet Masks', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_6', name: 'CIDR (Classless Inter-Domain Routing) & Longest Prefix Matching', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_7', name: 'IPv4 Datagram Header, MTU & Packet Fragmentation calculations', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_8', name: 'Routing Protocols: Distance Vector (Bellman-Ford, Count-to-Infinity) & Link State (Dijkstra)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_9', name: 'ARP, RARP, ICMP, NAT & IPv6 overview', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'transport_app',
        name: 'Transport & Application Layers',
        subtopics: [
          { id: 'cn_10', name: 'TCP Header, Port Numbers, 3-Way Handshake Connection & Teardown', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_11', name: 'TCP Congestion Control: Slow Start, Congestion Avoidance, Fast Retransmit, Tahoe vs Reno', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_12', name: 'UDP Protocol & Socket Basics', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'cn_13', name: 'Application Layer Protocols: DNS (Iterative vs Recursive), DHCP, HTTP/1.1 vs HTTP/2, SMTP', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  },
  {
    id: 'general_aptitude',
    name: 'General Aptitude',
    shortCode: 'GA',
    category: 'aptitude',
    avgMarks: 15,
    iconName: 'Sparkles',
    topics: [
      {
        id: 'quant_aptitude',
        name: 'Quantitative Aptitude',
        subtopics: [
          { id: 'ga_1', name: 'Data Interpretation (Charts, Tables, Graphs)', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_2', name: 'Percentages, Profit & Loss, Ratios, Averages', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_3', name: 'Time & Work, Speed, Distance & Time, Pipes & Cisterns', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_4', name: 'Elementary Statistics, Permutation & Probability Basics', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'analytical_spatial',
        name: 'Analytical & Spatial Aptitude',
        subtopics: [
          { id: 'ga_5', name: 'Logical Deduction, Syllogisms & Venn Diagrams', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_6', name: 'Spatial Aptitude: Paper folding, Mirror reflection, Rotation', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_7', name: 'Patterns, Sequences & Analogies', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      },
      {
        id: 'verbal_aptitude',
        name: 'Verbal Aptitude',
        subtopics: [
          { id: 'ga_8', name: 'English Grammar, Tenses, Prepositions, Subject-Verb Agreement', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_9', name: 'Vocabulary, Antonyms, Synonyms, Idioms', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false },
          { id: 'ga_10', name: 'Reading Comprehension & Critical Reasoning', completed: false, round1: false, round2: false, round3: false, shortNotesReady: false }
        ]
      }
    ]
  }
];
