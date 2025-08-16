// ==========================================================================
// EJEMPLOS DE USO DE LA CONFIGURACIÓN DE NUMBERNINJA
// Guía para personalizar el juego según diferentes necesidades
// ==========================================================================

import { GAME_CONFIG, PRESET_CONFIGS, applyPresetConfig } from './gameConfig';

// ==========================================================================
// EJEMPLO 1: PERSONALIZACIÓN PARA DIFERENTES EDADES
// ==========================================================================

// Para niños de 6 años (muy principiantes)
export const CONFIG_6_YEARS = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map(level => ({
    ...level,
    maxRange: Math.min(level.maxRange, 15), // Máximo números hasta 15
    pointsPerCorrect: level.pointsPerCorrect * 3, // Triple de recompensas
    requiredScore: Math.floor(level.requiredScore * 0.5), // Menos puntos para subir
  })),
  game: {
    ...GAME_CONFIG.game,
    correctAnswerDelay: 2500, // Más tiempo para celebrar
    incorrectAnswerDelay: 1500, // Menos tiempo en errores
  },
  rewards: {
    ...GAME_CONFIG.rewards,
    conversionRate: 0.2, // Más monedas por punto
  }
};

// Para niños de 10+ años (más desafiante)
export const CONFIG_10_YEARS = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map(level => ({
    ...level,
    maxRange: level.maxRange * 1.5, // Números más grandes
    requiredScore: level.requiredScore * 1.2, // Más puntos requeridos
  })),
  game: {
    ...GAME_CONFIG.game,
    correctAnswerDelay: 1000, // Más rápido
    incorrectAnswerDelay: 1500,
  }
};

// ==========================================================================
// EJEMPLO 2: CONFIGURACIONES ESPECIALES
// ==========================================================================

// Modo "Solo sumas fáciles" (para práctica intensiva)
export const CONFIG_EASY_MODE = {
  ...GAME_CONFIG,
  levels: [
    {
      id: 1,
      name: "Sumas Fáciles",
      emoji: "🌟",
      description: "Solo sumas del 1 al 20",
      minRange: 1,
      maxRange: 20,
      pointsPerCorrect: 10,
      requiredScore: 0,
      color: "from-green-400 to-blue-400"
    }
  ]
};

// Modo "Desafío extremo" (para niños muy avanzados)
export const CONFIG_EXTREME_MODE = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map(level => ({
    ...level,
    minRange: level.minRange * 2,
    maxRange: level.maxRange * 3,
    pointsPerCorrect: level.pointsPerCorrect * 2,
    requiredScore: level.requiredScore * 1.5,
  })),
  rewards: {
    ...GAME_CONFIG.rewards,
    streakMultiplier: 2.0, // Doble bonus por racha
    perfectionBonus: 200,
  }
};

// ==========================================================================
// EJEMPLO 3: CONFIGURACIONES POR MATERIA
// ==========================================================================

// Solo sumas básicas (1-10)
export const CONFIG_BASIC_ADDITION = {
  ...GAME_CONFIG,
  levels: [
    {
      id: 1,
      name: "Sumas Básicas",
      emoji: "➕",
      description: "Suma números del 1 al 10",
      minRange: 1,
      maxRange: 10,
      pointsPerCorrect: 5,
      requiredScore: 0,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      name: "Sumas Avanzadas",
      emoji: "⭐",
      description: "Suma números del 1 al 20",
      minRange: 1,
      maxRange: 20,
      pointsPerCorrect: 10,
      requiredScore: 100,
      color: "from-purple-400 to-purple-600"
    }
  ]
};

// ==========================================================================
// EJEMPLO 4: CONFIGURACIONES DE TEMPORIZACIÓN
// ==========================================================================

// Modo rápido (para niños impacientes)
export const CONFIG_FAST_MODE = {
  ...GAME_CONFIG,
  game: {
    ...GAME_CONFIG.game,
    correctAnswerDelay: 800,
    incorrectAnswerDelay: 1200,
    levelUpDelay: 2000,
  }
};

// Modo lento (para niños que necesitan más tiempo)
export const CONFIG_SLOW_MODE = {
  ...GAME_CONFIG,
  game: {
    ...GAME_CONFIG.game,
    correctAnswerDelay: 3000,
    incorrectAnswerDelay: 2500,
    levelUpDelay: 4000,
  }
};

// ==========================================================================
// EJEMPLO 5: CONFIGURACIONES DE RECOMPENSAS
// ==========================================================================

// Modo "Generoso" (muchas recompensas)
export const CONFIG_GENEROUS_REWARDS = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map(level => ({
    ...level,
    pointsPerCorrect: level.pointsPerCorrect * 2,
  })),
  rewards: {
    ...GAME_CONFIG.rewards,
    conversionRate: 0.5, // 1 punto = 0.5 monedas (en lugar de 0.1)
    minimumWithdrawal: 20, // Menos monedas requeridas para retirar
    streakMultiplier: 2.0,
  }
};

// Modo "Estricto" (menos recompensas, más desafío)
export const CONFIG_STRICT_REWARDS = {
  ...GAME_CONFIG,
  levels: GAME_CONFIG.levels.map(level => ({
    ...level,
    pointsPerCorrect: Math.max(1, Math.floor(level.pointsPerCorrect * 0.7)),
    requiredScore: level.requiredScore * 1.5,
  })),
  rewards: {
    ...GAME_CONFIG.rewards,
    conversionRate: 0.05, // Menos monedas por punto
    minimumWithdrawal: 100,
  }
};

// ==========================================================================
// FUNCIÓN PARA APLICAR CONFIGURACIONES DINÁMICAMENTE
// ==========================================================================

export const getConfigByAge = (age: number) => {
  if (age <= 6) return CONFIG_6_YEARS;
  if (age <= 8) return applyPresetConfig('BEGINNER');
  if (age <= 10) return applyPresetConfig('INTERMEDIATE');
  return applyPresetConfig('ADVANCED');
};

export const getConfigBySkillLevel = (skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
  switch (skillLevel) {
    case 'beginner': return applyPresetConfig('BEGINNER');
    case 'intermediate': return applyPresetConfig('INTERMEDIATE');
    case 'advanced': return applyPresetConfig('ADVANCED');
    case 'expert': return applyPresetConfig('CHALLENGE');
    default: return GAME_CONFIG;
  }
};

// ==========================================================================
// EJEMPLOS DE USO EN EL CÓDIGO
// ==========================================================================

/*
// En tu componente React, puedes cambiar la configuración así:

import { useState } from 'react';
import { CONFIG_6_YEARS, CONFIG_10_YEARS, getConfigByAge } from './configExamples';

function NumberNinjaGame() {
  // Configuración dinámica basada en la edad del niño
  const [currentConfig, setCurrentConfig] = useState(getConfigByAge(8));
  
  // O usar configuraciones predefinidas
  const handleAgeChange = (age: number) => {
    setCurrentConfig(getConfigByAge(age));
  };
  
  // O permitir al padre elegir el modo
  const handleModeChange = (mode: string) => {
    switch (mode) {
      case 'easy':
        setCurrentConfig(CONFIG_EASY_MODE);
        break;
      case 'fast':
        setCurrentConfig(CONFIG_FAST_MODE);
        break;
      case 'generous':
        setCurrentConfig(CONFIG_GENEROUS_REWARDS);
        break;
      default:
        setCurrentConfig(GAME_CONFIG);
    }
  };
  
  // Usar la configuración en tu juego
  const levels = currentConfig.levels;
  const gameSettings = currentConfig.game;
  const rewardSettings = currentConfig.rewards;
  
  // ... resto del código del juego
}
*/
