export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause?: number;
  };
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  color: string;
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'basic-calm',
    name: 'Basic Calm',
    description: 'Simple 4-4-4 breathing for everyday stress',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4
    },
    benefits: [
      'Reduces everyday stress',
      'Easy to learn and practice',
      'Can be done anywhere'
    ],
    difficulty: 'beginner',
    duration: 5,
    color: '#3b82f6'
  },
  {
    id: 'storm-calming',
    name: 'Storm Calming',
    description: 'Extended exhale for crisis moments',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 8
    },
    benefits: [
      'Activates parasympathetic nervous system',
      'Reduces anxiety and panic',
      'Helps during emotional storms'
    ],
    difficulty: 'intermediate',
    duration: 7,
    color: '#e53e3e'
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Military-grade focus and control',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4
    },
    benefits: [
      'Improves focus and concentration',
      'Builds mental resilience',
      'Regulates nervous system'
    ],
    difficulty: 'intermediate',
    duration: 10,
    color: '#059669'
  },
  {
    id: 'triangle-breathing',
    name: 'Triangle Breathing',
    description: 'Simple three-part rhythm',
    pattern: {
      inhale: 3,
      hold: 3,
      exhale: 3
    },
    benefits: [
      'Quick stress relief',
      'Easy to remember',
      'Good for beginners'
    ],
    difficulty: 'beginner',
    duration: 3,
    color: '#7c3aed'
  },
  {
    id: 'extended-exhale',
    name: 'Extended Exhale',
    description: 'Deep relaxation technique',
    pattern: {
      inhale: 4,
      hold: 2,
      exhale: 10
    },
    benefits: [
      'Deep relaxation',
      'Reduces heart rate',
      'Promotes sleep'
    ],
    difficulty: 'advanced',
    duration: 8,
    color: '#dc2626'
  }
];