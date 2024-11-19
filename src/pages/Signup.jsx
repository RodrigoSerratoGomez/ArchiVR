import { useRef, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase/config";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/");
    } catch {
      setError("Error al crear la cuenta");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-white rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold text-center text-blue-500 mb-6">
          ArchiVR
        </h1>
        <h2 className="text-2xl font-bold text-center">Crear Cuenta</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              ref={passwordConfirmRef}
              required
              className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {loading ? "Cargando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <p className="text-gray-400">¿Ya tienes una cuenta?</p>
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-400 hover:underline"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
