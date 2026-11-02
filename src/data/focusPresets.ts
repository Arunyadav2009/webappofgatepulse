import { FocusStrategyPreset } from '../types/gate';

export const FOCUS_STRATEGY_PRESETS: FocusStrategyPreset[] = [
  {
    id: 'high_yield_core',
    name: 'High-Yield Core (~53 Marks)',
    badge: 'Most Popular',
    description: 'Focus on topics with predictable patterns, highest marks-to-study-time ratio, and minimal trap risk.',
    targetMarks: 53,
    subjectIds: ['general_aptitude', 'discrete_math', 'operating_systems', 'databases', 'theory_of_computation']
  },
  {
    id: 'coding_systems',
    name: 'Coding & Systems (~53 Marks)',
    badge: 'Code Focused',
    description: 'Perfect for coders. Leverages strong programming intuitions, algorithm design, memory hierarchy, and OS.',
    targetMarks: 53,
    subjectIds: ['general_aptitude', 'programming_ds', 'algorithms', 'coa', 'operating_systems']
  },
  {
    id: 'top_rank_sprint',
    name: 'Target 65+ Sprint (~73 Marks)',
    badge: 'AIR < 300',
    description: 'Strategic 7-subject package designed to secure high rank admission in Top IITs while skipping low-yield topics.',
    targetMarks: 73,
    subjectIds: ['general_aptitude', 'discrete_math', 'programming_ds', 'algorithms', 'operating_systems', 'databases', 'theory_of_computation']
  },
  {
    id: 'qualifying_fast',
    name: 'Fast Qualifying Pack (~37 Marks)',
    badge: 'Cutoff Guarantee',
    description: 'Targeted minimum subset to comfortably cross the GATE qualification cutoff and secure PSU/stipend eligibility.',
    targetMarks: 37,
    subjectIds: ['general_aptitude', 'discrete_math', 'operating_systems']
  }
];
