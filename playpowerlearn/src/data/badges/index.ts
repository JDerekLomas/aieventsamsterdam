// PlayPowerLearn Badge System
// Indian-themed gamification badges

import type { Badge, BadgeCategory } from '@/types';

export const BADGES: Badge[] = [
  // Achievement Badges
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first activity',
    imageUrl: '/images/badges/first-steps.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'activities_completed', value: 1 },
    xpBonus: 50,
    isSecret: false,
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Complete 10 activities',
    imageUrl: '/images/badges/rising-star.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'activities_completed', value: 10 },
    xpBonus: 100,
    isSecret: false,
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 50 activities',
    imageUrl: '/images/badges/knowledge-seeker.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'activities_completed', value: 50 },
    xpBonus: 250,
    isSecret: false,
  },
  {
    id: 'vidya-champion',
    name: 'Vidya Champion',
    description: 'Complete 100 activities',
    imageUrl: '/images/badges/vidya-champion.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'activities_completed', value: 100 },
    xpBonus: 500,
    isSecret: false,
  },
  {
    id: 'guru-level',
    name: 'Guru Level',
    description: 'Complete 500 activities',
    imageUrl: '/images/badges/guru-level.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'activities_completed', value: 500 },
    xpBonus: 1000,
    isSecret: false,
  },

  // Streak Badges
  {
    id: 'consistent-learner',
    name: 'Consistent Learner',
    description: 'Maintain a 3-day practice streak',
    imageUrl: '/images/badges/consistent-learner.svg',
    category: 'STREAK',
    requirement: { type: 'streak_days', value: 3 },
    xpBonus: 75,
    isSecret: false,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    imageUrl: '/images/badges/week-warrior.svg',
    category: 'STREAK',
    requirement: { type: 'streak_days', value: 7 },
    xpBonus: 150,
    isSecret: false,
  },
  {
    id: 'dedication-master',
    name: 'Dedication Master',
    description: 'Maintain a 30-day practice streak',
    imageUrl: '/images/badges/dedication-master.svg',
    category: 'STREAK',
    requirement: { type: 'streak_days', value: 30 },
    xpBonus: 500,
    isSecret: false,
  },
  {
    id: 'tapasya-achiever',
    name: 'Tapasya Achiever',
    description: 'Maintain a 100-day practice streak',
    imageUrl: '/images/badges/tapasya-achiever.svg',
    category: 'STREAK',
    requirement: { type: 'streak_days', value: 100 },
    xpBonus: 1500,
    isSecret: false,
  },

  // Mastery Badges - Math
  {
    id: 'math-explorer',
    name: 'Math Explorer',
    description: 'Master 1 math skill',
    imageUrl: '/images/badges/math-explorer.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 1, subject: 'MATH' },
    xpBonus: 100,
    isSecret: false,
  },
  {
    id: 'math-wizard',
    name: 'Math Wizard',
    description: 'Master 5 math skills',
    imageUrl: '/images/badges/math-wizard.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 5, subject: 'MATH' },
    xpBonus: 300,
    isSecret: false,
  },
  {
    id: 'aryabhata-heir',
    name: 'Aryabhata\'s Heir',
    description: 'Master all math skills for your grade',
    imageUrl: '/images/badges/aryabhata-heir.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 20, subject: 'MATH' },
    xpBonus: 1000,
    isSecret: false,
  },

  // Mastery Badges - Literacy
  {
    id: 'word-collector',
    name: 'Word Collector',
    description: 'Master 1 literacy skill',
    imageUrl: '/images/badges/word-collector.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 1, subject: 'LITERACY' },
    xpBonus: 100,
    isSecret: false,
  },
  {
    id: 'story-weaver',
    name: 'Story Weaver',
    description: 'Master 5 literacy skills',
    imageUrl: '/images/badges/story-weaver.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 5, subject: 'LITERACY' },
    xpBonus: 300,
    isSecret: false,
  },
  {
    id: 'kalidasa-champion',
    name: 'Kalidasa Champion',
    description: 'Master all literacy skills for your grade',
    imageUrl: '/images/badges/kalidasa-champion.svg',
    category: 'MASTERY',
    requirement: { type: 'skill_mastered', value: 20, subject: 'LITERACY' },
    xpBonus: 1000,
    isSecret: false,
  },

  // XP Milestone Badges
  {
    id: 'xp-gatherer',
    name: 'XP Gatherer',
    description: 'Earn 1,000 XP',
    imageUrl: '/images/badges/xp-gatherer.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'xp_earned', value: 1000 },
    xpBonus: 100,
    isSecret: false,
  },
  {
    id: 'xp-collector',
    name: 'XP Collector',
    description: 'Earn 5,000 XP',
    imageUrl: '/images/badges/xp-collector.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'xp_earned', value: 5000 },
    xpBonus: 250,
    isSecret: false,
  },
  {
    id: 'xp-master',
    name: 'XP Master',
    description: 'Earn 10,000 XP',
    imageUrl: '/images/badges/xp-master.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'xp_earned', value: 10000 },
    xpBonus: 500,
    isSecret: false,
  },
  {
    id: 'diamond-achiever',
    name: 'Diamond Achiever',
    description: 'Earn 50,000 XP',
    imageUrl: '/images/badges/diamond-achiever.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'xp_earned', value: 50000 },
    xpBonus: 2000,
    isSecret: false,
  },

  // Special/Secret Badges
  {
    id: 'diwali-sparkle',
    name: 'Diwali Sparkle',
    description: 'Practice during Diwali week',
    imageUrl: '/images/badges/diwali-sparkle.svg',
    category: 'SPECIAL',
    requirement: { type: 'custom', value: 1 },
    xpBonus: 200,
    isSecret: true,
  },
  {
    id: 'holi-colors',
    name: 'Holi Colors',
    description: 'Complete activities in all subjects during Holi',
    imageUrl: '/images/badges/holi-colors.svg',
    category: 'SPECIAL',
    requirement: { type: 'custom', value: 1 },
    xpBonus: 200,
    isSecret: true,
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Get 100% on 5 activities in a row',
    imageUrl: '/images/badges/perfect-score.svg',
    category: 'ACHIEVEMENT',
    requirement: { type: 'custom', value: 5 },
    xpBonus: 300,
    isSecret: true,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Practice after 9 PM',
    imageUrl: '/images/badges/night-owl.svg',
    category: 'SPECIAL',
    requirement: { type: 'custom', value: 1 },
    xpBonus: 50,
    isSecret: true,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Practice before 7 AM',
    imageUrl: '/images/badges/early-bird.svg',
    category: 'SPECIAL',
    requirement: { type: 'custom', value: 1 },
    xpBonus: 50,
    isSecret: true,
  },
];

// Badge category metadata
export const BADGE_CATEGORIES: Record<BadgeCategory, { name: string; description: string; icon: string }> = {
  ACHIEVEMENT: {
    name: 'Achievement',
    description: 'Badges earned by completing activities',
    icon: '🏆',
  },
  STREAK: {
    name: 'Streak',
    description: 'Badges for consistent daily practice',
    icon: '🔥',
  },
  MASTERY: {
    name: 'Mastery',
    description: 'Badges for mastering skills and standards',
    icon: '⭐',
  },
  EXPLORATION: {
    name: 'Exploration',
    description: 'Badges for trying different activities',
    icon: '🧭',
  },
  SOCIAL: {
    name: 'Social',
    description: 'Badges for helping and collaborating',
    icon: '🤝',
  },
  SPECIAL: {
    name: 'Special',
    description: 'Limited-time and secret badges',
    icon: '✨',
  },
};

// Level thresholds with Indian-themed names
export const LEVELS = [
  { level: 1, name: 'Shishya (Student)', xpRequired: 0, icon: '🌱' },
  { level: 2, name: 'Vidyarthi (Learner)', xpRequired: 1000, icon: '🌿' },
  { level: 3, name: 'Adhyeta (Scholar)', xpRequired: 2500, icon: '🌳' },
  { level: 4, name: 'Pandit (Wise One)', xpRequired: 5000, icon: '📚' },
  { level: 5, name: 'Acharya (Teacher)', xpRequired: 10000, icon: '🎓' },
  { level: 6, name: 'Mahavidwan (Great Scholar)', xpRequired: 20000, icon: '👑' },
  { level: 7, name: 'Rishi (Sage)', xpRequired: 35000, icon: '🔮' },
  { level: 8, name: 'Maharishi (Great Sage)', xpRequired: 50000, icon: '⭐' },
  { level: 9, name: 'Brahmarishi (Divine Sage)', xpRequired: 75000, icon: '🌟' },
  { level: 10, name: 'Param Guru (Supreme Master)', xpRequired: 100000, icon: '💫' },
];

export function getLevelForXP(xp: number): typeof LEVELS[0] {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPToNextLevel(xp: number): { current: number; required: number; percentage: number } {
  const currentLevel = getLevelForXP(xp);
  const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: xp, required: xp, percentage: 100 };
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpRequiredForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const percentage = (xpInCurrentLevel / xpRequiredForNext) * 100;

  return { current: xpInCurrentLevel, required: xpRequiredForNext, percentage };
}
