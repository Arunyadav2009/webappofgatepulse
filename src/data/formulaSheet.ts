import { FormulaCard } from '../types/gate';

export const HIGH_YIELD_FORMULAS: FormulaCard[] = [
  {
    id: 'f_master_theorem',
    subjectId: 'algorithms',
    topic: 'Recurrences & Complexity',
    title: 'Master\'s Theorem for Divide & Conquer',
    formula: 'T(n) = a T(n/b) + f(n), where a ≥ 1, b > 1, f(n) = Θ(n^c * log^k n)',
    description: 'Compares log_b(a) with c to determine the dominant term in recursive divide and conquer.',
    variablesExplanation: [
      'Case 1: If c < log_b(a) ⇒ T(n) = Θ(n^(log_b(a)))',
      'Case 2: If c = log_b(a) and k ≥ 0 ⇒ T(n) = Θ(n^c * log^(k+1) n)',
      'Case 2b: If c = log_b(a) and k = -1 ⇒ T(n) = Θ(n^c * log log n)',
      'Case 3: If c > log_b(a) and regularity holds ⇒ T(n) = Θ(f(n))'
    ],
    tip: 'Watch out: Does NOT apply if b is not constant (e.g. T(√n)) or if a is not constant.',
    isBookmarked: true
  },
  {
    id: 'f_cache_mapping',
    subjectId: 'coa',
    topic: 'Memory Hierarchy',
    title: 'Set-Associative Cache Address Bits Breakdown',
    formula: 'Physical Address Bits = Tag Bits + Set Index Bits + Word/Byte Offset Bits',
    description: 'Partitioning of physical address bits for a k-way set-associative cache memory system.',
    variablesExplanation: [
      'Word Offset Bits = log2(Block / Line Size in Bytes)',
      'Number of Sets = Total Cache Size / (Block Size × k)',
      'Set Index Bits = log2(Number of Sets)',
      'Tag Bits = Total Physical Address Bits - (Set Index Bits + Word Offset Bits)',
      'Tag Directory Size = Number of Lines × (Tag Bits + Valid Bit + Dirty Bit)'
    ],
    tip: 'In direct mapped cache, k = 1. In fully associative cache, Set Index Bits = 0 (only Tag + Offset).',
    isBookmarked: true
  },
  {
    id: 'f_pipeline_speedup',
    subjectId: 'coa',
    topic: 'Instruction Pipelining',
    title: 'Pipeline Speedup & Clock Period Calculation',
    formula: 'Speedup S = Non-Pipelined Time / Pipelined Time = (n × k × τ_np) / ((k + n - 1 + Stalls) × τ_p)',
    description: 'Speedup achieved by k-stage pipeline for n instructions with stage delay and latch overhead.',
    variablesExplanation: [
      'τ_p (Pipelined cycle time) = max(Stage Delays) + Latch / Buffer delay',
      'Ideal CPI = 1',
      'Actual CPI = Ideal CPI + Total Stalls per Instruction',
      'Maximum Ideal Speedup (as n → ∞) = k (number of stages)'
    ],
    tip: 'Branch penalty = (Branch penalty cycles) × (Branch frequency). Data hazards cause 1-2 bubble stalls if forwarding is absent.',
    isBookmarked: true
  },
  {
    id: 'f_os_emat',
    subjectId: 'operating_systems',
    topic: 'Virtual Memory & Paging',
    title: 'Effective Memory Access Time (EMAT) with TLB',
    formula: 'EMAT = h × (t_tlb + m) + (1 - h) × (t_tlb + (L + 1) × m)',
    description: 'Average access time with Translation Lookaside Buffer and L-level page table hierarchy.',
    variablesExplanation: [
      'h = TLB Hit Ratio (0 ≤ h ≤ 1)',
      't_tlb = TLB search time (parallel lookup)',
      'm = Main memory access time',
      'L = Number of paging levels (e.g., L = 2 for two-level paging)',
      'If page fault occurs: EMAT_total = (1 - p) × EMAT_memory + p × Page_Fault_Service_Time'
    ],
    tip: 'Notice: If TLB misses, you must access all L levels of page tables in RAM + the final target physical address.',
    isBookmarked: true
  },
  {
    id: 'f_cn_efficiency',
    subjectId: 'computer_networks',
    topic: 'Data Link Layer Flow Control',
    title: 'Stop-and-Wait & Sliding Window Protocol Efficiency',
    formula: 'η_stop_wait = 1 / (1 + 2a)  |  η_sliding = min(1, W_s / (1 + 2a))',
    description: 'Channel utilization calculation where \'a\' is the ratio of propagation delay to transmission delay.',
    variablesExplanation: [
      'a = Tp / Tt = (Distance / Propagation Speed) / (Frame Size / Bandwidth)',
      'Round Trip Time (RTT) ≈ 2 × Tp (ignoring Ack transmission time)',
      'For 100% utilization: Optimal Sender Window W_s ≥ 1 + 2a',
      'Go-Back-N: W_s = 2^k - 1, W_r = 1 (k = sequence number bits)',
      'Selective Repeat: W_s = W_r = 2^(k - 1)'
    ],
    tip: 'Sequence numbers needed for Selective Repeat is at least 2 × W_s to prevent old and new frame duplicate confusion.',
    isBookmarked: true
  },
  {
    id: 'f_csmacd_framelength',
    subjectId: 'computer_networks',
    topic: 'MAC Layer CSMA/CD',
    title: 'CSMA/CD Minimum Frame Length for Collision Detection',
    formula: 'L_min ≥ 2 × Tp × Bandwidth = 2 × (Distance / Propagation Speed) × Bandwidth',
    description: 'To detect collision while transmitting, the transmission time must be at least twice the propagation delay.',
    variablesExplanation: [
      'Tt ≥ 2 × Tp',
      'L_min / Bandwidth ≥ 2 × (Distance / v)',
      'Slot Time = 2 × Tp (maximum round-trip collision detection window)',
      'Truncated Binary Exponential Backoff: Collision after n attempts picks random slot in [0, 2^k - 1] where k = min(n, 10)'
    ],
    tip: 'If bandwidth doubles, minimum frame length must DOUBLE or max cable length must halve to maintain collision detection!',
    isBookmarked: false
  },
  {
    id: 'f_planar_graph',
    subjectId: 'discrete_math',
    topic: 'Graph Theory',
    title: 'Euler\'s Formula for Connected Planar Graphs',
    formula: 'V - E + R = 2  |  E ≤ 3V - 6 (for V ≥ 3, triangle-free: E ≤ 2V - 4)',
    description: 'Relationship between vertices (V), edges (E), and planar regions/faces (R) in connected planar graphs.',
    variablesExplanation: [
      'V = Number of vertices',
      'E = Number of edges',
      'R = Number of regions (including the unbounded outer region)',
      'Every region bounded by at least 3 edges: 2E ≥ 3R',
      'K5 is non-planar (violates E ≤ 3V - 6)',
      'K3,3 is non-planar bipartite (triangle-free, violates E ≤ 2V - 4)'
    ],
    tip: 'Kuratowski\'s Theorem: A graph is planar if and only if it does not contain a subgraph homeomorphic to K5 or K3,3.',
    isBookmarked: false
  },
  {
    id: 'f_db_bplus_tree',
    subjectId: 'databases',
    topic: 'Indexing & B+ Trees',
    title: 'B+ Tree Node Capacity & Order Equations',
    formula: 'Internal Node: p × R_ptr + (p - 1) × Key_size ≤ Block_Size  |  Leaf Node: m × (Key_size + Record_ptr) + Next_leaf_ptr ≤ Block_Size',
    description: 'Determines maximum order (p) of internal and leaf nodes given disk block size and pointer lengths.',
    variablesExplanation: [
      'p = Order / Fan-out of internal node (maximum child pointers)',
      'Internal node contains at most (p - 1) keys and p block pointers',
      'Leaf node contains search keys, actual record pointers (or rid), and one block pointer to next sibling leaf',
      'Minimum keys in internal node = ⌈p/2⌉ - 1 (except root which needs ≥ 1 key)'
    ],
    tip: 'In B+ trees, actual data records are ONLY pointed to from leaf nodes. Internal nodes act strictly as an index road-map.',
    isBookmarked: true
  },
  {
    id: 'f_db_normal_forms',
    subjectId: 'databases',
    topic: 'Normalization',
    title: 'Normal Forms Cheat Sheet (1NF → 2NF → 3NF → BCNF)',
    formula: 'For every functional dependency X → Y in relation R:',
    description: 'Strict hierarchical criteria for evaluating relational database normal forms.',
    variablesExplanation: [
      '1NF: All attribute values are atomic; no multi-valued or composite attributes.',
      '2NF: Must be in 1NF + NO partial dependencies (No proper subset of candidate key can determine a non-prime attribute).',
      '3NF: Must be in 2NF + For every X → Y, either X is a superkey OR Y is a prime attribute (member of some candidate key).',
      'BCNF: Must be in 3NF + For every non-trivial X → Y, X MUST BE A SUPERKEY (no exceptions for prime attributes!).'
    ],
    tip: 'Any relation with exactly 2 attributes is ALWAYS in BCNF. 3NF decomposition is ALWAYS lossless & dependency preserving; BCNF is always lossless but MAY not preserve dependencies.',
    isBookmarked: true
  },
  {
    id: 'f_tcp_congestion',
    subjectId: 'computer_networks',
    topic: 'Transport Layer TCP',
    title: 'TCP Congestion Window Dynamics (Tahoe vs Reno)',
    formula: 'Slow Start: cwnd doubles every RTT (exponential)  |  Congestion Avoidance: cwnd += 1 MSS every RTT (linear additive increase)',
    description: 'Window evolution upon packet drops, timeout vs 3 duplicate ACKs in TCP Tahoe and TCP Reno.',
    variablesExplanation: [
      'Timeout (Severe congestion): ssthresh = max(cwnd / 2, 2 MSS), cwnd resets to 1 MSS (both Tahoe and Reno)',
      '3 Duplicate ACKs (Mild congestion):',
      '  - TCP Tahoe: ssthresh = cwnd / 2, cwnd resets to 1 MSS, enters Slow Start',
      '  - TCP Reno (Fast Recovery): ssthresh = cwnd / 2, cwnd set to ssthresh + 3 MSS, resumes linear additive increase'
    ],
    tip: 'In Slow Start, cwnd increases by 1 MSS for EACH acknowledgment received, effectively doubling every RTT.',
    isBookmarked: false
  },
  {
    id: 'f_handshaking_lemma',
    subjectId: 'discrete_math',
    topic: 'Graph Theory',
    title: 'Handshaking Lemma & Degree Theorem',
    formula: '∑ deg(v) = 2 × |E|',
    description: 'The sum of degrees of all vertices in an undirected graph equals twice the total number of edges.',
    variablesExplanation: [
      'Corollary: In any undirected graph, the number of vertices with ODD degree is always EVEN.',
      'For a d-regular graph with n vertices: n × d = 2 × |E| ⇒ |E| = (n × d) / 2',
      'Complete graph K_n has |E| = n(n - 1) / 2 edges, each vertex degree = n - 1.'
    ],
    tip: 'Crucial for fast elimination in MSQs: A question asking if a graph with 3 vertices of degree 3 and 4 vertices of degree 4 can exist is immediately FALSE because 3 odd vertices is impossible!',
    isBookmarked: true
  },
  {
    id: 'f_discrete_bayes',
    subjectId: 'discrete_math',
    topic: 'Probability & Statistics',
    title: 'Bayes\' Theorem & Total Probability',
    formula: 'P(A_i | B) = [P(B | A_i) × P(A_i)] / ∑ [P(B | A_j) × P(A_j)]',
    description: 'Calculates posterior probability given prior probabilities and conditional likelihoods.',
    variablesExplanation: [
      'P(A_i): Prior probability of event A_i',
      'P(B | A_i): Likelihood of observing B given hypothesis A_i',
      'Denominator: Law of Total Probability P(B) = P(B|A1)P(A1) + P(B|A2)P(A2) + ...',
      'P(A_i | B): Posterior probability of A_i after observing evidence B'
    ],
    tip: 'Draw a tree diagram! Label branches with conditional probabilities; multiply along branches, add across outcomes.',
    isBookmarked: false
  }
];
