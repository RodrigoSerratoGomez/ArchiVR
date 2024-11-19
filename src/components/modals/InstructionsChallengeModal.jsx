const InstructionsChallengeModal = ({
  challengeInfo,
  handleBackToPauseMenu,
  handleCloseAllModals,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-gray-800 bg-opacity-95 p-8 rounded-3xl shadow-2xl max-w-3xl w-full text-white relative">
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-4 text-center">
            {challengeInfo.title || "Título no disponible"}
          </h1>

          <h2 className="text-2xl font-semibold text-gray-300 mb-4 text-center">
            {challengeInfo.objective || "Objetivo no disponible"}
          </h2>

          <p className="text-md text-gray-400 mb-6 leading-relaxed">
            {challengeInfo.description || "Descripción no disponible"}
          </p>

          <div className="text-left">
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">
              Restricciones:
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-yellow-200">
              {challengeInfo.restrictions.map((restriction, index) => (
                <li key={index}>{restriction}</li>
              ))}
            </ul>
          </div>

          <div className="text-left mt-6">
            <h3 className="text-lg font-semibold text-red-500 mb-3">
              Penalizaciones:
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-red-300">
              {challengeInfo.penalties.map((penalty, index) => (
                <li key={index}>{penalty}</li>
              ))}
            </ul>
          </div>

          <div className="text-left mt-6">
            <h3 className="text-lg font-semibold text-green-500 mb-3">
              Bonificaciones:
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-green-300">
              {challengeInfo.bonuses.map((bonus, index) => (
                <li key={index}>{bonus}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-between space-x-4">
          <button
            onClick={handleBackToPauseMenu}
            className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Regresar al Menú de Pausa
          </button>
          <button
            onClick={handleCloseAllModals}
            className="w-1/2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsChallengeModal;
