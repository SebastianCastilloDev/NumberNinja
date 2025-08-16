// ==========================================================================
// COMPONENTE DE PANTALLA DE INICIO
// Pantalla principal con selección de niveles
// ==========================================================================

import React from 'react';
import { Level } from '@/interfaces';

interface StartScreenProps {
  levels: Level[];
  currentLevel: Level;
  score: number;
  onLevelSelect: (level: Level) => void;
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  levels,
  currentLevel,
  score,
  onLevelSelect,
  onStartGame
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto p-4">
        {/* Título Principal */}
        <h1 className="font-fredoka text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
          Number Ninja
        </h1>
        <div className="text-6xl md:text-7xl mt-4">
          🥷✨
        </div>
        <p className="font-comfortaa text-xl md:text-2xl text-white/80 mt-8 font-light tracking-wide">
          ¡Conviértete en un maestro de las matemáticas!
        </p>
        
        {/* Selector de Nivel */}
        <div className="mt-12">
          <h2 className="font-fredoka text-3xl text-white mb-8">Elige tu nivel de dificultad:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {levels.map((level) => {
              const isLocked = score < level.requiredScore;
              const isSelected = currentLevel.id === level.id;
              
              return (
                <LevelCard
                  key={level.id}
                  level={level}
                  isLocked={isLocked}
                  isSelected={isSelected}
                  onClick={() => !isLocked && onLevelSelect(level)}
                />
              );
            })}
          </div>
        </div>
        
        {/* Botón de Inicio */}
        <button
          onClick={onStartGame}
          className="mt-12 font-fredoka text-2xl bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-6 rounded-full hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
        >
          🚀 ¡Comenzar con {currentLevel.emoji} {currentLevel.name}!
        </button>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE TARJETA DE NIVEL
// ==========================================================================

interface LevelCardProps {
  level: Level;
  isLocked: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isLocked, isSelected, onClick }) => {
  const cardClasses = `
    p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
    ${isLocked 
      ? 'bg-gray-600/50 border-gray-500 opacity-50 cursor-not-allowed' 
      : isSelected
        ? 'bg-white/20 border-white transform scale-105 shadow-2xl'
        : 'bg-white/10 border-white/30 hover:bg-white/15 hover:border-white/50 hover:scale-102'
    }
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="text-4xl mb-2">{level.emoji}</div>
      <h3 className="font-fredoka text-xl font-bold text-white mb-2">{level.name}</h3>
      <p className="font-comfortaa text-sm text-white/80 mb-3">{level.description}</p>
      <div className="font-comfortaa text-xs text-white/70">
        <p>Números: {level.minRange} - {level.maxRange}</p>
        <p>Puntos: {level.pointsPerCorrect} por acierto</p>
        {isLocked && (
          <p className="text-red-300 mt-2">🔒 Necesitas {level.requiredScore} puntos</p>
        )}
      </div>
    </div>
  );
};
