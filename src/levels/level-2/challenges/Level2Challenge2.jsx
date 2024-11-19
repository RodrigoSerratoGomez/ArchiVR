import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LineRenderLevel2 from "../../../components/LineRenderLevel2";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { positionPointsSet } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level2Challenge2 = ({
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

  const maxSets = 4;
  const squareSize = 4;
  const pointsPerPlane = 4;
  const distractorCountPerPlane = 4;
  const levelHeights = [1, 3, 5, 7];
  const errorLimit = 3;

  const randomOffset = (min, max) => Math.random() * (max - min) + min;

  const generatePlanesWithDistractors = () => {
    const correctPoints = [];
    const distractorPoints = [];

    levelHeights.forEach((height, levelIndex) => {
      const rotationAngle = (Math.random() * Math.PI) / 2;
      for (let i = 0; i < pointsPerPlane; i++) {
        const x = ((i % 2 === 0 ? -1 : 1) * squareSize) / 2;
        const z = ((i < 2 ? -1 : 1) * squareSize) / 2;
        const rotatedX =
          x * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
        const rotatedZ =
          x * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);

        correctPoints.push({
          id: `correct-${levelIndex}-${i}`,
          position: [rotatedX, height, rotatedZ],
          isStartingPoint: i === 0,
        });
      }

      for (let i = 0; i < distractorCountPerPlane; i++) {
        const distractorHeight =
          height +
          (Math.random() < 0.5 ? randomOffset(-1, -0.5) : randomOffset(0.5, 1));
        distractorPoints.push({
          id: `distractor-${levelIndex}-${i}`,
          position: [
            (Math.random() - 0.5) * squareSize,
            distractorHeight,
            (Math.random() - 0.5) * squareSize,
          ],
        });
      }
    });

    return [...correctPoints, ...distractorPoints];
  };

  useEffect(() => {
    const generatedPoints = generatePlanesWithDistractors();
    const positionedPoints = positionPointsSet(generatedPoints, 0, 0.5, -3.5);
    setPoints(positionedPoints);
  }, []);
  const handleSelectPoint = (point) => {
    const currentIndex = selectedPoints.length;
    const currentLevel = selectedPoints[0]?.id.split("-")[1];
    const pointLevel = point.id.split("-")[1];

    if (currentIndex === 0 && point.isStartingPoint) {
      setSelectedPoints([point]);
      return;
    }

    if (currentIndex === 0 && !point.isStartingPoint) {
      toast.warn("Inicia con el punto amarillo del plano.");
      setInvalidPoint(point);
      setTimeout(() => setInvalidPoint(null), 1000);
      return;
    }

    if (currentLevel !== pointLevel || !point.id.startsWith("correct")) {
      const errorMessage = "Conexión inválida o fuera del plano.";
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

    if (selectedPoints.length === pointsPerPlane) {
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
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color={
              selectedPoints.includes(point)
                ? "green"
                : point.isStartingPoint
                  ? "yellow"
                  : invalidPoint?.id === point.id
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

export default Level2Challenge2;
