import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLevelMetrics } from "../firebase/firestoreService";
import { getAuth } from "firebase/auth";

const ProgressSelection = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [levels, setLevels] = useState([
    {
      id: 1,
      name: "Nivel 1",
      metrics: { totalPoints: 0, correct: 0, errors: 0, time: 0 },
    },
    {
      id: 2,
      name: "Nivel 2",
      metrics: { totalPoints: 0, correct: 0, errors: 0, time: 0 },
    },
    {
      id: 3,
      name: "Nivel 3",
      metrics: { totalPoints: 0, correct: 0, errors: 0, time: 0 },
    },
    {
      id: 4,
      name: "Nivel 4",
      metrics: { totalPoints: 0, correct: 0, errors: 0, time: 0 },
    },
  ]);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (currentUser) {
        const userProgress = await getLevelMetrics(currentUser.uid);

        const updatedLevels = levels.map((level) => {
          const levelData = userProgress.filter(
            (record) => record.levelId === `level${level.id}`
          );

          const metrics = levelData.reduce(
            (acc, record) => {
              acc.totalPoints += record.globalMetrics.totalPoints || 0;
              acc.correct += record.globalMetrics.correct || 0;
              acc.errors += record.globalMetrics.errors || 0;
              acc.time += record.globalMetrics.time || 0;
              return acc;
            },
            { totalPoints: 0, correct: 0, errors: 0, time: 0 }
          );

          return { ...level, metrics };
        });

        setLevels(updatedLevels);
      }
    };

    fetchProgressData();
  }, [currentUser]);

  const handleLevelClick = (level) => {
    navigate(`/progress/level/${level.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 gap-8">
      <h1 className="text-5xl font-bold mb-8">Progreso</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl">
        {levels.map((level) => (
          <div
            key={level.id}
            onClick={() => handleLevelClick(level)}
            className="p-6 bg-gray-800 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out hover:bg-gray-700"
          >
            <h2 className="text-center text-3xl font-semibold text-gray-300 mb-6">
              {level.name}
            </h2>

            <div className="flex flex-col gap-2">
              {level.metrics.totalPoints === 0 &&
              level.metrics.correct === 0 &&
              level.metrics.errors === 0 ? (
                <div className="text-center text-gray-400">
                  <span role="img" aria-label="no-data" className="text-6xl">
                    📊
                  </span>
                  <p className="mt-4">Sin datos de partidas jugadas</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300">
                      Puntos Totales:
                    </span>

                    <span className="text-cyan-400 font-bold text-xl">
                      {level.metrics.totalPoints}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-300">
                      Tiempo:
                    </span>

                    <span className="text-purple-400 font-bold text-xl">
                      {level.metrics.time}s
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-300">
                      Aciertos:
                    </span>

                    <span className="text-green-400 font-bold text-xl">
                      {level.metrics.correct}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-300">Errores:</span>

                    <span className="text-red-400 font-bold text-xl">
                      {level.metrics.errors}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-10 py-3 px-8 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
      >
        Regresar al Menú Principal
      </button>
    </div>
  );
};

export default ProgressSelection;
