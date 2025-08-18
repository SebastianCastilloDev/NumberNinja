// ==========================================================================
// SERVICIO DE GESTIÓN DE JUGADORES
// Operaciones CRUD para jugadores en Firebase
// ==========================================================================

import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-dev"; // Usar configuración de desarrollo
import { Player, PlayerProgress, PlayerPreferences } from "@/interfaces";

export class PlayerService {
  private static COLLECTION = "players";

  /**
   * Verificar si Firebase está disponible
   */
  private static checkFirebaseAvailable(): boolean {
    if (!db) {
      console.warn("🚧 Firebase no está disponible. Usa MockPlayerService para desarrollo.");
      return false;
    }
    return true;
  }

  /**
   * Crear un nuevo jugador
   */
  static async createPlayer(playerData: Omit<Player, "id" | "createdAt" | "lastLoginAt">): Promise<string> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const playerDoc = doc(db!, this.COLLECTION, playerId);

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
          parentalPin: playerData.preferences?.parentalPin,
        },
      };

      await setDoc(playerDoc, {
        ...newPlayer,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        "progress.lastPlayed": serverTimestamp(),
      });

      return playerId;
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  }

  /**
   * Obtener un jugador por ID
   */
  static async getPlayer(playerId: string): Promise<Player | null> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playerDoc = doc(db!, this.COLLECTION, playerId);
      const playerSnap = await getDoc(playerDoc);

      if (playerSnap.exists()) {
        const data = playerSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          progress: {
            ...data.progress,
            lastPlayed: data.progress?.lastPlayed?.toDate() || new Date(),
          },
        } as Player;
      }

      return null;
    } catch (error) {
      console.error("Error getting player:", error);
      throw error;
    }
  }

  /**
   * Buscar jugador por nombre
   */
  static async getPlayerByName(name: string): Promise<Player | null> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playersRef = collection(db!, this.COLLECTION);
      const q = query(playersRef, where("name", "==", name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          progress: {
            ...data.progress,
            lastPlayed: data.progress?.lastPlayed?.toDate() || new Date(),
          },
        } as Player;
      }

      return null;
    } catch (error) {
      console.error("Error getting player by name:", error);
      throw error;
    }
  }

  /**
   * Actualizar progreso del jugador
   */
  static async updateProgress(playerId: string, progressUpdates: Partial<PlayerProgress>): Promise<void> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playerDoc = doc(db!, this.COLLECTION, playerId);
      const updateData: Record<string, unknown> = {};

      // Convertir las claves del progreso para Firestore
      Object.entries(progressUpdates).forEach(([key, value]) => {
        updateData[`progress.${key}`] = value;
      });

      // Añadir timestamp de última jugada
      updateData["progress.lastPlayed"] = serverTimestamp();
      updateData["lastLoginAt"] = serverTimestamp();

      await updateDoc(playerDoc, updateData);
    } catch (error) {
      console.error("Error updating player progress:", error);
      throw error;
    }
  }

  /**
   * Actualizar preferencias del jugador
   */
  static async updatePreferences(playerId: string, preferences: Partial<PlayerPreferences>): Promise<void> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playerDoc = doc(db!, this.COLLECTION, playerId);
      const updateData: Record<string, unknown> = {};

      // Convertir las claves de las preferencias para Firestore
      Object.entries(preferences).forEach(([key, value]) => {
        updateData[`preferences.${key}`] = value;
      });

      await updateDoc(playerDoc, updateData);
    } catch (error) {
      console.error("Error updating player preferences:", error);
      throw error;
    }
  }

  /**
   * Obtener todos los jugadores (para el dashboard de padres)
   */
  static async getAllPlayers(): Promise<Player[]> {
    if (!this.checkFirebaseAvailable()) {
      throw new Error("Firebase no está disponible. Usa MockPlayerService para desarrollo.");
    }

    try {
      const playersRef = collection(db!, this.COLLECTION);
      const querySnapshot = await getDocs(playersRef);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          progress: {
            ...data.progress,
            lastPlayed: data.progress?.lastPlayed?.toDate() || new Date(),
          },
        } as Player;
      });
    } catch (error) {
      console.error("Error getting all players:", error);
      throw error;
    }
  }
}
