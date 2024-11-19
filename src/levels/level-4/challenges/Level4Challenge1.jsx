import { useEffect, useState } from "react";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidDistance } from "../../../utils/connectionUtils";
import { lineExists, positionPointsSet } from "../../../utils/pointUtils";
import { playErrorSound1, playSuccessSound1 } from "../../../utils/soundUtils";

const Level4Challenge1 = ({
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
  const [completedSets, setCompletedSets] = useState(0);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [invalidPoint, setInvalidPoint] = useState(null);
  const [showCube, setShowCube] = useState(false);

  const errorLimit = 2;
  const maxSets = 12;
  const maxDistance = 2;

  const generateCubePoints = (size, elevation) => {
    const offset = size / 2;
    return [
      { id: "p1", position: [-offset, elevation, -offset] },
      { id: "p2", position: [offset, elevation, -offset] },
      { id: "p3", position: [-offset, elevation, offset] },
      { id: "p4", position: [offset, elevation, offset] },
      { id: "p5", position: [-offset, elevation + size, -offset] },
      { id: "p6", position: [offset, elevation + size, -offset] },
      { id: "p7", position: [-offset, elevation + size, offset] },
      { id: "p8", position: [offset, elevation + size, offset] },
    ];
  };

  useEffect(() => {
    const generatedPoints = generateCubePoints(2, 1);
    const positionedPoints = positionPointsSet(generatedPoints, 0, 0, 0);
    setPoints(positionedPoints);
  }, []);

  const resetChallenge = () => {
    setConsecutiveErrors(0);
    setSelectedPoints([]);
    setLines([]);
    setCompletedSets(0);
    setShowCube(false);
    setCurrentMetrics((prevMetrics) => ({
      ...prevMetrics,
      errors: 0,
      correct: 0,
      totalPoints: 0,
    }));
  };

  const handleSelectPoint = (point) => {
    if (invalidPoint === point) return;

    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];

      if (
        !isValidDistance(lastPoint.position, point.position, maxDistance) ||
        lineExists(lines, lastPoint.position, point.position)
      ) {
        playErrorSound1();
        handleError(consecutiveErrors, errorLimit, {
          setConsecutiveErrors,
          setInvalidPoint,
          point,
          setSelectedPoints,
          setCurrentMetrics,
          setGlobalMetrics,
          currentMetrics,
          updateScore,
          errorMessage:
            "Conexión no válida o ya existe una línea entre estos puntos.",
        });

        if (consecutiveErrors + 1 >= errorLimit) resetChallenge();
        return;
      }

      playSuccessSound1();
      setLines((prev) => [
        ...prev,
        { start: lastPoint.position, end: point.position },
      ]);

      setSelectedPoints([]);
      setConsecutiveErrors(0);

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

      if (completedSets + 1 === maxSets) {
        setShowCube(true);
      }
    } else {
      setSelectedPoints([point]);
    }
  };

  return (
    <group rotation={[0, 0, 0]}>
      {points.map((point) => (
        <mesh
          key={point.id}
          position={point.position}
          onClick={() => handleSelectPoint(point)}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
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

      {showCube && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="cyan" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
};

export default Level4Challenge1;
