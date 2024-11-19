import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidDiagonal } from "../../../utils/connectionUtils";
import {
  getOppositeCorner,
  lineExists,
  positionPointsSet,
} from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level1Challenge3 = ({
  handleCompleteChallenge,
  updateScore,
  setGlobalMetrics,
  setCurrentMetrics,
  currentMetrics,
  setCurrentMetricsList,
}) => {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [invalidPoint, setInvalidPoint] = useState(null);
  const [completedSets, setCompletedSets] = useState(0);
  const [blockedCorners, setBlockedCorners] = useState([]);

  const gridSize = 5;
  const maxSets = 2;
  const errorLimit = 3;

  // SECTION: Generación de Puntos en una Grilla con Movimiento
  const generatePointsGrid = () => {
    const points = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * 1.8 - (gridSize * 1.8) / 2;
        const y = 3;
        const z = row * 1.8 - (gridSize * 1.8) / 2;
        points.push({
          id: `${col}-${row}`,
          position: [x, y, z],
          baseY: y,
          speed: Math.random() * 0.5 + 0.1,
          amplitude: Math.random() * 0.5 + 0.1,
          connected: false,
        });
      }
    }
    return points;
  };

  const movePoints = (points) => {
    return points.map((point) => {
      const deltaY =
        Math.sin((Date.now() / 200) * point.speed) * point.amplitude;
      return {
        ...point,
        position: [point.position[0], point.baseY + deltaY, point.position[2]],
      };
    });
  };

  useEffect(() => {
    const generatedPoints = generatePointsGrid();
    const positionedPoints = positionPointsSet(generatedPoints, 0.8, 0, -2);
    setPoints(positionedPoints);

    const interval = setInterval(() => {
      setPoints((prevPoints) => movePoints(prevPoints));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // SECTION: Selección de Puntos
  const handleSelectPoint = (point) => {
    const cornerPoints = [
      "0-0",
      `${gridSize - 1}-0`,
      `0-${gridSize - 1}`,
      `${gridSize - 1}-${gridSize - 1}`,
    ];

    if (selectedPoints.length === 0) {
      if (
        !cornerPoints.includes(point.id) ||
        blockedCorners.includes(point.id)
      ) {
        toast.warn("¡Debes comenzar en uno de los extremos no bloqueados!");
        return;
      }
      setSelectedPoints([point]);
      playSuccessSound1();
      return;
    }

    const lastPoint = selectedPoints[selectedPoints.length - 1];
    const oppositeCorner = getOppositeCorner(selectedPoints[0].id, gridSize);

    if (
      !isValidDiagonal(selectedPoints, point, gridSize) ||
      lineExists(lines, lastPoint.position, point.position)
    ) {
      const errorMessage = lineExists(lines, lastPoint.position, point.position)
        ? "Ya existe una línea entre estos puntos."
        : "¡Movimiento no válido, sigue la diagonal!";

      handleError(consecutiveErrors, errorLimit, {
        setConsecutiveErrors,
        setInvalidPoint,
        point,
        setCompletedSets,
        setCurrentMetrics,
        setLines,
        setSelectedPoints,
        setGlobalMetrics,
        currentMetrics,
        updateScore,
        errorMessage,
      });
      return;
    }

    // INFO: Conexión válida entre puntos
    setConsecutiveErrors(0);
    setSelectedPoints((prev) => [...prev, point]);

    if (point.id === oppositeCorner) {
      completeDiagonal(point);
    } else {
      playSuccessSound1();
    }
  };

  // SECTION: Completar el Conjunto Diagonal
  const completeDiagonal = (lastPoint) => {
    const newLines = [...selectedPoints, lastPoint].reduce(
      (acc, point, index, arr) => {
        if (index < arr.length - 1) {
          acc.push({ start: point.position, end: arr[index + 1].position });
        }
        return acc;
      },
      []
    );

    setLines((prev) => [...prev, ...newLines]);
    setBlockedCorners((prev) => [...prev, selectedPoints[0].id, lastPoint.id]);

    completeSet({
      setCompletedSets,
      setSelectedPoints,
      setCurrentMetrics,
      setCurrentMetricsList,
      maxSets,
      completedSets,
      updateScore,
      handleChallengeCompletion,
      handleCompleteChallenge,
    });
  };

  return (
    <>
      {points.map((point) => (
        <mesh
          key={point.id}
          position={point.position}
          onClick={() => handleSelectPoint(point)}
        >
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={
              selectedPoints.some((p) => p.id === point.id)
                ? "green"
                : invalidPoint?.id === point.id
                  ? "red"
                  : "blue"
            }
          />
        </mesh>
      ))}
      <LineRenderLevel1 lines={lines} />
    </>
  );
};

export default Level1Challenge3;
