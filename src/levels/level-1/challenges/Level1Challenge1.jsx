import { useEffect, useState } from "react";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidDistance } from "../../../utils/connectionUtils";
import { lineExists, positionPointsSet } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level1Challenge1 = ({
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
  const maxDistance = 2;

  // SECTION: Generación de Puntos en un Entorno 3D
  const generatePointsGrid = (cols, rows, spacing) => {
    const points = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing - (cols * spacing) / 2;
        const y = 0;
        const z = j * spacing - (rows * spacing) / 2;
        points.push({ id: `${i}-${j}`, position: [x, y, z] });
      }
    }
    return points;
  };

  useEffect(() => {
    const generatedPoints = generatePointsGrid(cols, rows, 1.8);
    const positionedPoints = positionPointsSet(generatedPoints, 0.8, 4, -1);
    setPoints(positionedPoints);
  }, []);

  // SECTION: Selección de Puntos
  const handleSelectPoint = (point) => {
    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];

      // INFO: Validación de errores
      if (
        !isValidDistance(lastPoint.position, point.position, maxDistance) ||
        lineExists(lines, lastPoint.position, point.position)
      ) {
        const errorMessage = lineExists(
          lines,
          lastPoint.position,
          point.position
        )
          ? "Ya existe una línea entre estos puntos."
          : "¡Has alcanzado el límite de errores!";

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
      playSuccessSound1();

      setLines((prev) => [
        ...prev,
        { start: lastPoint.position, end: point.position },
      ]);
    }

    // INFO: Añadir el punto al conjunto actual
    setConsecutiveErrors(0);
    setSelectedPoints((prev) => [...prev, point]);

    // INFO: Completar un Conjunto
    if (selectedPoints.length + 1 === setSize) {
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
    }
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

export default Level1Challenge1;
