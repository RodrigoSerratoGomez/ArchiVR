import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitConfirmationModal from "./modals/ExitConfirmationModal";
import InstructionsChallengeModal from "./modals/InstructionsChallengeModal";
import RestartConfirmationModal from "./modals/RestartConfirmationModal";

// SECTION: Generación de Acciones con las Opciones del Menú
const PauseMenu = ({
  isPaused,
  setIsPaused,
  currentChallengeInfo,
  resetLevel,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const navigate = useNavigate();

  // INFO: Pausar el juego
  const handlePause = () => {
    setIsPaused(true);
    document.exitPointerLock();
  };

  // INFO: Reanudar el juego
  const handleResume = () => {
    setIsPaused(false);
    setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.requestPointerLock();
      }
    }, 100);
  };

  // INFO: Confirmar la salida
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  // INFO: Confirmar y salir al menú principal
  const handleExitConfirm = () => {
    navigate("/");
  };

  // INFO: Cancelar la salida
  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  // INFO: Reiniciar el reto actual
  const handleRestart = () => {
    setShowRestartModal(true);
  };

  // INFO: Confirmar el reinicio
  const handleConfirmRestart = () => {
    resetLevel();
    setShowRestartModal(false);
    setIsPaused(false);
  };

  // INFO: Cancelar el reinicio
  const handleCancelRestart = () => {
    setShowRestartModal(false);
  };

  // INFO: Abrir el modal de instrucciones
  const handleOpenInstructions = () => {
    setShowInstructionsModal(true);
  };

  // INFO: Cerrar el modal de instrucciones
  const handleCloseInstructions = () => {
    setShowInstructionsModal(false);
  };

  // INFO: Cerrar todos los modales y volver al juego
  const handleCloseAllModals = () => {
    setIsPaused(false);
    setShowInstructionsModal(false);
  };

  // SECTION: Gestionar la Tecla "P" para Pausar o Reanudar el Juego
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyP") {
        if (isPaused) {
          handleResume();
        } else {
          handlePause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) {
      document.exitPointerLock();
    }
  }, [isPaused]);

  return (
    <>
      {isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 bg-opacity-95 p-10 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 text-white">
            <h2 className="text-4xl font-extrabold text-blue-400 mb-6">
              Menú de Pausa
            </h2>

            <button
              onClick={handleResume}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Reanudar
            </button>
            <button
              onClick={handleOpenInstructions}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Instrucciones
            </button>
            <button
              onClick={handleRestart}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Reiniciar
            </button>
            <button
              onClick={handleExit}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Salir
            </button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <ExitConfirmationModal
          handleExitConfirm={handleExitConfirm}
          handleCancelExit={handleCancelExit}
        />
      )}

      {showRestartModal && (
        <RestartConfirmationModal
          handleConfirmRestart={handleConfirmRestart}
          handleCancelRestart={handleCancelRestart}
        />
      )}

      {showInstructionsModal && currentChallengeInfo && (
        <InstructionsChallengeModal
          challengeInfo={currentChallengeInfo}
          handleClose={handleCloseInstructions}
          handleCloseAllModals={handleCloseAllModals}
          handleBackToPauseMenu={() => setShowInstructionsModal(false)}
        />
      )}
    </>
  );
};

export default PauseMenu;
