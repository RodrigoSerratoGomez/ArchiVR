import { useEffect, useState } from "react";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { positionPointsSet } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";
import PlaneRenderLevel3 from "../../../components/PlaneRenderLevel3";

const Level3Challenge1 = ({
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
  const maxSets = 4;
  const PLANE_THICKNESS = 0.05;

  const planeSequences = {
    floor: ["floor1", "floor2", "floor4", "floor3"],
    ceilingLow: ["ceilingLow1", "ceilingLow2", "ceilingLow4", "ceilingLow3"],
    ceilingMedium: [
      "ceilingMedium1",
      "ceilingMedium2",
      "ceilingMedium4",
      "ceilingMedium3",
    ],
    ceilingHigh: [
      "ceilingHigh1",
      "ceilingHigh2",
      "ceilingHigh4",
      "ceilingHigh3",
    ],
  };

  const generateAllPoints = () => {
    const floorLength = 9;
    const floorWidth = 3;

    return [
      { id: "floor1", position: [0, 0, 0] },
      { id: "floor2", position: [floorWidth, 0, 0] },
      { id: "floor3", position: [0, 0, floorLength] },
      { id: "floor4", position: [floorWidth, 0, floorLength] },

      { id: "ceilingLow1", position: [0, 2.5, 0] },
      { id: "ceilingLow2", position: [3, 2.5, 0] },
      { id: "ceilingLow3", position: [0, 2.5, 3] },
      { id: "ceilingLow4", position: [3, 2.5, 3] },

      { id: "ceilingMedium1", position: [0, 3, 3] },
      { id: "ceilingMedium2", position: [3, 3, 3] },
      { id: "ceilingMedium3", position: [0, 3, 6] },
      { id: "ceilingMedium4", position: [3, 3, 6] },

      { id: "ceilingHigh1", position: [0, 4.5, 6] },
      { id: "ceilingHigh2", position: [3, 4.5, 6] },
      { id: "ceilingHigh3", position: [0, 4.5, 9] },
      { id: "ceilingHigh4", position: [3, 4.5, 9] },
    ];
  };

  const determineSequencesFromPoint = (firstPointId) => {
    for (const sequenceKey in planeSequences) {
      const sequence = planeSequences[sequenceKey];
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
    const positionedPoints = positionPointsSet(allPoints, 0, 0.5, -5);
    setPoints(positionedPoints);
  }, []);

  const handleSelectPoint = (point) => {
    if (invalidPoint === point) return;

    if (selectedPoints.length === 0) {
      const sequences = determineSequencesFromPoint(point.id);
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
        errorMessage: "Selección fuera de secuencia.",
      });
      return;
    }

    playSuccessSound1();
    setSelectedPoints((prev) => [...prev, point]);

    if (selectedPoints.length + 1 === 4) {
      const newPlane = [
        ...selectedPoints.map((p) => p.position),
        point.position,
      ];
      setPlanes((prev) => [...prev, newPlane]);

      completeSet({
        setCompletedSets: () => {},
        setSelectedPoints,
        setCurrentMetrics,
        setCurrentMetricsList,
        currentMetrics,
        maxSets,
        completedSets: planes.length,
        updateScore,
        handleChallengeCompletion,
        handleCompleteChallenge,
      });
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

export default Level3Challenge1;
