'use client';

import React from 'react';
import { GAME_CONFIG } from '@/config/gameConfig';
import { useGameState } from '@/hooks/useGameState';
import { StartScreen } from '@/components/StartScreen';
import { GameHeader } from '@/components/GameHeader';
import { GameArea } from '@/components/GameArea';

export default function Home() {
  const gameState = useGameState({ config: GAME_CONFIG });

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      gameState.submitAnswer();
    }
  };

  // Pantalla de inicio
  if (!gameState.gameStarted) {
    return (
      <StartScreen
        levels={GAME_CONFIG.levels}
        currentLevel={gameState.currentLevel}
        score={gameState.score}
        onLevelSelect={gameState.changeLevel}
        onStartGame={gameState.startGame}
      />
    );
  }

  // Pantalla de juego
  return (
    <div className="min-h-screen p-4">
      {/* Header del Juego */}
      <GameHeader
        currentLevel={gameState.currentLevel}
        score={gameState.score}
        coins={gameState.coins}
        streak={gameState.streak}
        showLevelSelector={gameState.showLevelSelector}
        availableLevels={gameState.availableLevels}
        rewardSettings={GAME_CONFIG.rewards}
        onToggleLevelSelector={gameState.toggleLevelSelector}
        onLevelChange={gameState.changeLevel}
      />

      {/* Área Principal del Juego */}
      <GameArea
        currentProblem={gameState.currentProblem}
        currentLevel={gameState.currentLevel}
        userAnswer={gameState.userAnswer}
        feedback={gameState.feedback}
        isCorrect={gameState.isCorrect}
        canSubmit={gameState.canSubmit}
        nextLevel={gameState.nextLevel}
        score={gameState.score}
        config={GAME_CONFIG}
        onAnswerChange={gameState.setUserAnswer}
        onSubmit={gameState.submitAnswer}
        onKeyPress={handleKeyPress}
      />

      {/* Botón para volver al inicio */}
      <div className="text-center mt-8">
        <button
          onClick={gameState.resetGame}
          className="font-comfortaa text-white/80 hover:text-white underline"
        >
          🏠 Volver al inicio
        </button>
      </div>
    </div>
  );
}
