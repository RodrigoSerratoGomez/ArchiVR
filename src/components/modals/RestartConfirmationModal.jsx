const RestartConfirmationModal = ({
  handleConfirmRestart,
  handleCancelRestart,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center text-white">
        <h2 className="text-3xl font-extrabold text-yellow-500 mb-6">
          ¿Reiniciar Nivel?
        </h2>
        <p className="text-md text-gray-300 mb-8">
          Si decides reiniciar, perderás tu progreso actual en este nivel.
          <br />
          ¿Estás seguro de que quieres reiniciar?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCancelRestart}
            className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmRestart}
            className="w-1/2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestartConfirmationModal;
