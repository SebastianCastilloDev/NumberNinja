'use client';

import { useState, useEffect } from 'react';

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

  // Generar nuevo problema de suma
  const generateProblem = (): Problem => {
    const num1 = Math.floor(Math.random() * 50) + 1; // Números del 1 al 50
    const num2 = Math.floor(Math.random() * 50) + 1;
    const correctAnswer = num1 + num2;
    
    return { num1, num2, correctAnswer };
  };

  // Inicializar primer problema
  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, []);

  // Validar respuesta
  const checkAnswer = () => {
    if (userAnswer.trim() === '') return;
    
    const answer = parseInt(userAnswer);
    const correct = answer === currentProblem.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
      setFeedback('¡Excelente! 🎉');
      
      // Generar nuevo problema después de 1.5 segundos
      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setFeedback('');
        setIsCorrect(null);
      }, 1500);
    } else {
      setStreak(0);
      setFeedback(`¡Ups! La respuesta correcta es ${currentProblem.correctAnswer} 🤔`);
      
      // Limpiar feedback después de 2 segundos
      setTimeout(() => {
        setFeedback('');
        setIsCorrect(null);
      }, 2000);
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
        <div className="text-center">
          <h1 className="font-fredoka text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            Number Ninja
          </h1>
          <div className="text-6xl md:text-7xl mt-4">
            🥷✨
          </div>
          <p className="font-comfortaa text-xl md:text-2xl text-white/80 mt-8 font-light tracking-wide">
            ¡Conviértete en un maestro de las matemáticas!
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="mt-12 font-fredoka text-2xl bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-6 rounded-full hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            🚀 ¡Comenzar Aventura!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header con estadísticas */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-fredoka text-3xl font-bold text-white">NumberNinja 🥷</h1>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl">🏆</div>
              <div className="font-comfortaa text-sm text-white/80">Puntos</div>
              <div className="font-fredoka text-2xl font-bold text-yellow-400">{score}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl">🔥</div>
              <div className="font-comfortaa text-sm text-white/80">Racha</div>
              <div className="font-fredoka text-2xl font-bold text-orange-400">{streak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal del juego */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          
          {/* Problema matemático */}
          <div className="text-center mb-8">
            <h2 className="font-comfortaa text-2xl text-gray-700 mb-6">¡Resuelve esta suma!</h2>
            
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-6">
              <div className="font-fredoka text-7xl md:text-8xl font-bold text-gray-800">
                {currentProblem.num1} + {currentProblem.num2} = ?
              </div>
            </div>
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
            <p className="text-sm mt-2">🎯 Ganas 10 puntos por cada respuesta correcta</p>
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
