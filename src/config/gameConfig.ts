// ==========================================================================
// CONFIGURACIÓN PRINCIPAL DE NUMBERNINJA
// Single Source of Truth para todos los valores del juego
// ==========================================================================

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
  // Configuración de niveles
  levels: Level[];
  
  // Configuración de juego
  game: {
    // Tiempo de feedback en milisegundos
    correctAnswerDelay: number;
    incorrectAnswerDelay: number;
    levelUpDelay: number;
    
    // Configuración de sonidos (para futuro)
    soundEnabled: boolean;
    
    // Configuración de animaciones
    animationsEnabled: boolean;
  };
  
  // Configuración de la interfaz
  ui: {
    // Fuentes
    primaryFont: string;
    secondaryFont: string;
    
    // Colores del tema
    background: string;
    
    // Tamaños de texto responsivos
    titleSizes: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    
    problemSizes: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  };
  
  // Configuración de recompensas y monedas
  rewards: {
    // Nombre de la moneda virtual
    coinName: string;
    coinEmoji: string;
    
    // Multiplicadores de puntos
    streakMultiplier: number; // Multiplicador por cada 5 respuestas consecutivas
    perfectionBonus: number; // Bonus por 10 respuestas perfectas seguidas
    
    // Sistema de retiros
    minimumWithdrawal: number;
    conversionRate: number; // 1 punto = X monedas
  };
  
  // Configuración de progreso
  progress: {
    // Auto-avance de nivel
    autoLevelUp: boolean;
    
    // Guardar progreso localmente
    saveProgressLocally: boolean;
    
    // Mostrar estadísticas detalladas
    showDetailedStats: boolean;
  };
}

// ==========================================================================
// CONFIGURACIÓN PRINCIPAL
// ==========================================================================

export const GAME_CONFIG: GameConfig = {
  levels: [
    {
      id: 1,
      name: "Principiante",
      emoji: "🐣",
      description: "Sumas súper fáciles para empezar",
      minRange: 1,
      maxRange: 10,
      pointsPerCorrect: 5,
      requiredScore: 0,
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      name: "Explorador",
      emoji: "🔍",
      description: "Un poco más de desafío",
      minRange: 5,
      maxRange: 20,
      pointsPerCorrect: 10,
      requiredScore: 50,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      name: "Aventurero",
      emoji: "⚡",
      description: "¡Ahora viene lo interesante!",
      minRange: 10,
      maxRange: 50,
      pointsPerCorrect: 15,
      requiredScore: 150,
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 4,
      name: "Guerrero",
      emoji: "⚔️",
      description: "Para ninjas valientes",
      minRange: 20,
      maxRange: 100,
      pointsPerCorrect: 20,
      requiredScore: 300,
      color: "from-orange-400 to-orange-600"
    },
    {
      id: 5,
      name: "Maestro",
      emoji: "🥷",
      description: "¡El nivel de los verdaderos ninjas!",
      minRange: 50,
      maxRange: 200,
      pointsPerCorrect: 30,
      requiredScore: 500,
      color: "from-red-400 to-red-600"
    },
    {
      id: 6,
      name: "Leyenda",
      emoji: "👑",
      description: "¡Solo para los más grandes maestros!",
      minRange: 100,
      maxRange: 500,
      pointsPerCorrect: 50,
      requiredScore: 800,
      color: "from-yellow-400 to-yellow-600"
    }
  ],
  
  game: {
    correctAnswerDelay: 1500,    // 1.5 segundos
    incorrectAnswerDelay: 2000,  // 2 segundos
    levelUpDelay: 3000,          // 3 segundos
    soundEnabled: true,
    animationsEnabled: true,
  },
  
  ui: {
    primaryFont: "font-fredoka",
    secondaryFont: "font-comfortaa",
    background: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
    
    titleSizes: {
      mobile: "text-6xl",
      tablet: "md:text-8xl",
      desktop: "lg:text-9xl"
    },
    
    problemSizes: {
      mobile: "text-6xl",
      tablet: "md:text-7xl",
      desktop: "lg:text-8xl"
    }
  },
  
  rewards: {
    coinName: "NinjaCoins",
    coinEmoji: "🪙",
    streakMultiplier: 1.5,     // 50% bonus por racha
    perfectionBonus: 100,      // 100 puntos bonus por 10 perfectas
    minimumWithdrawal: 50,     // Mínimo 50 coins para retirar
    conversionRate: 0.1,       // 1 punto = 0.1 NinjaCoins
  },
  
  progress: {
    autoLevelUp: true,
    saveProgressLocally: true,
    showDetailedStats: true,
  }
};

// ==========================================================================
// FUNCIONES UTILITARIAS
// ==========================================================================

// Obtener configuración de un nivel específico
export const getLevelConfig = (levelId: number): Level | undefined => {
  return GAME_CONFIG.levels.find(level => level.id === levelId);
};

// Obtener todos los niveles disponibles basado en el puntaje
export const getAvailableLevels = (currentScore: number): Level[] => {
  return GAME_CONFIG.levels.filter(level => currentScore >= level.requiredScore);
};

// Calcular el siguiente nivel
export const getNextLevel = (currentLevel: Level, currentScore: number): Level | null => {
  return GAME_CONFIG.levels.find(
    level => level.requiredScore > currentLevel.requiredScore && 
             currentScore >= level.requiredScore
  ) || null;
};

// Calcular puntos con bonificadores
export const calculatePoints = (basePoints: number, streak: number): number => {
  let finalPoints = basePoints;
  
  // Aplicar multiplicador de racha cada 5 aciertos consecutivos
  if (streak > 0 && streak % 5 === 0) {
    finalPoints = Math.floor(finalPoints * GAME_CONFIG.rewards.streakMultiplier);
  }
  
  return finalPoints;
};

// Convertir puntos a monedas
export const convertPointsToCoins = (points: number): number => {
  return Math.floor(points * GAME_CONFIG.rewards.conversionRate);
};

// Validar si se puede hacer un retiro
export const canWithdraw = (coinBalance: number): boolean => {
  return coinBalance >= GAME_CONFIG.rewards.minimumWithdrawal;
};

// ==========================================================================
// CONFIGURACIONES PREDEFINIDAS (para diferentes edades/habilidades)
// ==========================================================================

export const PRESET_CONFIGS = {
  // Para niños de 6-7 años
  BEGINNER: {
    ...GAME_CONFIG,
    levels: GAME_CONFIG.levels.map(level => ({
      ...level,
      maxRange: Math.min(level.maxRange, 20), // Máximo 20
      pointsPerCorrect: level.pointsPerCorrect * 2, // Más recompensas
    }))
  },
  
  // Para niños de 8-9 años
  INTERMEDIATE: {
    ...GAME_CONFIG,
    levels: GAME_CONFIG.levels.map(level => ({
      ...level,
      requiredScore: Math.floor(level.requiredScore * 0.8), // Menos puntos requeridos
    }))
  },
  
  // Para niños de 10+ años
  ADVANCED: GAME_CONFIG, // Configuración estándar
  
  // Modo desafío
  CHALLENGE: {
    ...GAME_CONFIG,
    levels: GAME_CONFIG.levels.map(level => ({
      ...level,
      maxRange: level.maxRange * 2, // Números más grandes
      pointsPerCorrect: Math.floor(level.pointsPerCorrect * 1.5), // Más puntos
      requiredScore: level.requiredScore * 2, // Más puntos requeridos
    })),
    game: {
      ...GAME_CONFIG.game,
      correctAnswerDelay: 1000, // Más rápido
      incorrectAnswerDelay: 1500,
    }
  }
};

// Función para aplicar una configuración predefinida
export const applyPresetConfig = (preset: keyof typeof PRESET_CONFIGS): GameConfig => {
  return PRESET_CONFIGS[preset];
};
