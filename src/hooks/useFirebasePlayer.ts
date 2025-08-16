// ==========================================================================
// HOOK PERSONALIZADO PARA INTEGRACIÓN CON FIREBASE
// Manejo de estado persistente con Firebase
// ==========================================================================

import { useState, useEffect, useCallback } from "react";
import { Player, GameSession } from "@/interfaces";
import { PlayerService } from "@/services/playerService";
import { SessionService } from "@/services/sessionService";

interface UseFirebasePlayerResult {
  // Estado del jugador
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;

  // Sesión actual
  currentSessionId: string | null;

  // Acciones
  createPlayer: (name: string, preferences?: Partial<Player["preferences"]>) => Promise<void>;
  loadPlayer: (playerId: string) => Promise<void>;
  loadPlayerByName: (name: string) => Promise<void>;
  updatePlayerProgress: (updates: Partial<Player["progress"]>) => Promise<void>;
  updatePlayerPreferences: (updates: Partial<Player["preferences"]>) => Promise<void>;

  // Sesiones
  startGameSession: (levelId: number) => Promise<void>;
  endGameSession: (sessionData: { problemsSolved: number; correctAnswers: number; wrongAnswers: number; totalScore: number; coinsEarned: number; timeSpent: number; averageResponseTime: number }) => Promise<void>;
  updateSessionStats: (updates: any) => Promise<void>;

  // Utilidades
  clearPlayer: () => void;
  refreshPlayer: () => Promise<void>;
}

export const useFirebasePlayer = (): UseFirebasePlayerResult => {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Cargar jugador desde localStorage al iniciar
  useEffect(() => {
    const savedPlayerId = localStorage.getItem("numberninja_player_id");
    if (savedPlayerId) {
      loadPlayer(savedPlayerId);
    }
  }, []);

  const createPlayer = useCallback(async (name: string, preferences?: Partial<Player["preferences"]>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si ya existe un jugador con ese nombre
      const existingPlayer = await PlayerService.getPlayerByName(name);
      if (existingPlayer) {
        setError("Ya existe un jugador con ese nombre");
        setIsLoading(false);
        return;
      }

      const playerId = await PlayerService.createPlayer({
        name,
        preferences: {
          soundEnabled: preferences?.soundEnabled ?? true,
          animationsEnabled: preferences?.animationsEnabled ?? true,
          preferredDifficulty: preferences?.preferredDifficulty ?? 1,
          theme: preferences?.theme ?? "default",
          parentalPin: preferences?.parentalPin,
        },
        progress: {
          totalProblems: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          bestStreak: 0,
          totalCoins: 0,
          totalWithdrawn: 0,
          timeSpent: 0,
          lastPlayed: new Date(),
        },
      });

      // Guardar ID en localStorage
      localStorage.setItem("numberninja_player_id", playerId);

      // Cargar el jugador creado
      await loadPlayer(playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear jugador");
      console.error("Error creating player:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPlayer = useCallback(async (playerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const player = await PlayerService.getPlayer(playerId);
      if (player) {
        setCurrentPlayer(player);
        localStorage.setItem("numberninja_player_id", playerId);
      } else {
        setError("Jugador no encontrado");
        localStorage.removeItem("numberninja_player_id");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar jugador");
      console.error("Error loading player:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPlayerByName = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const player = await PlayerService.getPlayerByName(name);
      if (player) {
        setCurrentPlayer(player);
        localStorage.setItem("numberninja_player_id", player.id);
      } else {
        setError("Jugador no encontrado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar jugador");
      console.error("Error loading player by name:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlayerProgress = useCallback(
    async (updates: Partial<Player["progress"]>) => {
      if (!currentPlayer) return;

      try {
        await PlayerService.updateProgress(currentPlayer.id, updates);

        // Actualizar estado local
        setCurrentPlayer((prev) =>
          prev
            ? {
                ...prev,
                progress: { ...prev.progress, ...updates },
              }
            : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar progreso");
        console.error("Error updating progress:", err);
      }
    },
    [currentPlayer]
  );

  const updatePlayerPreferences = useCallback(
    async (updates: Partial<Player["preferences"]>) => {
      if (!currentPlayer) return;

      try {
        await PlayerService.updatePreferences(currentPlayer.id, updates);

        // Actualizar estado local
        setCurrentPlayer((prev) =>
          prev
            ? {
                ...prev,
                preferences: { ...prev.preferences, ...updates },
              }
            : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar preferencias");
        console.error("Error updating preferences:", err);
      }
    },
    [currentPlayer]
  );

  const startGameSession = useCallback(
    async (levelId: number) => {
      if (!currentPlayer) return;

      try {
        const sessionId = await SessionService.startSession(currentPlayer.id, levelId);
        setCurrentSessionId(sessionId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        console.error("Error starting session:", err);
      }
    },
    [currentPlayer]
  );

  const endGameSession = useCallback(
    async (sessionData: any) => {
      if (!currentSessionId) return;

      try {
        await SessionService.endSession(currentSessionId, sessionData);
        setCurrentSessionId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al finalizar sesión");
        console.error("Error ending session:", err);
      }
    },
    [currentSessionId]
  );

  const updateSessionStats = useCallback(
    async (updates: any) => {
      if (!currentSessionId) return;

      try {
        await SessionService.updateSessionStats(currentSessionId, updates);
      } catch (err) {
        console.error("Error updating session stats:", err);
      }
    },
    [currentSessionId]
  );

  const clearPlayer = useCallback(() => {
    setCurrentPlayer(null);
    setCurrentSessionId(null);
    setError(null);
    localStorage.removeItem("numberninja_player_id");
  }, []);

  const refreshPlayer = useCallback(async () => {
    if (currentPlayer) {
      await loadPlayer(currentPlayer.id);
    }
  }, [currentPlayer, loadPlayer]);

  return {
    currentPlayer,
    isLoading,
    error,
    currentSessionId,
    createPlayer,
    loadPlayer,
    loadPlayerByName,
    updatePlayerProgress,
    updatePlayerPreferences,
    startGameSession,
    endGameSession,
    updateSessionStats,
    clearPlayer,
    refreshPlayer,
  };
};
