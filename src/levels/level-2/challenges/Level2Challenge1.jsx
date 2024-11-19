import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LineRenderLevel2 from "../../../components/LineRenderLevel2";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { lineExists, positionPointsSet } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level2Challenge1 = ({
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

  const squareSize = 10;
  const correctPerSide = 2;
  const distractorPerSide = 2;
  const errorLimit = 3;
  const orderedPoints = Array.from({ length: 12 }, (_, i) => `${i}`);

  const randomOffset = (min, max) => Math.random() * (max - min) + min;

  // SECTION: Generación de puntos con disposición correcta y distractores
  const generateSquarePoints = () => {
    const correctPoints = [];
    const distractorPoints = [];

    const corners = [
      [-squareSize / 2, -squareSize / 2],
      [-squareSize / 2, squareSize / 2],
      [squareSize / 2, squareSize / 2],
      [squareSize / 2, -squareSize / 2],
    ];

    corners.forEach((corner, index) => {
      correctPoints.push({
        id: `${index * 3}`,
        position: [corner[0], 0, corner[1]],
      });

      for (let i = 1; i <= correctPerSide; i++) {
        const factor = i / (correctPerSide + 1);
        let x, z;

        if (index === 0 || index === 2) {
          x = corner[0];
          z = corner[1] + (index === 0 ? 1 : -1) * factor * squareSize;
        } else {
          x = corner[0] + (index === 1 ? 1 : -1) * factor * squareSize;
          z = corner[1];
        }

        correctPoints.push({
          id: `${index * 3 + i}`,
          position: [x, 0, z],
        });
      }

      for (let i = 0; i < distractorPerSide; i++) {
        const factor = (i + 1) / (distractorPerSide + 1);
        let x, z;

        if (index === 0 || index === 2) {
          x = corner[0] + randomOffset(-1, 1);
          z = corner[1] + (index === 0 ? 1 : -1) * factor * squareSize;
        } else {
          x = corner[0] + (index === 1 ? 1 : -1) * factor * squareSize;
          z = corner[1] + randomOffset(-1, 1);
        }

        distractorPoints.push({
          id: `distractor-${index * 2 + i}`,
          position: [x, 0, z],
        });
      }
    });

    return [...correctPoints, ...distractorPoints].sort(
      () => Math.random() - 0.5
    );
  };

  useEffect(() => {
    const generatedPoints = generateSquarePoints();
    const positionedPoints = positionPointsSet(generatedPoints, 0, 0.5, -1);
    setPoints(positionedPoints);
  }, []);

  const handleSelectPoint = (point) => {
    const currentIndex = selectedPoints.length;
    const lastPoint = selectedPoints[selectedPoints.length - 1];

    if (currentIndex === 0 && point.id !== orderedPoints[0]) {
      toast.warn("Por favor, selecciona el punto inicial.");
      setInvalidPoint(point);
      setTimeout(() => setInvalidPoint(null), 1000);
      return;
    }

    if (
      point.id !== orderedPoints[currentIndex] ||
      (selectedPoints.length > 0 &&
        lineExists(lines, lastPoint.position, point.position))
    ) {
      const errorMessage = lineExists(lines, lastPoint.position, point.position)
        ? "Ya existe una línea entre estos puntos."
        : "Conexión inválida o fuera de orden";

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
      setInvalidPoint(point);
      setTimeout(() => setInvalidPoint(null), 1000);
      return;
    }

    playSuccessSound1();

    setLines((prev) => [
      ...prev,
      {
        start: selectedPoints[currentIndex - 1]?.position,
        end: point.position,
      },
    ]);

    setSelectedPoints((prev) => [...prev, point]);

    if (selectedPoints.length + 1 === 12) {
      completeSet({
        setCompletedSets,
        setSelectedPoints,
        setCurrentMetrics,
        setCurrentMetricsList,
        currentMetrics,
        maxSets: 1,
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
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color={
              selectedPoints.includes(point)
                ? "green"
                : point.id === orderedPoints[0]
                  ? "yellow"
                  : point.id === orderedPoints[11]
                    ? "orange"
                    : point.id === invalidPoint?.id
                      ? "red"
                      : "blue"
            }
            transparent={true}
          />
        </mesh>
      ))}
      <LineRenderLevel2 lines={lines} />
    </>
  );
};

export default Level2Challenge1;
