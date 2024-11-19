import { useEffect, useState } from "react";
import LineRenderLevel1 from "../../../components/LineRenderLevel1";
import { completeSet, handleError } from "../../../utils/challengesUtils";
import { handleChallengeCompletion } from "../../../utils/completionUtils";
import { isValidDistance } from "../../../utils/connectionUtils";
import { lineExists } from "../../../utils/pointUtils";
import { playSuccessSound1 } from "../../../utils/soundUtils";

const Level4Challenge2 = ({
  handleCompleteChallenge,
  updateScore,
  setGlobalMetrics,
  setCurrentMetrics,
  currentMetrics,
  setCurrentMetricsList,
}) => {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [completedCubes, setCompletedCubes] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [invalidPoint, setInvalidPoint] = useState(null);

  const errorLimit = 3;
  const maxCubesToWin = 5;
  const maxDistance = 2.5;
  const gridSpacing = 1.5;
  const [cubeGroups, setCubeGroups] = useState([]);

  const generateGridPoints = (rows, cols, depth, spacing, elevation) => {
    const points = [];
    for (let z = 0; z < depth; z++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.push({
            id: `p${x}-${y}-${z}`,
            position: [
              x * spacing - (cols * spacing) / 2,
              elevation + y * spacing,
              z * spacing - spacing,
            ],
          });
        }
      }
    }
    return points;
  };

  const mapCubes = (points) => {
    const rows = 4;
    const cols = 4;
    const cubes = [];

    for (let z = 0; z < 1; z++) {
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          const cube = [
            points.find((p) => p.id === `p${x}-${y}-${z}`),
            points.find((p) => p.id === `p${x + 1}-${y}-${z}`),
            points.find((p) => p.id === `p${x}-${y + 1}-${z}`),
            points.find((p) => p.id === `p${x + 1}-${y + 1}-${z}`),
            points.find((p) => p.id === `p${x}-${y}-${z + 1}`),
            points.find((p) => p.id === `p${x + 1}-${y}-${z + 1}`),
            points.find((p) => p.id === `p${x}-${y + 1}-${z + 1}`),
            points.find((p) => p.id === `p${x + 1}-${y + 1}-${z + 1}`),
          ];
          cubes.push(cube);
        }
      }
    }
    return cubes;
  };

  const initializeChallenge = () => {
    const generatedPoints = generateGridPoints(4, 4, 2, gridSpacing, 1);
    setPoints(generatedPoints);
    const mappedCubes = mapCubes(generatedPoints);
    setCubeGroups(mappedCubes);
    setLines([]);
    setCompletedCubes([]);
    setSelectedPoints([]);
    setConsecutiveErrors(0);
    setInvalidPoint(null);
  };

  useEffect(() => {
    initializeChallenge();
  }, []);

  const isCubeComplete = (cube) => {
    const edges = [
      [cube[0], cube[1]],
      [cube[0], cube[2]],
      [cube[1], cube[3]],
      [cube[2], cube[3]],
      [cube[0], cube[4]],
      [cube[1], cube[5]],
      [cube[2], cube[6]],
      [cube[3], cube[7]],
      [cube[4], cube[5]],
      [cube[4], cube[6]],
      [cube[5], cube[7]],
      [cube[6], cube[7]],
    ];

    return edges.every(([start, end]) =>
      lines.some(
        (line) =>
          (line.start === start.position && line.end === end.position) ||
          (line.start === end.position && line.end === start.position)
      )
    );
  };

  const handleSelectPoint = (point) => {
    if (!point || typeof point.id === "undefined") {
      console.error("Error: El punto seleccionado no es válido.", point);

      handleError(consecutiveErrors, errorLimit, {
        setConsecutiveErrors,
        setInvalidPoint,
        point: null,
        setCompletedSets: setCompletedCubes,
        setCurrentMetrics,
        setLines,
        setSelectedPoints,
        setGlobalMetrics,
        currentMetrics,
        updateScore,
        errorMessage: "Has alcanzado el límite de errores. Reiniciando reto.",
      });

      resetChallenge();
      return;
    }

    if (invalidPoint === point) return;

    if (selectedPoints.length > 0) {
      const lastPoint = selectedPoints[selectedPoints.length - 1];

      if (
        !isValidDistance(lastPoint.position, point.position, maxDistance) ||
        lineExists(lines, lastPoint.position, point.position)
      ) {
        handleError(consecutiveErrors, errorLimit, {
          setConsecutiveErrors,
          setInvalidPoint,
          point,
          setCompletedSets: setCompletedCubes,
          setCurrentMetrics,
          setLines,
          setSelectedPoints,
          setGlobalMetrics,
          currentMetrics,
          updateScore,
          errorMessage:
            "Conexión no válida o ya existe una línea entre estos puntos.",
        });

        if (consecutiveErrors + 1 >= errorLimit) {
          resetChallenge();
        }
        return;
      }

      playSuccessSound1();
      setLines((prev) => [
        ...prev,
        { start: lastPoint.position, end: point.position },
      ]);

      cubeGroups.forEach((cube, index) => {
        if (
          Array.isArray(completedCubes) &&
          !completedCubes.includes(index) &&
          isCubeComplete(cube)
        ) {
          const newCompletedCubes = [...completedCubes, index];
          setCompletedCubes(newCompletedCubes);

          if (newCompletedCubes.length === maxCubesToWin) {
            handleChallengeCompletion(
              handleCompleteChallenge,
              "¡Reto completado con éxito!"
            );
          } else {
            completeSet({
              setCompletedSets: () => setCompletedCubes([...newCompletedCubes]),
              setSelectedPoints,
              setCurrentMetrics,
              setCurrentMetricsList,
              currentMetrics,
              maxSets: maxCubesToWin,
              completedSets: newCompletedCubes.length,
              updateScore,
              handleChallengeCompletion,
              handleCompleteChallenge,
            });
          }
        }
      });
    }

    setSelectedPoints([point]);
  };

  const resetChallenge = () => {
    initializeChallenge();

    setCurrentMetrics((prev) => ({
      ...prev,
      challengeErrors: 0,
      challengeCorrect: 0,
      challengeTotalPoints: 0,
    }));

    setGlobalMetrics((prev) => ({
      ...prev,
      totalErrors: (prev.totalErrors || 0) + (prev.challengeErrors || 0),
    }));

    updateScore("reset");
  };

  return (
    <group rotation={[0, 0, 0]}>
      {points.map((point) => {
        if (!point || !point.id) {
          console.warn("Punto inválido detectado:", point);
          return null;
        }

        return (
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
        );
      })}

      <LineRenderLevel1 lines={lines} />

      {Array.isArray(completedCubes) &&
        completedCubes.map((cubeIndex) => {
          const cube = cubeGroups[cubeIndex];
          const center = [
            (cube[0].position[0] + cube[7].position[0]) / 2,
            (cube[0].position[1] + cube[7].position[1]) / 2,
            (cube[0].position[2] + cube[7].position[2]) / 2,
          ];
          return (
            <mesh key={cubeIndex} position={center}>
              <boxGeometry args={[gridSpacing, gridSpacing, gridSpacing]} />
              <meshStandardMaterial color="cyan" transparent opacity={0.4} />
            </mesh>
          );
        })}
    </group>
  );
};

export default Level4Challenge2;
