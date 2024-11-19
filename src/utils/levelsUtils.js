import {
  initializeLevelMetrics,
  initializeMetrics,
  updateScoreMetrics,
} from "./metricsUtils";

export const initGlobalMetrics = () => ({
  correct: 0,
  errors: 0,
  time: 0,
  totalPoints: 0,
});

export const initCurrentMetricsList = () => [];

export const updateScore = (type, setGlobalMetrics, setCurrentMetrics) => {
  updateScoreMetrics(type, setGlobalMetrics, setCurrentMetrics);
};

export const handleCompleteChallenge = (
  nextChallenge,
  currentMetrics,
  setCurrentMetricsList,
  setCurrentMetrics,
  setCurrentChallenge,
  setShowModal,
  setIsLevelCompleted,
  levelCompleteCondition
) => {
  setCurrentMetricsList((prevList) => {
    const isAlreadySaved = prevList.some(
      (metrics) => metrics.id === currentMetrics.id
    );

    if (!isAlreadySaved && currentMetrics.id) {
      const metricsToSave = (({ saved, ...rest }) => rest)(currentMetrics);
      return [...prevList, metricsToSave];
    }

    return prevList;
  });

  const nextChallengeId = `challenge${nextChallenge}`;
  setCurrentMetrics(initializeMetrics(nextChallengeId));

  if (nextChallenge > levelCompleteCondition) {
    setIsLevelCompleted(true);
  } else {
    setCurrentChallenge(nextChallenge);
    setShowModal(true);
  }
};

export const resetLevel = (
  setCurrentChallenge,
  setCurrentMetrics,
  setGlobalMetrics,
  setCurrentMetricsList,
  setShowModal,
  levelName
) => {
  setCurrentChallenge(1);
  setCurrentMetrics(initializeMetrics(`challenge1`));
  setGlobalMetrics(initGlobalMetrics());
  setCurrentMetricsList(initCurrentMetricsList());
  setShowModal(true);
  initializeLevelMetrics(levelName);
};

export const saveCompletedMetrics = async (
  currentUser,
  globalMetrics,
  currentMetricsList,
  levelId,
  addMetrics
) => {
  if (currentUser) {
    const userId = currentUser.uid;
    const gameId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const levelMetrics = {
      levelId,
      globalMetrics,
      currentMetricsList,
      completedAt: new Date().toISOString(),
      gameId,
    };

    await addMetrics(userId, gameId, levelMetrics);
  }
};

export const initializeTimer = (
  showModal,
  isPaused,
  isLevelCompleted,
  setGlobalMetrics,
  setCurrentMetrics
) => {
  let interval = null;
  if (!showModal && !isPaused && !isLevelCompleted) {
    interval = setInterval(() => {
      setGlobalMetrics((prevMetrics) => ({
        ...prevMetrics,
        time: prevMetrics.time + 1,
      }));

      setCurrentMetrics((prevMetrics) => ({
        ...prevMetrics,
        challengeTime: prevMetrics.challengeTime + 1,
      }));
    }, 1000);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
};
