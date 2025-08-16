// ==========================================================================
// COMPONENTE DE SELECCIÓN DE JUGADOR
// Pantalla para crear o seleccionar perfil de jugador
// ==========================================================================

import React, { useState } from 'react';
import { Player } from '@/interfaces';

interface PlayerSelectionProps {
  onPlayerSelected: (player: Player) => void;
  onCreatePlayer: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  onPlayerSelected,
  onCreatePlayer,
  isLoading,
  error
}) => {
  const [playerName, setPlayerName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreatePlayer(playerName.trim());
    }
  };

  const handleQuickStart = () => {
    const randomNames = [
      'Ninja Matemático', 'Súper Calculador', 'Genio Números', 
      'Campeón Sumas', 'Estrella Math', 'Héroe Números'
    ];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    onCreatePlayer(randomName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥷</div>
          <h1 className="font-fredoka text-3xl font-bold text-white mb-2">
            ¡Hola, futuro Ninja!
          </h1>
          <p className="font-comfortaa text-white/70 text-sm">
            ¿Cuál es tu nombre de ninja?
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-200 text-sm font-comfortaa">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-comfortaa text-sm mb-2">
              Tu nombre ninja:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: Alex el Matemático"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 font-comfortaa focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
              disabled={isLoading}
              maxLength={30}
            />
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!playerName.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-fredoka text-lg font-bold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isLoading ? '⏳ Creando perfil...' : '🚀 ¡Comenzar aventura!'}
            </button>

            <button
              type="button"
              onClick={handleQuickStart}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-fredoka text-lg font-bold hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              🎲 Sorpréndeme con un nombre
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-xs font-comfortaa">
            💡 Tip: Elige un nombre que te guste, ¡será tu identidad ninja!
          </p>
        </div>

        {/* Para padres */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-white/40 text-xs font-comfortaa text-center">
            👨‍👩‍👧‍👦 Los padres pueden ver el progreso desde la configuración
          </p>
        </div>
      </div>
    </div>
  );
};
