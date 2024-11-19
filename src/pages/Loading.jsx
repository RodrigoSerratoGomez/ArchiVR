import "../styles/Loading.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="loader mb-4"></div>
        <p className="text-lg font-semibold animate-pulse">Cargando...</p>
      </div>
    </div>
  );
};

export default Loading;
