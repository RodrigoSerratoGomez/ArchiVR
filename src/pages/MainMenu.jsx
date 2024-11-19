import { Canvas } from "@react-three/fiber";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RotatingMesh from "../components/RotatingMesh";
import { getData } from "../firebase/firestoreService";

const MainMenu = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [nickname, setNickname] = useState("");
  const [avatarData, setAvatarData] = useState({
    shape: "",
    color: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const avatars = await getData("avatars");
        const userAvatar = avatars.find(
          (avatar) => avatar.userId === currentUser.uid
        );

        if (userAvatar) {
          setNickname(userAvatar.nickname);
          setAvatarData({ shape: userAvatar.shape, color: userAvatar.color });
        } else {
          console.log("No se encontró avatar para el usuario.");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada con éxito");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <Canvas style={{ width: "90%", height: "90%" }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />
          <RotatingMesh
            shape={avatarData.shape}
            color={avatarData.color}
            scale={[6, 6, 6]}
            position={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-lg gap-6">
        <h1 className="text-6xl font-bold">ArchiVR</h1>

        <div>
          <p className="text-xl font-semibold">¡Bienvenido, {nickname}!</p>

          {currentUser?.email === "admin@usmp.pe" && (
            <p className="text-sm font-semibold">Adminstrador - Rol Docente</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 w-[90%]">
          <button
            onClick={() => navigate("/play")}
            className="w-full py-4 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Jugar
          </button>

          <button
            onClick={() => navigate("/progress")}
            className="w-full py-4 px-4 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
          >
            Progreso
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="w-full py-4 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Configuraciones
          </button>

          {currentUser?.email === "admin@usmp.pe" && (
            <button
              onClick={() => navigate("/feedback")}
              className="w-full py-4 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Retroalimentación
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-4 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
