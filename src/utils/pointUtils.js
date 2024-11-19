// SECTION: Validación de Conexión entre Puntos
// INFO: Verificación de Existencia de Línea entre 2 Puntos
export const lineExists = (lines, point1, point2) => {
  return lines.some(
    (line) =>
      (line.start === point1 && line.end === point2) ||
      (line.start === point2 && line.end === point1)
  );
};

// INFO: Disposición de Puntos en el Entorno 3D
export const positionPointsSet = (
  points,
  offsetX = 0,
  offsetY = 0,
  offsetZ = 0
) => {
  return points.map((point) => ({
    ...point,
    position: [
      point.position[0] + offsetX,
      point.position[1] + offsetY,
      point.position[2] + offsetZ,
    ],
  }));
};

// INFO: Verificación de si el punto está en el borde
export const isEdgePoint = (point, cols, rows) => {
  const [x, y] = point.id.split("-").map(Number);
  return x === 0 || x === cols - 1 || y === 0 || y === rows - 1;
};

// INFO: Obtención del punto Opuesto Extremo en Diagonal
export const getOppositeCorner = (startPointId, gridSize) => {
  const [startX, startY] = startPointId.split("-").map(Number);
  if (startX === 0 && startY === 0) return `${gridSize - 1}-${gridSize - 1}`;
  if (startX === gridSize - 1 && startY === 0) return `0-${gridSize - 1}`;
  if (startX === 0 && startY === gridSize - 1) return `${gridSize - 1}-0`;
  return `0-0`;
};
