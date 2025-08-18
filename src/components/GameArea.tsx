// ==========================================================================
// COMPONENTE DEL ÁREA DE JUEGO PRINCIPAL
// Contiene el problema, input y controles del juego
// ==========================================================================

import React from 'react';
import { Problem, Level, GameConfig } from '@/interfaces';

interface GameAreaProps {
  currentProblem: Problem;
  currentLevel: Level;
  userAnswer: string;
  feedback: string;
  isCorrect: boolean | null;
  canSubmit: boolean;
  nextLevel: Level | null;
  score: number;
  config: GameConfig;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  currentProblem,
  currentLevel,
  userAnswer,
  feedback,
  isCorrect,
  canSubmit,
  nextLevel,
  score,
  config,
  onAnswerChange,
  onSubmit,
  onKeyPress
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
        
        {/* Encabezado del Problema */}
        <ProblemHeader currentLevel={currentLevel} />
        
        {/* Problema Matemático */}
        <ProblemDisplay currentProblem={currentProblem} />
        
        {/* Área de Respuesta */}
        <AnswerInput
          userAnswer={userAnswer}
          isDisabled={isCorrect !== null}
          canSubmit={canSubmit}
          onAnswerChange={onAnswerChange}
          onSubmit={onSubmit}
          onKeyPress={onKeyPress}
        />

        {/* Feedback */}
        <FeedbackDisplay feedback={feedback} isCorrect={isCorrect} />

        {/* Información del Nivel */}
        <LevelInfo 
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          score={score}
          config={config}
        />
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DEL ENCABEZADO DEL PROBLEMA
// ==========================================================================

interface ProblemHeaderProps {
  currentLevel: Level;
}

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ currentLevel }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h2 className="font-comfortaa text-2xl text-gray-700">¡Resuelve esta suma!</h2>
        <div className={`bg-gradient-to-r ${currentLevel.color} rounded-lg px-3 py-1`}>
          <span className="font-fredoka text-sm font-bold text-white">
            {currentLevel.emoji} {currentLevel.name}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE VISUALIZACIÓN DEL PROBLEMA
// ==========================================================================

interface ProblemDisplayProps {
  currentProblem: Problem;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ currentProblem }) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-4">
      <div className="font-fredoka text-7xl md:text-8xl font-bold text-gray-800 text-center">
        {currentProblem.num1} + {currentProblem.num2} = ?
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE INPUT DE RESPUESTA
// ==========================================================================

interface AnswerInputProps {
  userAnswer: string;
  isDisabled: boolean;
  canSubmit: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
  userAnswer,
  isDisabled,
  canSubmit,
  onAnswerChange,
  onSubmit,
  onKeyPress
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        onKeyPress={onKeyPress}
        className="font-fredoka text-5xl text-center border-4 border-purple-300 rounded-2xl px-6 py-4 w-48 focus:border-purple-500 focus:outline-none transition-colors"
        placeholder="?"
        disabled={isDisabled}
      />
      
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="font-fredoka text-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        ✨ Verificar
      </button>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE FEEDBACK
// ==========================================================================

interface FeedbackDisplayProps {
  feedback: string;
  isCorrect: boolean | null;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isCorrect }) => {
  if (!feedback) return null;

  const feedbackClasses = `
    text-center p-4 rounded-xl mb-4 font-comfortaa text-xl font-bold
    ${isCorrect 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
    }
  `;

  return (
    <div className={feedbackClasses}>
      {feedback}
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE INFORMACIÓN DEL NIVEL
// ==========================================================================

interface LevelInfoProps {
  currentLevel: Level;
  nextLevel: Level | null;
  score: number;
  config: GameConfig;
}

const LevelInfo: React.FC<LevelInfoProps> = ({ currentLevel, nextLevel, score, config }) => {
  return (
    <div className="text-center text-gray-600 font-comfortaa">
      <p>💡 Escribe tu respuesta y presiona Enter o haz clic en Verificar</p>
      <p className="text-sm mt-2">
        🎯 Ganas {currentLevel.pointsPerCorrect} puntos por cada respuesta correcta en este nivel
      </p>
      
      <p className="text-sm mt-1">
        Rango: {currentLevel.minRange} - {currentLevel.maxRange} | 
        Puntos por acierto: {currentLevel.pointsPerCorrect}
      </p>
      
      {/* Progreso al Siguiente Nivel */}
      {nextLevel && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            🎯 Próximo nivel: {nextLevel.emoji} {nextLevel.name} 
            ({Math.max(0, nextLevel.requiredScore - score)} puntos restantes)
          </p>
        </div>
      )}
    </div>
  );
};
