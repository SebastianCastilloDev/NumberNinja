'use client';

import { useState, useEffect } from 'react';
import { 
  GAME_CONFIG, 
  Level, 
  getLevelConfig, 
  getAvailableLevels, 
  getNextLevel, 
  calculatePoints, 
  convertPointsToCoins 
} from '@/config/gameConfig';

interface Problem {
  num1: number;
  num2: number;
  correctAnswer: number;
}

export default function Home() {
  const [currentProblem, setCurrentProblem] = useState<Problem>({ num1: 0, num2: 0, correctAnswer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<Level>(GAME_CONFIG.levels[0]);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [coins, setCoins] = useState(0);

  // Generar nuevo problema de suma basado en el nivel actual
  const generateProblem = (): Problem => {
    const { minRange, maxRange } = currentLevel;
    const num1 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    const num2 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    const correctAnswer = num1 + num2;
    
    return { num1, num2, correctAnswer };
  };

  // Verificar si el jugador puede subir de nivel
  const checkLevelUp = (newScore: number) => {
    const nextLevel = getNextLevel(currentLevel, newScore);
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setFeedback(`🎉 ¡SUBISTE DE NIVEL! Ahora eres ${nextLevel.emoji} ${nextLevel.name}!`);
      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setFeedback('');
        setIsCorrect(null);
      }, GAME_CONFIG.game.levelUpDelay);
      return true;
    }
    return false;
  };

  // Obtener niveles disponibles basado en el puntaje
  const getAvailableLevelsForPlayer = () => {
    return getAvailableLevels(score);
  };

  // Inicializar primer problema cuando cambia el nivel
  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, [currentLevel]);

  // Validar respuesta
  const checkAnswer = () => {
    if (userAnswer.trim() === '') return;
    
    const answer = parseInt(userAnswer);
    const correct = answer === currentProblem.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      // Calcular puntos con bonificadores
      const basePoints = currentLevel.pointsPerCorrect;
      const finalPoints = calculatePoints(basePoints, streak);
      const newScore = score + finalPoints;
      
      setScore(newScore);
      setStreak(streak + 1);
      
      // Actualizar monedas
      setCoins(convertPointsToCoins(newScore));
      
      // Verificar si sube de nivel
      const leveledUp = checkLevelUp(newScore);
      if (!leveledUp) {
        const pointsText = finalPoints > basePoints ? 
          `¡Excelente! +${finalPoints} puntos (¡Bonus de racha!) 🎉` : 
          `¡Excelente! +${finalPoints} puntos 🎉`;
        setFeedback(pointsText);
        
        // Generar nuevo problema después del delay configurado
        setTimeout(() => {
          setCurrentProblem(generateProblem());
          setUserAnswer('');
          setFeedback('');
          setIsCorrect(null);
        }, GAME_CONFIG.game.correctAnswerDelay);
      }
    } else {
      setStreak(0);
      setFeedback(`¡Ups! La respuesta correcta es ${currentProblem.correctAnswer} 🤔`);
      
      // Limpiar feedback después del delay configurado
      setTimeout(() => {
        setFeedback('');
        setIsCorrect(null);
      }, GAME_CONFIG.game.incorrectAnswerDelay);
    }
  };

  // Manejar Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto p-4">
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
              {GAME_CONFIG.levels.map((level) => {
                const isLocked = score < level.requiredScore;
                return (
                  <div
                    key={level.id}
                    onClick={() => !isLocked && setCurrentLevel(level)}
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                      ${isLocked 
                        ? 'bg-gray-600/50 border-gray-500 opacity-50 cursor-not-allowed' 
                        : currentLevel.id === level.id
                          ? 'bg-white/20 border-white transform scale-105 shadow-2xl'
                          : 'bg-white/10 border-white/30 hover:bg-white/15 hover:border-white/50 hover:scale-102'
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">{level.emoji}</div>
                    <h3 className="font-fredoka text-xl font-bold text-white mb-2">{level.name}</h3>
                    <p className="font-comfortaa text-sm text-white/80 mb-3">{level.description}</p>
                    <div className="font-comfortaa text-xs text-white/70">
                      <p>Números: {level.minRange} - {level.maxRange}</p>
                      <p>Puntos: {level.pointsPerCorrect} por acierto</p>
                      {isLocked && <p className="text-red-300 mt-2">🔒 Necesitas {level.requiredScore} puntos</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={() => setGameStarted(true)}
            className="mt-12 font-fredoka text-2xl bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-6 rounded-full hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            🚀 ¡Comenzar con {currentLevel.emoji} {currentLevel.name}!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header con estadísticas */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-fredoka text-3xl font-bold text-white">NumberNinja 🥷</h1>
          </div>
          
          {/* Nivel actual */}
          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-r ${currentLevel.color} rounded-xl px-4 py-2`}>
              <div className="text-center">
                <div className="text-2xl">{currentLevel.emoji}</div>
                <div className="font-fredoka text-sm font-bold text-white">{currentLevel.name}</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowLevelSelector(!showLevelSelector)}
              className="font-comfortaa text-white/80 hover:text-white underline text-sm"
            >
              Cambiar nivel
            </button>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl">🏆</div>
              <div className="font-comfortaa text-sm text-white/80">Puntos</div>
              <div className="font-fredoka text-2xl font-bold text-yellow-400">{score}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl">{GAME_CONFIG.rewards.coinEmoji}</div>
              <div className="font-comfortaa text-sm text-white/80">{GAME_CONFIG.rewards.coinName}</div>
              <div className="font-fredoka text-2xl font-bold text-green-400">{coins}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl">🔥</div>
              <div className="font-comfortaa text-sm text-white/80">Racha</div>
              <div className="font-fredoka text-2xl font-bold text-orange-400">{streak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de nivel desplegable */}
      {showLevelSelector && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6">
            <h3 className="font-fredoka text-2xl text-gray-800 mb-4 text-center">Selecciona un nivel:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {getAvailableLevelsForPlayer().map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setCurrentLevel(level);
                    setShowLevelSelector(false);
                    setUserAnswer('');
                    setFeedback('');
                    setIsCorrect(null);
                  }}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${currentLevel.id === level.id
                      ? `bg-gradient-to-r ${level.color} text-white border-transparent transform scale-105`
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{level.emoji}</div>
                  <div className="font-fredoka text-sm font-bold">{level.name}</div>
                  <div className="font-comfortaa text-xs mt-1">{level.minRange}-{level.maxRange}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Área principal del juego */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          
          {/* Problema matemático */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="font-comfortaa text-2xl text-gray-700">¡Resuelve esta suma!</h2>
              <div className={`bg-gradient-to-r ${currentLevel.color} rounded-lg px-3 py-1`}>
                <span className="font-fredoka text-sm font-bold text-white">
                  {currentLevel.emoji} {currentLevel.name}
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-4">
              <div className="font-fredoka text-7xl md:text-8xl font-bold text-gray-800">
                {currentProblem.num1} + {currentProblem.num2} = ?
              </div>
            </div>
            
            <p className="font-comfortaa text-sm text-gray-600">
              Rango: {currentLevel.minRange} - {currentLevel.maxRange} | 
              Puntos por acierto: {currentLevel.pointsPerCorrect}
            </p>
          </div>

          {/* Input y botón */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-fredoka text-5xl text-center border-4 border-purple-300 rounded-2xl px-6 py-4 w-48 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="?"
              disabled={isCorrect !== null}
            />
            
            <button
              onClick={checkAnswer}
              disabled={isCorrect !== null || userAnswer.trim() === ''}
              className="font-fredoka text-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              ✨ Verificar
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center p-4 rounded-xl mb-4 font-comfortaa text-xl font-bold ${
              isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {feedback}
            </div>
          )}

          {/* Instrucciones */}
          <div className="text-center text-gray-600 font-comfortaa">
            <p>💡 Escribe tu respuesta y presiona Enter o haz clic en Verificar</p>
            <p className="text-sm mt-2">🎯 Ganas {currentLevel.pointsPerCorrect} puntos por cada respuesta correcta en este nivel</p>
            
            {/* Mostrar progreso al siguiente nivel */}
            {currentLevel.id < GAME_CONFIG.levels.length && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  🎯 Próximo nivel: {GAME_CONFIG.levels[currentLevel.id].emoji} {GAME_CONFIG.levels[currentLevel.id].name} 
                  ({Math.max(0, GAME_CONFIG.levels[currentLevel.id].requiredScore - score)} puntos restantes)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón para volver al inicio */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setGameStarted(false);
              setScore(0);
              setStreak(0);
              setUserAnswer('');
              setFeedback('');
              setIsCorrect(null);
            }}
            className="font-comfortaa text-white/80 hover:text-white underline"
          >
            🏠 Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
