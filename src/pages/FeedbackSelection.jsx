import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersFromLevelMetrics } from "../firebase/feedbackService";

const FeedbackSelection = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Obtener usuarios de la colección levelMetrics
        const users = await getUsersFromLevelMetrics();

        if (users.length === 0) {
          console.warn("No se encontraron usuarios con métricas registradas.");
          setStudents([]);
          return;
        }

        // Estructurar los datos para FeedbackSelection
        const formattedUsers = users.map((user) => ({
          id: user.id,
          fullName:
            user.firstName + " " + user.lastName || "Nombre no disponible",
          nickname: user.nickname || "Sin nickname",
          feedbackStatus: user.hasFeedback ? "Realizada" : "Pendiente",
        }));

        setStudents(formattedUsers);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentClick = (student) => {
    navigate(`/feedback/${student.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4 sm:p-6 overflow-y-auto">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
        Gestión de Retroalimentación
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xl text-gray-300">Cargando usuarios...</span>
        </div>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className="p-6 bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition duration-300 hover:bg-gray-700"
            >
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                {student.fullName}
              </h2>
              <p className="text-lg text-cyan-300 font-medium mb-2">
                Nickname: {student.nickname}
              </p>
              <p
                className={`text-lg font-semibold ${
                  student.feedbackStatus === "Realizada"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                Retroalimentación: {student.feedbackStatus}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <span role="img" aria-label="No data" className="text-6xl mb-4">
            📭
          </span>
          <p className="text-lg sm:text-xl text-gray-300">
            No hay alumnos registrados actualmente.
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-10 py-3 px-8 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300"
      >
        Regresar al Menú Principal
      </button>
    </div>
  );
};

export default FeedbackSelection;
