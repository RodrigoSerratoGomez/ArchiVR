import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RotatingMesh from "../components/RotatingMesh";
import { useAuth } from "../context/AuthContext";
import { updateData, getUserData } from "../firebase/firestoreService";
import Loading from "./Loading";

const Settings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [shape, setShape] = useState("cube");
  const [color, setColor] = useState("#ff0000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userAvatar = await getUserData("avatars", currentUser.uid);
        if (userAvatar) {
          setFirstName(userAvatar.firstName);
          setLastName(userAvatar.lastName);
          setNickname(userAvatar.nickname);
          setShape(userAvatar.shape);
          setColor(userAvatar.color);
        }
      } catch (error) {
        toast.error("Error al cargar los datos");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [currentUser]);

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await updateData("avatars", currentUser.uid, {
        firstName,
        lastName,
        nickname,
        shape,
        color,
      });
      toast.success("Datos actualizados con éxito");
      navigate("/");
    } catch (error) {
      toast.error("Error al actualizar los datos");
    }
    setSaving(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8 text-white">
      <h2 className="text-4xl font-bold text-center text-white mb-6">
        Configuración de Avatar
      </h2>

      <div className="w-full max-w-5xl xl:grid xl:grid-cols-2 xl:gap-8 space-y-6 xl:space-y-0">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombres:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Apellidos:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nickname:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Selecciona una Forma:
            </label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="cube">Cubo</option>
              <option value="sphere">Esfera</option>
              <option value="prism">Prisma</option>
              <option value="cylinder">Cilindro</option>
              <option value="tetrahedron">Tetraedro</option>
              <option value="torus">Torus</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Selecciona un Color:
            </label>
            <CirclePicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
              width="100%"
              circleSize={30}
              circleSpacing={10}
              colors={[
                "#f44336",
                "#e91e63",
                "#9c27b0",
                "#673ab7",
                "#3f51b5",
                "#2196f3",
                "#03a9f4",
                "#00bcd4",
                "#009688",
                "#4caf50",
                "#8bc34a",
                "#cddc39",
                "#ffeb3b",
                "#ffc107",
                "#ff9800",
                "#ff5722",
                "#795548",
                "#607d8b",
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-full h-full flex justify-center">
            <Canvas
              shadows
              camera={{ position: [6, 6, 6], fov: 30 }}
              className="h-[10vh] w-full"
            >
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <OrbitControls enableZoom={false} />
              <RotatingMesh shape={shape} color={color} />
            </Canvas>
          </div>

          <div className="w-full flex space-x-4">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
