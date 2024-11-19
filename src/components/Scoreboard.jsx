const Scoreboard = ({ metrics }) => {
  const {
    totalPoints = 0,
    correct = 0,
    errors = 0,
    time = 0,
    title = "Título no disponible",
    objective = "Objetivo no disponible",
  } = metrics;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} min`;
  };

  return (
    <div className="absolute top-4 left-4 w-auto max-w-sm bg-gray-800 bg-opacity-80 p-6 rounded-lg text-white shadow-lg">
      <div className="mb-6">
        <p className="text-2xl font-bold text-yellow-300">{title}</p>

        <p className="text-base leading-[18px] text-gray-300 mt-2">
          {objective}
        </p>

        <p className="text-[12px] text-gray-500 font-bold mt-[5px]">
          Presiona la tecla "P" para ingresar al Menú de Pausa
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center">
          <p className="text-lg font-bold w-[110px]">Puntuación:</p>
          <p className="text-2xl text-blue-400">{totalPoints}</p>
        </div>

        <div className="flex flex-row items-center">
          <p className="text-lg font-bold w-[110px]">Aciertos:</p>
          <p className="text-2xl text-green-400">{correct}</p>
        </div>

        <div className="flex flex-row items-center">
          <p className="text-lg font-bold w-[110px]">Errores:</p>
          <p className="text-2xl text-red-400">{errors}</p>
        </div>

        <div className="flex flex-row items-center">
          <p className="text-lg font-bold w-[110px]">Tiempo:</p>
          <p className="text-2xl text-purple-400">{formatTime(time)}</p>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
