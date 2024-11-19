import { toast } from "react-toastify";

// SECTION: Función para inicializar las métricas a nivel de juego
export const initializeLevelMetrics = (levelName) => {
  return {
    levelName: levelName || "Sin nombre",
    correct: 0,
    errors: 0,
    time: 0,
    totalPoints: 0,
    startTime: new Date().toISOString(),
    endTime: null,
  };
};

// SECTION: Modelo estático de referencia para las métricas de los retos
export const metricsTemplate = {
  id: null,
  challengeCorrect: 0,
  challengeErrors: 0,
  challengeTime: 0,
  challengeTotalPoints: 0,
};

// SECTION: Función para inicializar las métricas del reto a partir del template
export const initializeMetrics = (challengeId) => {
  return {
    ...metricsTemplate,
    id: challengeId,
  };
};

// SECTION: Función para actualizar las métricas globales
export const updateGlobalMetrics = (type, setGlobalMetrics) => {
  setGlobalMetrics((prev) => {
    const updatedMetrics = { ...prev };

    if (type === "correct") {
      updatedMetrics.correct += 1;
      updatedMetrics.totalPoints += 10;
    } else if (type === "error") {
      updatedMetrics.errors += 1;
      updatedMetrics.totalPoints = Math.max(updatedMetrics.totalPoints - 5, 0);
    } else {
      return prev;
    }

    return updatedMetrics;
  });
};

// SECTION: Función para actualizar las métricas de un reto
export const updateCurrentMetrics = (type, setCurrentMetrics, errorLimit) => {
  setCurrentMetrics((prev) => {
    const updatedMetrics = { ...prev };

    if (type === "correct") {
      updatedMetrics.challengeCorrect += 1;
      updatedMetrics.challengeTotalPoints += 10;
    } else if (type === "error") {
      updatedMetrics.challengeErrors += 1;
      updatedMetrics.challengeTotalPoints = Math.max(
        updatedMetrics.challengeTotalPoints - 5,
        0
      );
    }

    console.log("Métricas del reto actual:", updatedMetrics);
    return updatedMetrics;
  });
};

// SECTION: Función para actualizar métricas globales y actuales
export const updateScoreMetrics = (
  type,
  setGlobalMetrics,
  setCurrentMetrics
) => {
  updateGlobalMetrics(type, setGlobalMetrics);
  updateCurrentMetrics(type, setCurrentMetrics);
};

// SECTION: Función para resetear un reto
export const resetChallenge = (
  challengeId,
  setCompletedSets,
  setConsecutiveErrors,
  setCurrentMetrics,
  setLines,
  setSelectedPoints,
  setGlobalMetrics
) => {
  setCompletedSets(0);
  setConsecutiveErrors(0);
  setLines([]);
  setSelectedPoints([]);

  setGlobalMetrics((prevGlobalMetrics) => ({
    ...prevGlobalMetrics,
    totalPoints: 0,
  }));

  setCurrentMetrics((prevCurrentMetrics) => ({
    ...prevCurrentMetrics,
    id: challengeId,
    challengeTotalPoints: 0,
  }));

  toast.warn("El reto se ha reiniciado.");
};

// SECTION: Función para reiniciar un conjunto
export const resetSet = (
  setConsecutiveErrors,
  setSelectedPoints,
  setLastSelectedPoint = null
) => {
  setConsecutiveErrors(0);
  setSelectedPoints([]);

  if (setLastSelectedPoint) {
    setLastSelectedPoint(null);
  }

  toast.warn("El conjunto se ha reiniciado.");
};
