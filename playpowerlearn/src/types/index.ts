// PlayPowerLearn Type Definitions

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  schoolName: string | null;
  gradesTaught: string[];
  subjects: string[];
  bio: string | null;
}

export interface StudentProfile {
  id: string;
  userId: string;
  grade: string;
  avatarId: string | null;
  totalXP: number;
  currentLevel: number;
  streakDays: number;
  lastActiveAt: Date;
}

export interface ParentProfile {
  id: string;
  userId: string;
  children: StudentProfile[];
}

// ============================================
// STANDARDS & CURRICULUM
// ============================================

export type Subject = 'MATH' | 'LITERACY' | 'SCIENCE' | 'SOCIAL_STUDIES';

export interface Standard {
  id: string;
  code: string;
  domain: string;
  cluster: string;
  description: string;
  grade: string;
  subject: Subject;
  parentId: string | null;
  children?: Standard[];
}

export interface GradeLevel {
  code: string;
  name: string;
  description: string;
}

export const GRADE_LEVELS: GradeLevel[] = [
  { code: 'K', name: 'Kindergarten', description: 'Ages 5-6' },
  { code: '1', name: '1st Grade', description: 'Ages 6-7' },
  { code: '2', name: '2nd Grade', description: 'Ages 7-8' },
  { code: '3', name: '3rd Grade', description: 'Ages 8-9' },
  { code: '4', name: '4th Grade', description: 'Ages 9-10' },
  { code: '5', name: '5th Grade', description: 'Ages 10-11' },
  { code: '6', name: '6th Grade', description: 'Ages 11-12' },
  { code: '7', name: '7th Grade', description: 'Ages 12-13' },
  { code: '8', name: '8th Grade', description: 'Ages 13-14' },
];

// ============================================
// ACTIVITIES & CONTENT
// ============================================

export type ActivityType =
  | 'MCQ_PRACTICE'
  | 'GAME'
  | 'VIDEO'
  | 'READING'
  | 'WORKSHEET'
  | 'INTERACTIVE'
  | 'ASSESSMENT';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE';

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  subject: Subject;
  grade: string;
  difficulty: Difficulty;
  estimatedTime: number;
  xpReward: number;
  isAIGenerated: boolean;
  content: ActivityContent;
  thumbnail: string | null;
  isPublished: boolean;
  standards: Standard[];
  questions?: Question[];
}

export interface ActivityContent {
  instructions?: string;
  gameUrl?: string;
  videoUrl?: string;
  readingText?: string;
  interactiveConfig?: Record<string, unknown>;
}

// ============================================
// QUESTIONS (MCQ)
// ============================================

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'FILL_BLANK'
  | 'MATCHING'
  | 'ORDERING';

export interface Question {
  id: string;
  activityId: string;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  explanation: string | null;
  hint: string | null;
  difficulty: Difficulty;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
}

// ============================================
// PROGRESSIONS
// ============================================

export interface Progression {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: string;
  thumbnail: string | null;
  isPublished: boolean;
  items: ProgressionItem[];
}

export interface ProgressionItem {
  id: string;
  progressionId: string;
  activityId: string;
  activity: Activity;
  order: number;
  isRequired: boolean;
  unlockAfter: number | null;
}

// ============================================
// GAMIFICATION
// ============================================

export type BadgeCategory =
  | 'ACHIEVEMENT'
  | 'STREAK'
  | 'MASTERY'
  | 'EXPLORATION'
  | 'SOCIAL'
  | 'SPECIAL';

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: BadgeCategory;
  requirement: BadgeRequirement;
  xpBonus: number;
  isSecret: boolean;
}

export interface BadgeRequirement {
  type: 'activities_completed' | 'streak_days' | 'skill_mastered' | 'xp_earned' | 'custom';
  value: number;
  subject?: Subject;
  grade?: string;
}

export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: Date;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  subject: Subject;
  grade: string;
  imageUrl: string | null;
  skills: Skill[];
}

export interface Skill {
  id: string;
  treeId: string;
  standardId: string | null;
  standard?: Standard;
  name: string;
  description: string;
  iconUrl: string | null;
  maxLevel: number;
  xpPerLevel: number;
  positionX: number;
  positionY: number;
  prerequisites: string[];
}

export interface SkillProgress {
  id: string;
  studentId: string;
  skillId: string;
  skill: Skill;
  currentLevel: number;
  currentXP: number;
  unlockedAt: Date | null;
  masteredAt: Date | null;
}

// ============================================
// STUDENT PROGRESS
// ============================================

export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface ActivityAttempt {
  id: string;
  studentId: string;
  activityId: string;
  activity: Activity;
  startedAt: Date;
  completedAt: Date | null;
  score: number | null;
  xpEarned: number;
  timeSpent: number | null;
  status: AttemptStatus;
  responses: QuestionResponse[];
}

export interface QuestionResponse {
  id: string;
  attemptId: string;
  questionId: string;
  question: Question;
  response: unknown;
  isCorrect: boolean;
  timeTaken: number | null;
  hintsUsed: number;
  answeredAt: Date;
}

// ============================================
// CLASSROOM & ASSIGNMENTS
// ============================================

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  joinCode: string;
  teacherId: string;
  isActive: boolean;
  studentCount?: number;
}

export interface Assignment {
  id: string;
  teacherId: string;
  classroomId: string;
  classroom: Classroom;
  activityId: string | null;
  activity: Activity | null;
  progressionId: string | null;
  progression: Progression | null;
  title: string;
  instructions: string | null;
  dueDate: Date | null;
  isActive: boolean;
}

// ============================================
// XP & LEVELING
// ============================================

export const XP_PER_LEVEL = 1000;
export const STREAK_BONUS_XP = 50;

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL;
}

export function getXPProgress(totalXP: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(totalXP);
  const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL;
  const current = totalXP - xpForCurrentLevel;
  const required = XP_PER_LEVEL;
  const percentage = (current / required) * 100;
  return { current, required, percentage };
}
