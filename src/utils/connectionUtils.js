// SECTION: Validación de Distancia Entre Puntos
// INFO: Verificación de Distancia Máxima Permitida
export const isValidDistance = (point1, point2, maxDistance) => {
  const distance = Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) +
      Math.pow(point1[1] - point2[1], 2) +
      Math.pow(point1[2] - point2[2], 2)
  );
  return distance <= maxDistance;
};

// INFO: Validación de Conexión Zigzag
export const isValidZigzag = (selectedPoints, point) => {
  const [x, y] = point.id.split("-").map(Number);
  const lastPoint = selectedPoints[selectedPoints.length - 1];
  const [lastX, lastY] = lastPoint.id.split("-").map(Number);

  return (
    Math.abs(lastX - x) === 1 &&
    Math.abs(lastY - y) === 1 &&
    (selectedPoints.length === 1 ||
      !selectedPoints.some((p) => p.id === point.id))
  );
};

// INFO: Validación de Conexión Diagonal
export const isValidDiagonal = (selectedPoints, point, gridSize) => {
  const [x, y] = point.id.split("-").map(Number);
  const startPoint = selectedPoints[0];
  const [startX, startY] = startPoint.id.split("-").map(Number);
  const [lastX, lastY] = selectedPoints[selectedPoints.length - 1].id
    .split("-")
    .map(Number);

  const isDiagonalAdjacent =
    Math.abs(lastX - x) === 1 &&
    Math.abs(lastY - y) === 1 &&
    !selectedPoints.some((p) => p.id === point.id);

  const isOnPathToOppositeCorner =
    (startX === startY && x === y) ||
    (startX + startY === gridSize - 1 && x + y === gridSize - 1);

  return isDiagonalAdjacent && isOnPathToOppositeCorner;
};
