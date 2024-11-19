import { useEffect, useState } from "react";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidDistance } from "../../../utils/connectionUtils";
import { lineExists, positionPointsSet } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level1Challenge4 = ({
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
  const [incorrectPoint, setIncorrectPoint] = useState(null);
  const [lastSelectedPoint, setLastSelectedPoint] = useState(null);

  const errorLimit = 3;
  const maxDistance = 3;
  const totalPoints = 8;

  // SECTION: Generación y Disposición de Puntos en un Arco
  const generatePointsArc = () => {
    const points = [];
    const radius = 5;
    const angleInclination = Math.PI / -4;

    for (let i = 0; i < totalPoints; i++) {
      const angle = -(Math.PI * i) / (totalPoints - 1);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) * Math.sin(angleInclination);
      const z = radius * Math.sin(angle) * Math.cos(angleInclination);
      points.push({
        id: `point-${i}`,
        position: [x, y, z],
        connected: false,
      });
    }
    return points;
  };

  useEffect(() => {
    const generatedPoints = generatePointsArc();
    const positionedPoints = positionPointsSet(generatedPoints, 0, 2, -1);
    setPoints(positionedPoints);
  }, []);

  // SECTION: Validación de Selección de Puntos
  const validateSelection = (point) => {
    if (point.connected) {
      return { valid: false, message: "¡Este punto ya está conectado!" };
    }

    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];
      const expectedNextId = `point-${selectedPoints.length}`;

      if (point.id !== expectedNextId) {
        return {
          valid: false,
          message: "¡Debes conectar los puntos en orden!",
        };
      }

      if (!isValidDistance(lastPoint.position, point.position, maxDistance)) {
        return {
          valid: false,
          message: "¡La distancia entre puntos es demasiado grande!",
        };
      }

      if (lineExists(lines, lastPoint.position, point.position)) {
        return {
          valid: false,
          message: "Ya existe una línea entre estos puntos.",
        };
      }
    }

    return { valid: true, message: "" };
  };

  // SECTION: Selección de Puntos
  const handleSelectPoint = (point) => {
    const { valid, message } = validateSelection(point);

    if (!valid) {
      handleError(consecutiveErrors, errorLimit, {
        setConsecutiveErrors,
        setInvalidPoint: setIncorrectPoint,
        point,
        setCompletedSets: () => {},
        setCurrentMetrics,
        setLines,
        setSelectedPoints,
        setGlobalMetrics,
        currentMetrics,
        updateScore,
        errorMessage: message,
      });
      return;
    }

    playSuccessSound1();
    setConsecutiveErrors(0);
    setSelectedPoints((prev) => [...prev, point]);
    setLastSelectedPoint(point);

    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];
      setLines((prev) => [
        ...prev,
        { start: lastPoint.position, end: point.position },
      ]);
    }

    if (selectedPoints.length + 1 === totalPoints) {
      completeSet({
        setCompletedSets: () => {},
        setSelectedPoints,
        setCurrentMetrics,
        setCurrentMetricsList,
        maxSets: totalPoints,
        completedSets: selectedPoints.length,
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
              incorrectPoint && incorrectPoint.id === point.id
                ? "red"
                : lastSelectedPoint && lastSelectedPoint.id === point.id
                  ? "green"
                  : point.id === "point-0" && !selectedPoints.includes(point)
                    ? "yellow"
                    : "blue"
            }
          />
        </mesh>
      ))}
      <LineRenderLevel1 lines={lines} />
    </>
  );
};

export default Level1Challenge4;
