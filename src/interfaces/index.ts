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

// ==========================================================================
// INTERFACES PARA FIREBASE Y PERSISTENCIA DE DATOS
// ==========================================================================

export interface Player {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: PlayerPreferences;
  progress: PlayerProgress;
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  preferredDifficulty: number;
  theme: string;
  parentalPin?: string;
}

export interface GameSession {
  id: string;
  playerId: string;
  levelId: number;
  startTime: Date;
  endTime?: Date;
  problemsSolved: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  coinsEarned: number;
  timeSpent: number; // en segundos
  averageResponseTime: number; // en segundos
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "accuracy" | "speed" | "persistence" | "milestone";
  requirement: {
    type: "streak" | "total_correct" | "time_played" | "level_completed";
    value: number;
  };
  reward: {
    coins: number;
    badge?: string;
  };
}

export interface PlayerAchievement {
  playerId: string;
  achievementId: string;
  unlockedAt: Date;
  claimed: boolean;
}

export interface PaymentRequest {
  id: string;
  playerId: string;
  amount: number; // en monedas del juego
  realAmount: number; // en dinero real
  description: string;
  status: "pending" | "approved" | "rejected" | "paid";
  requestedAt: Date;
  processedAt?: Date;
  parentNotes?: string;
}

export interface DatabaseCollections {
  players: Player;
  sessions: GameSession;
  achievements: Achievement;
  playerAchievements: PlayerAchievement;
  paymentRequests: PaymentRequest;
}
