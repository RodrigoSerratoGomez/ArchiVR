import { useEffect } from "react";

const InitialInstructionsModal = ({ levelInfo, isPaused, setShowModal }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Enter") {
        setShowModal(false);
        setTimeout(() => {
          const canvas = document.querySelector("canvas");
          if (canvas && !isPaused) {
            canvas.requestPointerLock();
          }
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused, setShowModal]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 bg-opacity-95 p-10 rounded-3xl shadow-xl max-w-xl w-full text-center text-white">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-6">
          {levelInfo?.title || "Título no disponible"}
        </h1>

        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          {levelInfo?.objective || "Objetivo no disponible"}
        </h2>

        <p className="text-base leading-relaxed text-gray-400 mb-8">
          {levelInfo?.description || "Descripción no disponible"}
        </p>

        <p className="mb-8 text-sm font-semibold text-green-400 italic">
          Presiona "P" y selecciona "Instrucciones" para ver los detalles de
          cada reto.
        </p>

        <p className="text-blue-500 text-lg font-bold animate-blink">
          Presiona "Enter" para continuar...
        </p>
      </div>
    </div>
  );
};

export default InitialInstructionsModal;
