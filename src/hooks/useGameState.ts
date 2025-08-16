// ==========================================================================
// HOOK PERSONALIZADO PARA EL ESTADO DEL JUEGO
// Maneja toda la lógica del estado y efectos del juego
// ==========================================================================

import { useState, useEffect, useCallback } from "react";
import { GameState, Level, Problem, GameConfig } from "@/interfaces";
import { generateProblem, calculatePoints, convertPointsToCoins, getNextLevel, validateAnswer, generateSuccessFeedback, generateErrorFeedback, generateLevelUpFeedback } from "@/utils/gameUtils";

interface UseGameStateProps {
  config: GameConfig;
  initialLevel?: Level;
}

interface UseGameStateReturn extends GameState {
  // Actions
  startGame: () => void;
  resetGame: () => void;
  submitAnswer: () => void;
  changeLevel: (level: Level) => void;
  toggleLevelSelector: () => void;
  setUserAnswer: (answer: string) => void;

  // Computed values
  availableLevels: Level[];
  nextLevel: Level | null;
  canSubmit: boolean;
}

export const useGameState = ({ config, initialLevel }: UseGameStateProps): UseGameStateReturn => {
  // ==========================================================================
  // ESTADO PRINCIPAL
  // ==========================================================================

  const [gameState, setGameState] = useState<GameState>({
    currentProblem: { num1: 0, num2: 0, correctAnswer: 0 },
    userAnswer: "",
    score: 0,
    streak: 0,
    feedback: "",
    isCorrect: null,
    gameStarted: false,
    currentLevel: initialLevel || config.levels[0],
    showLevelSelector: false,
    coins: 0,
  });

  // ==========================================================================
  // EFECTOS
  // ==========================================================================

  // Generar nuevo problema cuando cambia el nivel
  useEffect(() => {
    if (gameState.gameStarted) {
      const newProblem = generateProblem(gameState.currentLevel);
      setGameState((prev) => ({
        ...prev,
        currentProblem: newProblem,
        userAnswer: "",
        feedback: "",
        isCorrect: null,
      }));
    }
  }, [gameState.currentLevel, gameState.gameStarted]);

  // Inicializar primer problema al empezar el juego
  useEffect(() => {
    if (gameState.gameStarted && gameState.currentProblem.correctAnswer === 0) {
      const newProblem = generateProblem(gameState.currentLevel);
      setGameState((prev) => ({
        ...prev,
        currentProblem: newProblem,
      }));
    }
  }, [gameState.gameStarted]);

  // ==========================================================================
  // FUNCIONES DE JUEGO
  // ==========================================================================

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStarted: true,
      currentProblem: generateProblem(prev.currentLevel),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStarted: false,
      score: 0,
      streak: 0,
      coins: 0,
      userAnswer: "",
      feedback: "",
      isCorrect: null,
      showLevelSelector: false,
      currentLevel: config.levels[0],
    }));
  }, [config.levels]);

  const checkLevelUp = useCallback(
    (newScore: number): boolean => {
      const nextLevel = getNextLevel(gameState.currentLevel, newScore, config.levels);
      if (nextLevel) {
        setGameState((prev) => ({
          ...prev,
          currentLevel: nextLevel,
          feedback: generateLevelUpFeedback(nextLevel),
          isCorrect: true,
        }));

        // Generar nuevo problema después del delay de level up
        setTimeout(() => {
          const newProblem = generateProblem(nextLevel);
          setGameState((prev) => ({
            ...prev,
            currentProblem: newProblem,
            userAnswer: "",
            feedback: "",
            isCorrect: null,
          }));
        }, config.game.levelUpDelay);

        return true;
      }
      return false;
    },
    [gameState.currentLevel, config.levels, config.game.levelUpDelay]
  );

  const submitAnswer = useCallback(() => {
    if (!gameState.userAnswer.trim()) return;

    const isCorrect = validateAnswer(gameState.userAnswer, gameState.currentProblem.correctAnswer);

    setGameState((prev) => ({ ...prev, isCorrect }));

    if (isCorrect) {
      // Calcular puntos con bonificaciones
      const basePoints = gameState.currentLevel.pointsPerCorrect;
      const finalPoints = calculatePoints(basePoints, gameState.streak, config);
      const newScore = gameState.score + finalPoints;
      const newStreak = gameState.streak + 1;
      const newCoins = convertPointsToCoins(newScore, config.rewards.conversionRate);

      // Actualizar estado
      setGameState((prev) => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        coins: newCoins,
      }));

      // Verificar si sube de nivel
      const leveledUp = checkLevelUp(newScore);

      if (!leveledUp) {
        const hasBonus = finalPoints > basePoints;
        const feedback = generateSuccessFeedback(finalPoints, hasBonus);

        setGameState((prev) => ({ ...prev, feedback }));

        // Generar nuevo problema después del delay
        setTimeout(() => {
          const newProblem = generateProblem(gameState.currentLevel);
          setGameState((prev) => ({
            ...prev,
            currentProblem: newProblem,
            userAnswer: "",
            feedback: "",
            isCorrect: null,
          }));
        }, config.game.correctAnswerDelay);
      }
    } else {
      // Respuesta incorrecta
      const feedback = generateErrorFeedback(gameState.currentProblem.correctAnswer);

      setGameState((prev) => ({
        ...prev,
        streak: 0,
        feedback,
      }));

      // Limpiar feedback después del delay
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          feedback: "",
          isCorrect: null,
        }));
      }, config.game.incorrectAnswerDelay);
    }
  }, [gameState.userAnswer, gameState.currentProblem.correctAnswer, gameState.currentLevel, gameState.score, gameState.streak, config, checkLevelUp]);

  const changeLevel = useCallback((level: Level) => {
    setGameState((prev) => ({
      ...prev,
      currentLevel: level,
      showLevelSelector: false,
      userAnswer: "",
      feedback: "",
      isCorrect: null,
    }));
  }, []);

  const toggleLevelSelector = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      showLevelSelector: !prev.showLevelSelector,
    }));
  }, []);

  const setUserAnswer = useCallback((answer: string) => {
    setGameState((prev) => ({ ...prev, userAnswer: answer }));
  }, []);

  // ==========================================================================
  // VALORES COMPUTADOS
  // ==========================================================================

  const availableLevels = config.levels.filter((level) => gameState.score >= level.requiredScore);
  const nextLevel = getNextLevel(gameState.currentLevel, gameState.score, config.levels);
  const canSubmit = gameState.userAnswer.trim() !== "" && gameState.isCorrect === null;

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {
    // Estado
    ...gameState,

    // Acciones
    startGame,
    resetGame,
    submitAnswer,
    changeLevel,
    toggleLevelSelector,
    setUserAnswer,

    // Valores computados
    availableLevels,
    nextLevel,
    canSubmit,
  };
};
