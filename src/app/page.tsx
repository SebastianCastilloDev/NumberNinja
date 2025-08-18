'use client';

import React from 'react';
import { GAME_CONFIG } from '@/config/gameConfig';
import { useGameState } from '@/hooks/useGameState';
import { useFirebasePlayer } from '@/hooks/useFirebasePlayer';
import { StartScreen } from '@/components/StartScreen';
import { GameHeader } from '@/components/GameHeader';
import { GameArea } from '@/components/GameArea';
import { PlayerSelection } from '@/components/PlayerSelection';

export default function Home() {
  const gameState = useGameState({ config: GAME_CONFIG });
  const firebasePlayer = useFirebasePlayer();

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      gameState.submitAnswer();
    }
  };

  // Manejar creación/selección de jugador
  const handlePlayerCreated = async (name: string) => {
    await firebasePlayer.createPlayer(name);
  };

  // Manejar cambio de jugador
  const handleChangePlayer = () => {
    firebasePlayer.clearPlayer();
    gameState.resetGame(); // Resetear el juego también
  };

  // Si no hay jugador seleccionado, mostrar selección de jugador
  if (!firebasePlayer.currentPlayer) {
    return (
      <PlayerSelection
        onPlayerSelected={() => {}} // Por ahora no usado
        onCreatePlayer={handlePlayerCreated}
        isLoading={firebasePlayer.isLoading}
        error={firebasePlayer.error}
      />
    );
  }

  // Pantalla de inicio
  if (!gameState.gameStarted) {
    return (
      <StartScreen
        levels={GAME_CONFIG.levels}
        currentLevel={gameState.currentLevel}
        score={gameState.score}
        onLevelSelect={gameState.changeLevel}
        onStartGame={gameState.startGame}
        playerName={firebasePlayer.currentPlayer.name} // Mostrar nombre del jugador
        onChangePlayer={handleChangePlayer} // Función para cambiar jugador
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
