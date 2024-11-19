import { useEffect, useState } from "react";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";
import PlaneRenderLevel3 from "../../../components/PlaneRenderLevel3";

const Level3Challenge2 = ({
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
  const [planes, setPlanes] = useState([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [invalidPoint, setInvalidPoint] = useState(null);
  const [currentSequence, setCurrentSequence] = useState(null);
  const errorLimit = 3;
  const PLANE_THICKNESS = 0.3;

  const planeSequences = {
    PLANO1: ["p01", "p02", "p09", "p08"],
    PLANO2: ["p03", "p04", "p11", "p10"],
    PLANO3: ["p04", "p11", "p12", "p05"],
    PLANO4: ["p06", "p13", "p14", "p07"],
  };

  const generateAllPoints = () => {
    return [
      { id: "p01", position: [0.5, 0.5, 2.0] },
      { id: "p02", position: [0.5, 2.5, 4.0] },
      { id: "p03", position: [0.5, 4.0, 4.0] },
      { id: "p04", position: [0.5, 6.0, 0.0] },
      { id: "p05", position: [0.5, 4.0, -4.0] },
      { id: "p06", position: [0.5, 2.5, -4.0] },
      { id: "p07", position: [0.5, 0.5, -2.0] },

      { id: "p08", position: [8.0, 0.5, 2.0] },
      { id: "p09", position: [8.0, 2.5, 4.0] },
      { id: "p10", position: [8.0, 4.0, 4.0] },
      { id: "p11", position: [8.0, 6.0, 0.0] },
      { id: "p12", position: [8.0, 4.0, -4.0] },
      { id: "p13", position: [8.0, 2.5, -4.0] },
      { id: "p14", position: [8.0, 0.5, -2.0] },

      { id: "d1", position: [0.5, 0.5, 4.0] },
      { id: "d2", position: [0.5, 6.0, 4.0] },
      { id: "d3", position: [0.5, 0.5, -4.0] },
      { id: "d4", position: [0.5, 6.0, -4.0] },
      { id: "d5", position: [8.0, 0.5, 4.0] },
      { id: "d6", position: [8.0, 6.0, 4.0] },
      { id: "d7", position: [8.0, 0.5, -4.0] },
      { id: "d8", position: [8.0, 6.0, -4.0] },
    ];
  };

  const resetChallenge = () => {
    setConsecutiveErrors(0);
    setSelectedPoints([]);
    setPlanes([]);
    setCurrentSequence(null);
    setInvalidPoint(null);
  };

  const determineSequenceFromPoint = (firstPointId) => {
    for (const plane in planeSequences) {
      const sequence = planeSequences[plane];
      const index = sequence.indexOf(firstPointId);
      if (index !== -1) {
        const clockwiseSequence = [
          ...sequence.slice(index),
          ...sequence.slice(0, index),
        ];
        const counterClockwiseSequence = [
          ...sequence.slice(index).reverse(),
          ...sequence.slice(0, index).reverse(),
        ];
        return { clockwiseSequence, counterClockwiseSequence };
      }
    }
    return null;
  };

  useEffect(() => {
    const allPoints = generateAllPoints();
    setPoints(allPoints);
  }, []);

  const handleSelectPoint = (point) => {
    if (invalidPoint === point) return;

    if (point.id.startsWith("d")) {
      const errorHandled = handleError(consecutiveErrors, errorLimit, {
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
        errorMessage: "Punto incorrecto seleccionado.",
      });

      if (errorHandled) resetChallenge();

      return;
    }

    if (selectedPoints.length === 0) {
      const sequences = determineSequenceFromPoint(point.id);
      if (!sequences) {
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
          errorMessage: "Punto no válido para iniciar el plano.",
        });
        return;
      }
      setCurrentSequence(sequences);
      setSelectedPoints([point]);
      return;
    }

    const lastPoint = selectedPoints[selectedPoints.length - 1];
    const { clockwiseSequence, counterClockwiseSequence } = currentSequence;

    const lastPointClockwiseIndex = clockwiseSequence.indexOf(lastPoint.id);
    const lastPointCounterClockwiseIndex = counterClockwiseSequence.indexOf(
      lastPoint.id
    );

    const nextClockwisePointId =
      clockwiseSequence[
        (lastPointClockwiseIndex + 1) % clockwiseSequence.length
      ];
    const nextCounterClockwisePointId =
      counterClockwiseSequence[
        (lastPointCounterClockwiseIndex + 1) % counterClockwiseSequence.length
      ];

    if (
      point.id !== nextClockwisePointId &&
      point.id !== nextCounterClockwisePointId
    ) {
      const errorHandled = handleError(consecutiveErrors, errorLimit, {
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
        errorMessage: "Selección fuera de secuencia.",
      });

      if (errorHandled) resetChallenge();

      return;
    }

    playSuccessSound1();
    setSelectedPoints((prev) => [...prev, point]);

    if (selectedPoints.length + 1 === 4) {
      const newPlane = [
        ...selectedPoints.map((p) => p.position),
        point.position,
      ];

      const validPlane = newPlane.every(
        (p) => Array.isArray(p) && p.length === 3
      );

      if (validPlane) {
        setPlanes((prev) => [...prev, newPlane]);
      } else {
        console.error("Invalid planePoints detected:", newPlane);
      }

      completeSet({
        setCompletedSets: () => {},
        setSelectedPoints,
        setCurrentMetrics,
        setCurrentMetricsList,
        currentMetrics,
        maxSets: 4,
        completedSets: planes.length,
        updateScore,
        handleChallengeCompletion,
        handleCompleteChallenge,
      });

      setSelectedPoints([]);
      setCurrentSequence(null);
    }
  };

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
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

      {lines.map((line, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={new Float32Array([...line.start, ...line.end])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="cyan" />
        </line>
      ))}

      <PlaneRenderLevel3 planes={planes} planeThickness={PLANE_THICKNESS} />
    </group>
  );
};

export default Level3Challenge2;
