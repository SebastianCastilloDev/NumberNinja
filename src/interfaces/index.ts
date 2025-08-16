// ==========================================================================
// INTERFACES Y TYPES PARA NUMBERNINJA
// Definiciones de tipos para todo el proyecto
// ==========================================================================

export interface Problem {
  num1: number;
  num2: number;
  correctAnswer: number;
}

export interface Level {
  id: number;
  name: string;
  emoji: string;
  description: string;
  minRange: number;
  maxRange: number;
  pointsPerCorrect: number;
  requiredScore: number;
  color: string;
}

export interface GameConfig {
  levels: Level[];
  game: GameSettings;
  ui: UISettings;
  rewards: RewardSettings;
  progress: ProgressSettings;
}

export interface GameSettings {
  correctAnswerDelay: number;
  incorrectAnswerDelay: number;
  levelUpDelay: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface UISettings {
  primaryFont: string;
  secondaryFont: string;
  background: string;
  titleSizes: ResponsiveSizes;
  problemSizes: ResponsiveSizes;
}

export interface ResponsiveSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface RewardSettings {
  coinName: string;
  coinEmoji: string;
  streakMultiplier: number;
  perfectionBonus: number;
  minimumWithdrawal: number;
  conversionRate: number;
}

export interface ProgressSettings {
  autoLevelUp: boolean;
  saveProgressLocally: boolean;
  showDetailedStats: boolean;
}

export interface GameState {
  currentProblem: Problem;
  userAnswer: string;
  score: number;
  streak: number;
  feedback: string;
  isCorrect: boolean | null;
  gameStarted: boolean;
  currentLevel: Level;
  showLevelSelector: boolean;
  coins: number;
}

export interface PlayerProgress {
  totalProblems: number;
  correctAnswers: number;
  wrongAnswers: number;
  bestStreak: number;
  totalCoins: number;
  totalWithdrawn: number;
  timeSpent: number; // en minutos
  lastPlayed: Date;
}

export type FeedbackType = "success" | "error" | "levelUp" | "streak" | "normal";

export type GameMode = "practice" | "challenge" | "timed" | "endless";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type PresetConfig = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "CHALLENGE";
