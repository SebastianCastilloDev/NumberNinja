// ==========================================================================
// SERVICIO DE GESTIÓN DE SESIONES DE JUEGO
// Tracking de sesiones y estadísticas en Firebase
// ==========================================================================

import { collection, doc, addDoc, updateDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GameSession } from "@/interfaces";

export class SessionService {
  private static COLLECTION = "sessions";

  /**
   * Iniciar una nueva sesión de juego
   */
  static async startSession(playerId: string, levelId: number): Promise<string> {
    try {
      const sessionsRef = collection(db, this.COLLECTION);

      const newSession = {
        playerId,
        levelId,
        startTime: serverTimestamp(),
        problemsSolved: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalScore: 0,
        coinsEarned: 0,
        timeSpent: 0,
        averageResponseTime: 0,
      };

      const docRef = await addDoc(sessionsRef, newSession);
      return docRef.id;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  }

  /**
   * Finalizar una sesión de juego
   */
  static async endSession(
    sessionId: string,
    sessionData: {
      problemsSolved: number;
      correctAnswers: number;
      wrongAnswers: number;
      totalScore: number;
      coinsEarned: number;
      timeSpent: number;
      averageResponseTime: number;
    }
  ): Promise<void> {
    try {
      const sessionDoc = doc(db, this.COLLECTION, sessionId);

      await updateDoc(sessionDoc, {
        ...sessionData,
        endTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error ending session:", error);
      throw error;
    }
  }

  /**
   * Actualizar estadísticas de la sesión actual
   */
  static async updateSessionStats(
    sessionId: string,
    updates: Partial<{
      problemsSolved: number;
      correctAnswers: number;
      wrongAnswers: number;
      totalScore: number;
      coinsEarned: number;
      timeSpent: number;
      averageResponseTime: number;
    }>
  ): Promise<void> {
    try {
      const sessionDoc = doc(db, this.COLLECTION, sessionId);
      await updateDoc(sessionDoc, updates);
    } catch (error) {
      console.error("Error updating session stats:", error);
      throw error;
    }
  }

  /**
   * Obtener las últimas sesiones de un jugador
   */
  static async getPlayerSessions(playerId: string, limitCount: number = 10): Promise<GameSession[]> {
    try {
      const sessionsRef = collection(db, this.COLLECTION);
      const q = query(sessionsRef, where("playerId", "==", playerId), orderBy("startTime", "desc"), limit(limitCount));

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate() || null,
        } as GameSession;
      });
    } catch (error) {
      console.error("Error getting player sessions:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas agregadas de un jugador
   */
  static async getPlayerStats(playerId: string): Promise<{
    totalSessions: number;
    totalTimeSpent: number;
    totalProblemsAttempted: number;
    totalCorrectAnswers: number;
    averageAccuracy: number;
    averageSessionDuration: number;
    favoriteLevel: number;
  }> {
    try {
      const sessionsRef = collection(db, this.COLLECTION);
      const q = query(
        sessionsRef,
        where("playerId", "==", playerId),
        where("endTime", "!=", null) // Solo sesiones completadas
      );

      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map((doc) => doc.data() as GameSession);

      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          totalTimeSpent: 0,
          totalProblemsAttempted: 0,
          totalCorrectAnswers: 0,
          averageAccuracy: 0,
          averageSessionDuration: 0,
          favoriteLevel: 1,
        };
      }

      const totalTimeSpent = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const totalProblemsAttempted = sessions.reduce((sum, session) => sum + session.problemsSolved, 0);
      const totalCorrectAnswers = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);

      // Calcular nivel favorito (más jugado)
      const levelCounts = sessions.reduce((acc, session) => {
        acc[session.levelId] = (acc[session.levelId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const favoriteLevel = Object.entries(levelCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "1";

      return {
        totalSessions: sessions.length,
        totalTimeSpent,
        totalProblemsAttempted,
        totalCorrectAnswers,
        averageAccuracy: totalProblemsAttempted > 0 ? (totalCorrectAnswers / totalProblemsAttempted) * 100 : 0,
        averageSessionDuration: sessions.length > 0 ? totalTimeSpent / sessions.length : 0,
        favoriteLevel: parseInt(favoriteLevel),
      };
    } catch (error) {
      console.error("Error getting player stats:", error);
      throw error;
    }
  }
}
