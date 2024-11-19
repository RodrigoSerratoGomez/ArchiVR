import { toast } from "react-toastify";
import { resetChallenge } from "./metricsUtils";
import { playErrorSound1, playWinGame } from "./soundUtils";

export const handleError = (consecutiveErrors, errorLimit, handlers) => {
  const {
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
  } = handlers;

  playErrorSound1();
  setConsecutiveErrors((prev) => prev + 1);
  setInvalidPoint(point);
  setTimeout(() => setInvalidPoint(null), 1000);
  updateScore("error");

  if (consecutiveErrors + 1 >= errorLimit) {
    toast.error(errorMessage);
    resetChallenge(
      currentMetrics.id,
      setCompletedSets,
      setConsecutiveErrors,
      setCurrentMetrics,
      setLines,
      setSelectedPoints,
      setGlobalMetrics
    );
    return true;
  }
  return false;
};

export const completeSet = ({
  setCompletedSets,
  setSelectedPoints,
  setCurrentMetrics,
  setCurrentMetricsList,
  maxSets,
  completedSets,
  updateScore,
  handleChallengeCompletion,
  handleCompleteChallenge,
}) => {
  updateScore("correct");
  setSelectedPoints([]);
  setCompletedSets((prev) => prev + 1);

  if (completedSets + 1 >= maxSets) {
    setCurrentMetrics((prevMetrics) => {
      const updatedMetrics = { ...prevMetrics };

      setCurrentMetricsList((prevList) => {
        const isAlreadyStored = prevList.some(
          (metrics) => metrics.id === updatedMetrics.id
        );

        return isAlreadyStored ? prevList : [...prevList, updatedMetrics];
      });

      return updatedMetrics;
    });

    handleChallengeCompletion(
      handleCompleteChallenge,
      "¡Reto completado con éxito!"
    );
  } else {
    playWinGame();
    toast.success("¡Conjunto completado! Puedes iniciar otro.");
  }
};
