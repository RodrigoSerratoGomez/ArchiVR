import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LevelSelection.css";

const LevelSelection = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const navigate = useNavigate();

  const levels = [
    {
      id: 1,
      name: "Nivel 1",
      unlocked: true,
      cardImage: "Nivel-1-Card.jpg",
      bgImage: "Nivel-1-Background.jpg",
    },
    {
      id: 2,
      name: "Nivel 2",
      unlocked: true,
      cardImage: "Nivel-2-Card.jpg",
      bgImage: "Nivel-2-Background.jpg",
    },
    {
      id: 3,
      name: "Nivel 3",
      unlocked: true,
      cardImage: "Nivel-3-Card.jpg",
      bgImage: "Nivel-3-Background.jpg",
    },
    {
      id: 4,
      name: "Nivel 4",
      unlocked: true,
      cardImage: "Nivel-4-Card.jpg",
      bgImage: "Nivel-4-Background.jpg",
    },
  ];

  const getBackgroundImage = () => {
    const level = levels.find((level) => level.id === hoveredLevel);
    return level ? `/images/${level.bgImage}` : null;
  };

  const handleClick = (level) => {
    if (level.unlocked) {
      navigate(`/level${level.id}`);
    } else {
      console.log(`El ${level.name} está bloqueado`);
    }
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white p-5 gap-10"
      style={{
        backgroundImage: hoveredLevel ? `url(${getBackgroundImage()})` : "none",
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {hoveredLevel && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50 z-10"></div>
      )}

      <h1 className="text-4xl font-bold mb-8 z-20">Selecciona un Nivel</h1>

      <div className="level-grid z-20">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-card ${level.unlocked ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundImage: `url(/images/${level.cardImage})` }}
            onMouseEnter={() => setHoveredLevel(level.id)}
            onMouseLeave={() => setHoveredLevel(null)}
            onClick={() => handleClick(level)}
          >
            <span className="text-center">{level.name}</span>
          </div>
        ))}
      </div>

      <button
        className="mt-10 py-2 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 z-20"
        onClick={handleBackToMenu}
      >
        Regresar al Menú Principal
      </button>
    </div>
  );
};

export default LevelSelection;
