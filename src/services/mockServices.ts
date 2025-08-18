// ==========================================================================
// SERVICIO MOCK PARA DESARROLLO SIN FIREBASE
// Simula el comportamiento de Firebase para pruebas locales
// ==========================================================================

import { Player, GameSession, PlayerProgress, PlayerPreferences } from "@/interfaces";

// Almacenamiento local simulado
let mockDatabase: {
  players: Record<string, Player>;
  sessions: Record<string, GameSession>;
} = {
  players: {},
  sessions: {},
};

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockPlayerService {
  private static STORAGE_KEY = "numberninja_mock_players";

  // Cargar datos del localStorage
  private static loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          mockDatabase.players = JSON.parse(stored);
        } catch (e) {
          console.warn("Error loading mock data:", e);
        }
      }
    }
  }

  // Guardar datos en localStorage
  private static saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockDatabase.players));
    }
  }

  static async createPlayer(playerData: Omit<Player, "id" | "createdAt" | "lastLoginAt">): Promise<string> {
    await delay(500); // Simular latencia

    this.loadFromStorage();

    const playerId = `mock_player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newPlayer: Player = {
      ...playerData,
      id: playerId,
      createdAt: new Date(),
      lastLoginAt: new Date(),
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
      preferences: {
        soundEnabled: playerData.preferences?.soundEnabled ?? true,
        animationsEnabled: playerData.preferences?.animationsEnabled ?? true,
        preferredDifficulty: playerData.preferences?.preferredDifficulty ?? 1,
        theme: playerData.preferences?.theme ?? "default",
        ...(playerData.preferences?.parentalPin && { parentalPin: playerData.preferences.parentalPin }),
      },
    };

    mockDatabase.players[playerId] = newPlayer;
    this.saveToStorage();

    console.log("✅ Mock player created successfully:", {
      id: playerId,
      name: newPlayer.name,
      mode: "Mock Storage (localStorage)",
    });
    return playerId;
  }

  static async getPlayer(playerId: string): Promise<Player | null> {
    await delay(200);

    this.loadFromStorage();
    const player = mockDatabase.players[playerId];

    if (player) {
      // Convertir fechas string a Date si es necesario
      if (typeof player.createdAt === "string") {
        player.createdAt = new Date(player.createdAt);
      }
      if (typeof player.lastLoginAt === "string") {
        player.lastLoginAt = new Date(player.lastLoginAt);
      }
      if (typeof player.progress.lastPlayed === "string") {
        player.progress.lastPlayed = new Date(player.progress.lastPlayed);
      }
    }

    return player || null;
  }

  static async getPlayerByName(name: string): Promise<Player | null> {
    await delay(200);

    this.loadFromStorage();
    const players = Object.values(mockDatabase.players);
    const player = players.find((p) => p.name === name);

    return player || null;
  }

  static async updateProgress(playerId: string, progressUpdates: Partial<PlayerProgress>): Promise<void> {
    await delay(200);

    this.loadFromStorage();
    const player = mockDatabase.players[playerId];

    if (player) {
      player.progress = { ...player.progress, ...progressUpdates, lastPlayed: new Date() };
      player.lastLoginAt = new Date();
      this.saveToStorage();
      console.log("✅ Mock progress updated for:", playerId, progressUpdates);
    }
  }

  static async updatePreferences(playerId: string, preferences: Partial<PlayerPreferences>): Promise<void> {
    await delay(200);

    this.loadFromStorage();
    const player = mockDatabase.players[playerId];

    if (player) {
      player.preferences = { ...player.preferences, ...preferences };
      this.saveToStorage();
      console.log("✅ Mock preferences updated for:", playerId, preferences);
    }
  }

  static async getAllPlayers(): Promise<Player[]> {
    await delay(300);

    this.loadFromStorage();
    return Object.values(mockDatabase.players);
  }
}

export class MockSessionService {
  static async startSession(playerId: string, levelId: number): Promise<string> {
    await delay(100);

    const sessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newSession: GameSession = {
      id: sessionId,
      playerId,
      levelId,
      startTime: new Date(),
      problemsSolved: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalScore: 0,
      coinsEarned: 0,
      timeSpent: 0,
      averageResponseTime: 0,
    };

    mockDatabase.sessions[sessionId] = newSession;
    console.log("✅ Mock session started:", sessionId);

    return sessionId;
  }

  static async endSession(sessionId: string, sessionData: any): Promise<void> {
    await delay(100);

    const session = mockDatabase.sessions[sessionId];
    if (session) {
      Object.assign(session, sessionData, { endTime: new Date() });
      console.log("✅ Mock session ended:", sessionId, sessionData);
    }
  }

  static async updateSessionStats(sessionId: string, updates: any): Promise<void> {
    await delay(50);

    const session = mockDatabase.sessions[sessionId];
    if (session) {
      Object.assign(session, updates);
    }
  }

  // Métodos adicionales para el mock...
  static async getPlayerSessions(playerId: string, limitCount: number = 10): Promise<GameSession[]> {
    await delay(200);

    const sessions = Object.values(mockDatabase.sessions)
      .filter((session) => session.playerId === playerId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limitCount);

    return sessions;
  }
}
