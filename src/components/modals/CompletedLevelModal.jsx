const CompletedLevelModal = ({
  scoreDetails,
  handleReplay,
  handleMainMenu,
  handleSelectLevel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl max-w-3xl w-full text-center space-y-8 text-white">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4 animate-pulse">
          ¡Nivel Completado!
        </h1>

        <p className="text-lg italic text-gray-300 mb-6">
          "Cada paso te acerca a la perfección. ¡Sigue así!"
        </p>

        <div className="grid grid-cols-1 gap-6 mb-10">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 bg-yellow-500 text-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-4xl font-bold">
                {scoreDetails.totalPoints}
              </span>
            </div>
            <p className="text-lg text-yellow-400 mt-2 font-semibold">
              Puntaje Total
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">
                  {scoreDetails.correct}
                </span>
              </div>
              <p className="text-md text-green-400 mt-2 font-semibold">
                Aciertos
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">
                  {scoreDetails.errors}
                </span>
              </div>
              <p className="text-md text-red-400 mt-2 font-semibold">Errores</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">{scoreDetails.time}</span>
              </div>
              <p className="text-md text-blue-400 mt-2 font-semibold">Tiempo</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleReplay}
            className="w-1/3 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Volver a Jugar
          </button>

          <button
            onClick={handleMainMenu}
            className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Menú Principal
          </button>

          <button
            onClick={handleSelectLevel}
            className="w-1/3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Escoger Nivel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedLevelModal;
