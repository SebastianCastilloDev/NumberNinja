// ==========================================================================
// UTILIDADES PARA NUMBERNINJA
// Funciones puras para lógica del juego
// ==========================================================================

import { Level, Problem, GameConfig } from "@/interfaces";

// ==========================================================================
// GENERACIÓN DE PROBLEMAS
// ==========================================================================

export const generateProblem = (level: Level): Problem => {
  const { minRange, maxRange } = level;
  const num1 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
  const num2 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
  const correctAnswer = num1 + num2;

  return { num1, num2, correctAnswer };
};

// ==========================================================================
// CÁLCULOS DE PUNTOS Y RECOMPENSAS
// ==========================================================================

export const calculatePoints = (basePoints: number, streak: number, config: GameConfig): number => {
  let finalPoints = basePoints;

  // Aplicar multiplicador de racha cada 5 aciertos consecutivos
  if (streak > 0 && streak % 5 === 0) {
    finalPoints = Math.floor(finalPoints * config.rewards.streakMultiplier);
  }

  return finalPoints;
};

export const convertPointsToCoins = (points: number, conversionRate: number): number => {
  return Math.floor(points * conversionRate);
};

export const canWithdraw = (coinBalance: number, minimumWithdrawal: number): boolean => {
  return coinBalance >= minimumWithdrawal;
};

// ==========================================================================
// GESTIÓN DE NIVELES
// ==========================================================================

export const getLevelConfig = (levelId: number, levels: Level[]): Level | undefined => {
  return levels.find((level) => level.id === levelId);
};

export const getAvailableLevels = (currentScore: number, levels: Level[]): Level[] => {
  return levels.filter((level) => currentScore >= level.requiredScore);
};

export const getNextLevel = (currentLevel: Level, currentScore: number, levels: Level[]): Level | null => {
  return levels.find((level) => level.requiredScore > currentLevel.requiredScore && currentScore >= level.requiredScore) || null;
};

export const calculateLevelProgress = (currentLevel: Level, score: number, levels: Level[]): number => {
  const nextLevel = levels.find((level) => level.requiredScore > currentLevel.requiredScore);
  if (!nextLevel) return 100; // Ya está en el nivel máximo

  const currentRequirement = currentLevel.requiredScore;
  const nextRequirement = nextLevel.requiredScore;
  const progress = ((score - currentRequirement) / (nextRequirement - currentRequirement)) * 100;

  return Math.min(100, Math.max(0, progress));
};

// ==========================================================================
// VALIDACIONES
// ==========================================================================

export const validateAnswer = (userInput: string, correctAnswer: number): boolean => {
  const answer = parseInt(userInput.trim());
  return !isNaN(answer) && answer === correctAnswer;
};

export const isValidLevel = (level: Level): boolean => {
  return level.id > 0 && level.minRange >= 0 && level.maxRange > level.minRange && level.pointsPerCorrect > 0 && level.requiredScore >= 0 && level.name.trim().length > 0;
};

// ==========================================================================
// FORMATEO DE DATOS
// ==========================================================================

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}m`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("es-ES").format(num);
};

export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

// ==========================================================================
// GENERADORES DE FEEDBACK
// ==========================================================================

export const generateSuccessFeedback = (points: number, hasBonus: boolean): string => {
  const messages = hasBonus
    ? [`¡Increíble! +${points} puntos (¡Bonus de racha!) 🎉`, `¡Excelente racha! +${points} puntos 🔥`, `¡Imparable! +${points} puntos ⚡`]
    : [`¡Excelente! +${points} puntos 🎉`, `¡Muy bien! +${points} puntos ⭐`, `¡Correcto! +${points} puntos 👏`];

  return messages[Math.floor(Math.random() * messages.length)];
};

export const generateErrorFeedback = (correctAnswer: number): string => {
  const messages = [`¡Ups! La respuesta correcta es ${correctAnswer} 🤔`, `¡Casi! Era ${correctAnswer} 💭`, `¡Inténtalo de nuevo! La respuesta es ${correctAnswer} 🔄`];

  return messages[Math.floor(Math.random() * messages.length)];
};

export const generateLevelUpFeedback = (newLevel: Level): string => {
  return `🎉 ¡SUBISTE DE NIVEL! Ahora eres ${newLevel.emoji} ${newLevel.name}!`;
};

// ==========================================================================
// UTILITARIOS VARIOS
// ==========================================================================

export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
