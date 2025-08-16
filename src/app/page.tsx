export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-fredoka text-8xl md:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          Number
        </h1>
        <h1 className="font-fredoka text-8xl md:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl -mt-8 md:-mt-12 lg:-mt-20">
          Ninja
        </h1>
        <div className="text-6xl md:text-7xl lg:text-8xl mt-4 animate-bounce">
          🥷✨
        </div>
        <p className="font-comfortaa text-xl md:text-2xl text-white/80 mt-8 font-light tracking-wide">
          ¡Conviértete en un maestro de las matemáticas!
        </p>
      </div>
    </div>
  );
}
