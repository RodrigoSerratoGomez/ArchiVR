const ExitConfirmationModal = ({ handleExitConfirm, handleCancelExit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center text-white">
        <h2 className="text-3xl font-extrabold text-red-500 mb-6">
          ¿Salir del Juego?
        </h2>
        <p className="text-md text-gray-300 mb-8">
          Perderás el progreso no guardado si sales.
          <br />
          ¿Estás seguro de que quieres salir?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCancelExit}
            className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Cancelar
          </button>
          <button
            onClick={handleExitConfirm}
            className="w-1/2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
