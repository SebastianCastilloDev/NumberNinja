// ==========================================================================
// COMPONENTE DEL HEADER DEL JUEGO
// Muestra estadísticas, nivel actual y controles
// ==========================================================================

import React from 'react';
import { Level, RewardSettings } from '@/interfaces';

interface GameHeaderProps {
  currentLevel: Level;
  score: number;
  coins: number;
  streak: number;
  showLevelSelector: boolean;
  availableLevels: Level[];
  rewardSettings: RewardSettings;
  onToggleLevelSelector: () => void;
  onLevelChange: (level: Level) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentLevel,
  score,
  coins,
  streak,
  showLevelSelector,
  availableLevels,
  rewardSettings,
  onToggleLevelSelector,
  onLevelChange
}) => {
  return (
    <>
      {/* Header Principal */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-fredoka text-3xl font-bold text-white">NumberNinja 🥷</h1>
          </div>
          
          {/* Nivel Actual */}
          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-r ${currentLevel.color} rounded-xl px-4 py-2`}>
              <div className="text-center">
                <div className="text-2xl">{currentLevel.emoji}</div>
                <div className="font-fredoka text-sm font-bold text-white">{currentLevel.name}</div>
              </div>
            </div>
            
            <button
              onClick={onToggleLevelSelector}
              className="font-comfortaa text-white/80 hover:text-white underline text-sm"
            >
              Cambiar nivel
            </button>
          </div>
          
          {/* Estadísticas */}
          <StatsDisplay 
            score={score}
            coins={coins}
            streak={streak}
            rewardSettings={rewardSettings}
          />
        </div>
      </div>

      {/* Selector de Nivel Desplegable */}
      {showLevelSelector && (
        <LevelSelector
          availableLevels={availableLevels}
          currentLevel={currentLevel}
          onLevelChange={onLevelChange}
        />
      )}
    </>
  );
};

// ==========================================================================
// COMPONENTE DE ESTADÍSTICAS
// ==========================================================================

interface StatsDisplayProps {
  score: number;
  coins: number;
  streak: number;
  rewardSettings: RewardSettings;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ score, coins, streak, rewardSettings }) => {
  return (
    <div className="flex gap-6">
      <StatItem
        emoji="🏆"
        label="Puntos"
        value={score}
        color="text-yellow-400"
      />
      
      <StatItem
        emoji={rewardSettings.coinEmoji}
        label={rewardSettings.coinName}
        value={coins}
        color="text-green-400"
      />
      
      <StatItem
        emoji="🔥"
        label="Racha"
        value={streak}
        color="text-orange-400"
      />
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE ITEM DE ESTADÍSTICA
// ==========================================================================

interface StatItemProps {
  emoji: string;
  label: string;
  value: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ emoji, label, value, color }) => {
  return (
    <div className="text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="font-comfortaa text-sm text-white/80">{label}</div>
      <div className={`font-fredoka text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE SELECTOR DE NIVEL
// ==========================================================================

interface LevelSelectorProps {
  availableLevels: Level[];
  currentLevel: Level;
  onLevelChange: (level: Level) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  availableLevels,
  currentLevel,
  onLevelChange
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6">
        <h3 className="font-fredoka text-2xl text-gray-800 mb-4 text-center">Selecciona un nivel:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {availableLevels.map((level) => (
            <LevelButton
              key={level.id}
              level={level}
              isSelected={currentLevel.id === level.id}
              onClick={() => onLevelChange(level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE BOTÓN DE NIVEL
// ==========================================================================

interface LevelButtonProps {
  level: Level;
  isSelected: boolean;
  onClick: () => void;
}

const LevelButton: React.FC<LevelButtonProps> = ({ level, isSelected, onClick }) => {
  const buttonClasses = `
    p-4 rounded-xl border-2 transition-all duration-300
    ${isSelected
      ? `bg-gradient-to-r ${level.color} text-white border-transparent transform scale-105`
      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }
  `;

  return (
    <button className={buttonClasses} onClick={onClick}>
      <div className="text-2xl mb-1">{level.emoji}</div>
      <div className="font-fredoka text-sm font-bold">{level.name}</div>
      <div className="font-comfortaa text-xs mt-1">{level.minRange}-{level.maxRange}</div>
    </button>
  );
};
