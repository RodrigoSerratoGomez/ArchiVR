import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase/config";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch {
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/");
    } catch {
      setError("Error al iniciar sesión");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-white rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold text-center text-blue-500 mb-6">
          ArchiVR
        </h1>
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email:
            </label>
            <input
              type="email"
              ref={emailRef}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Contraseña:
            </label>
            <input
              type="password"
              ref={passwordRef}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <div className="flex items-center justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 mt-4 bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Iniciar Sesión con Google
          </button>
        </div>

        <div className="flex items-center justify-center mt-4">
          <p className="text-gray-400">¿No tienes una cuenta?</p>
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-blue-400 hover:underline"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
