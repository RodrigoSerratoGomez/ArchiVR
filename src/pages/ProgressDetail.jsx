import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMetrics } from "../firebase/firestoreService";

const ProgressDetail = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [metricsData, setMetricsData] = useState([]);
  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (currentUser) {
        const data = await getMetrics(
          "levelMetrics",
          currentUser.uid,
          `level${levelId}`
        );
        setMetricsData(data);
      }
    };

    fetchMetrics();
  }, [levelId, currentUser]);

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const instructionsData = await import(
          `../instructions/level${levelId}-instructions.json`
        );
        setInstructions(instructionsData.default);
      } catch (error) {
        console.error("Error al cargar las instrucciones:", error);
      }
    };

    loadInstructions();
  }, [levelId]);

  const getChallengeTitle = (challengeId) => {
    if (instructions) {
      const challenge = instructions.challenges.find(
        (ch) => ch.challengeId === challengeId
      );
      return challenge ? challenge.title : `Reto ${challengeId}`;
    }
    return `Reto ${challengeId}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800 h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
        Detalles de Progreso - Nivel {levelId}
      </h1>

      <div className="w-full max-w-3xl sm:max-w-5xl">
        {metricsData.length > 0 ? (
          metricsData.map((game, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-lg mb-4 hover:shadow-xl transition duration-300"
            >
              <details className="cursor-pointer group">
                <summary className="flex flex-col bg-gray-700 rounded-t-lg p-4">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center">
                    <span className="text-2xl font-semibold">
                      PARTIDA N°{index + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 text-sm sm:text-base">
                        {new Date(game.completedAt).toLocaleString()}
                      </span>

                      <span className="text-gray-400 text-lg transform group-open:rotate-180 transition-transform duration-300">
                        ▼
                      </span>
                    </div>
                  </div>

                  <hr className="mt-2 mb-4 border-gray-600" />

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-300 font-semibold">
                        Puntos Totales:
                      </span>

                      <span className="text-cyan-400 font-bold text-xl">
                        {game.globalMetrics.totalPoints}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-green-300 font-semibold">
                        Aciertos:
                      </span>

                      <span className="text-green-400 font-bold text-xl">
                        {game.globalMetrics.correct}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-red-300 font-semibold">
                        Errores:
                      </span>

                      <span className="text-red-400 font-bold text-xl">
                        {game.globalMetrics.errors}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-purple-300 font-semibold">
                        Tiempo:
                      </span>

                      <span className="text-purple-400 font-bold text-xl">
                        {game.globalMetrics.time}s
                      </span>
                    </div>
                  </div>
                </summary>

                <div className="p-4 bg-gray-700 rounded-b-lg">
                  {game.currentMetricsList.map((challenge, idx) => (
                    <div key={idx} className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {getChallengeTitle(
                          parseInt(challenge.id.split("challenge")[1])
                        )}
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <span className="text-cyan-300 font-medium">
                            Puntos:
                          </span>

                          <span className="block text-cyan-400 font-bold">
                            {challenge.challengeTotalPoints}
                          </span>
                        </div>

                        <div>
                          <span className="text-green-300 font-medium">
                            Aciertos:
                          </span>

                          <span className="block text-green-400 font-bold">
                            {challenge.challengeCorrect}
                          </span>
                        </div>

                        <div>
                          <span className="text-red-300 font-medium">
                            Errores:
                          </span>

                          <span className="block text-red-400 font-bold">
                            {challenge.challengeErrors}
                          </span>
                        </div>

                        <div>
                          <span className="text-purple-300 font-medium">
                            Tiempo:
                          </span>

                          <span className="block text-purple-400 font-bold">
                            {challenge.challengeTime}s
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <span role="img" aria-label="No data" className="text-6xl">
              📭
            </span>

            <p className="text-lg sm:text-xl text-gray-300">
              No hay datos disponibles para este nivel.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-5xl justify-center">
        <button
          onClick={() => navigate("/progress")}
          className="py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Regresar a Progreso
        </button>

        <button
          onClick={() => navigate("/")}
          className="py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Regresar al Menú Principal
        </button>
      </div>
    </div>
  );
};

export default ProgressDetail;
