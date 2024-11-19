import { useEffect, useRef, useState } from "react";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { lineExists } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level1Challenge5 = ({
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
  const [lastSelectedPoint, setLastSelectedPoint] = useState(null);
  const [invalidPoint, setInvalidPoint] = useState(null);

  const groupRef = useRef();
  const errorLimit = 5;
  const totalLevels = 8;
  const positionsPerLevel = 7;
  const distractorsPerLevelMin = 4;
  const distractorsPerLevelMax = 6;
  const levelHeight = 1.5;
  const radius = 2.5;
  const minDistance = 0.5;
  const helpPoints = 2;

  // SECTION: Generación y Disposición de Puntos en una Espiral
  const generateSpiralPointsWithDistractors = () => {
    const points = [];
    for (let level = 0; level < totalLevels; level++) {
      const correctIndex = level % positionsPerLevel;
      const correctAngle = (2 * Math.PI * correctIndex) / positionsPerLevel;
      const correctX = radius * Math.cos(correctAngle);
      const correctY = level * levelHeight;
      const correctZ = radius * Math.sin(correctAngle);
      points.push({
        id: `level-${level}-point-correct`,
        position: [correctX, correctY, correctZ],
        connected: false,
        isCorrect: true,
        level,
      });

      const distractorCount =
        Math.floor(
          Math.random() * (distractorsPerLevelMax - distractorsPerLevelMin + 1)
        ) + distractorsPerLevelMin;

      for (let i = 0; i < distractorCount; i++) {
        let validPosition = false;
        let distractorX, distractorY, distractorZ;

        while (!validPosition) {
          const distractorAngle = 2 * Math.PI * Math.random();
          distractorX = radius * Math.cos(distractorAngle);
          distractorY = level * levelHeight;
          distractorZ = radius * Math.sin(distractorAngle);

          validPosition = points
            .filter((p) => p.level === level)
            .every((existingPoint) => {
              const [existingX, existingY, existingZ] = existingPoint.position;
              const distance = Math.sqrt(
                Math.pow(distractorX - existingX, 2) +
                  Math.pow(distractorY - existingY, 2) +
                  Math.pow(distractorZ - existingZ, 2)
              );
              return distance >= minDistance;
            });
        }

        points.push({
          id: `level-${level}-distractor-${i}`,
          position: [distractorX, distractorY, distractorZ],
          connected: false,
          isCorrect: false,
          level,
        });
      }
    }
    return points;
  };

  useEffect(() => {
    const generatedPoints = generateSpiralPointsWithDistractors();
    setPoints(generatedPoints);
  }, []);

  // SECTION: Validación de Puntos
  const validatePointSelection = (point) => {
    const lastPoint = selectedPoints[selectedPoints.length - 1];

    if (point.connected) {
      return { valid: false, message: "¡Este punto ya está conectado!" };
    }
    if (!point.isCorrect) {
      return { valid: false, message: "¡Punto incorrecto seleccionado!" };
    }
    if (selectedPoints.length > 0) {
      const expectedNextLevel = lastPoint.level + 1;
      if (point.level !== expectedNextLevel) {
        return {
          valid: false,
          message: "¡Debes conectar los puntos en orden de nivel!",
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
    const { valid, message } = validatePointSelection(point);

    if (!valid) {
      handleError(consecutiveErrors, errorLimit, {
        setConsecutiveErrors,
        setInvalidPoint,
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

    if (selectedPoints.length + 1 === totalLevels) {
      completeSet({
        setCompletedSets: () => {},
        setSelectedPoints,
        setCurrentMetrics,
        setCurrentMetricsList,
        maxSets: totalLevels,
        completedSets: selectedPoints.length,
        updateScore,
        handleChallengeCompletion,
        handleCompleteChallenge,
      });
    }
  };

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      {points.map((point) => (
        <mesh
          key={point.id}
          position={point.position}
          onClick={() => handleSelectPoint(point)}
        >
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={
              invalidPoint && invalidPoint.id === point.id
                ? "red"
                : lastSelectedPoint && lastSelectedPoint.id === point.id
                  ? "green"
                  : point.isCorrect &&
                      point.level < helpPoints &&
                      !selectedPoints.includes(point)
                    ? "yellow"
                    : "blue"
            }
          />
        </mesh>
      ))}
      <LineRenderLevel1 lines={lines} />
    </group>
  );
};

export default Level1Challenge5;
