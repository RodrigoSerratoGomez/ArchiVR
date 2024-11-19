import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidZigzag } from "../../../utils/connectionUtils";
import {
  isEdgePoint,
  lineExists,
  positionPointsSet,
} from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level1Challenge2 = ({
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

  const cols = 3;
  const rows = 4;
  const maxSets = Math.max(rows, cols);
  const setSize = Math.max(rows, cols);
  const errorLimit = 3;

  // SECTION: Generación de Puntos en un Patrón Zigzag
  const generatePointsGrid = () => {
    const points = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * 1.8 - (cols * 1.8) / 2;
        const y = Math.random() * 2 - 1;
        const z = row * 1.8 - (rows * 1.8) / 2;
        points.push({
          id: `${col}-${row}`,
          position: [x, y, z],
          connected: false,
        });
      }
    }
    return points;
  };

  useEffect(() => {
    const generatedPoints = generatePointsGrid();
    const positionedPoints = positionPointsSet(generatedPoints, 0.8, 4, -1);
    setPoints(positionedPoints);
  }, []);

  // SECTION: Selección de Puntos
  const handleSelectPoint = (point) => {
    if (selectedPoints.length === 0 && !isEdgePoint(point, cols, rows)) {
      toast.warn("El primer punto debe estar en el borde.");
      return;
    }

    // INFO: Validación de errores
    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];
      const errorMessage = !isValidZigzag(selectedPoints, point)
        ? "Este punto no es parte de un zigzag."
        : lineExists(lines, lastPoint.position, point.position)
          ? "Ya existe una línea entre estos puntos."
          : null;

      if (errorMessage) {
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
    }

    // INFO: Conexión válida entre puntos
    playSuccessSound1();
    setConsecutiveErrors(0);
    setSelectedPoints((prev) => [...prev, point]);

    // INFO: Completar un Conjunto
    if (selectedPoints.length + 1 === setSize) {
      completeZigzag(point);
    }
  };

  // SECTION: Completar un Conjunto de Zigzag
  const completeZigzag = (lastPoint) => {
    // INFO: Generar líneas para el zigzag
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

    completeSet({
      setCompletedSets,
      setSelectedPoints,
      setCurrentMetrics,
      setCurrentMetricsList,
      currentMetrics,
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
              selectedPoints.includes(point)
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

export default Level1Challenge2;
