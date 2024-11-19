import { Canvas } from "@react-three/fiber";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraAndMovement from "../../components/CameraAndMovement";
import CompletedLevelModal from "../../components/modals/CompletedLevelModal";
import InitialInstructionsModal from "../../components/modals/InitialInstructionsModal";
import PauseMenu from "../../components/PauseMenu";
import Scoreboard from "../../components/Scoreboard";
import Level3Environment from "../../enviroments/Level3Environment";
import { addMetrics } from "../../firebase/firestoreService";
import Level3Instructions from "../../instructions/level3-instructions.json";
import "../../styles/Pointer.css";
import {
  handleCompleteChallenge,
  initCurrentMetricsList,
  initGlobalMetrics,
  initializeTimer,
  resetLevel,
  saveCompletedMetrics,
  updateScore,
} from "../../utils/levelsUtils";
import { initializeMetrics } from "../../utils/metricsUtils";
import Level3Challenge1 from "./challenges/Level3Challenge1";
import Level3Challenge2 from "./challenges/Level3Challenge2";

const Level3 = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const [globalMetrics, setGlobalMetrics] = useState(initGlobalMetrics());
  const [currentMetrics, setCurrentMetrics] = useState(() =>
    initializeMetrics(`challenge${currentChallenge}`)
  );
  const [currentMetricsList, setCurrentMetricsList] = useState(
    initCurrentMetricsList()
  );

  useEffect(() => {
    if (!showModal) {
      setTimeout(() => {
        const canvas = document.querySelector("canvas");
        if (canvas && !isPaused) {
          canvas.requestPointerLock();
        }
      }, 100);
    }
  }, [showModal, isPaused]);

  useEffect(
    () =>
      initializeTimer(
        showModal,
        isPaused,
        isLevelCompleted,
        setGlobalMetrics,
        setCurrentMetrics
      ),
    [showModal, isPaused, isLevelCompleted]
  );

  const onScoreUpdate = (type) => {
    updateScore(type, setGlobalMetrics, setCurrentMetrics);
  };

  const onCompleteChallenge = (nextChallenge) => {
    handleCompleteChallenge(
      nextChallenge,
      currentMetrics,
      setCurrentMetricsList,
      setCurrentMetrics,
      setCurrentChallenge,
      setShowModal,
      setIsLevelCompleted,
      2
    );
  };

  const onResetLevel = () => {
    resetLevel(
      setCurrentChallenge,
      setCurrentMetrics,
      setGlobalMetrics,
      setCurrentMetricsList,
      setShowModal,
      "Nivel 3: Desafíos Intermedios"
    );
  };

  useEffect(() => {
    if (isLevelCompleted) {
      saveCompletedMetrics(
        currentUser,
        globalMetrics,
        currentMetricsList,
        "level3",
        addMetrics
      );
    }
  }, [isLevelCompleted]);

  const totalMetrics = {
    correct: globalMetrics.correct,
    errors: globalMetrics.errors,
    totalPoints: globalMetrics.totalPoints,
    time: globalMetrics.time,
    title: Level3Instructions.challenges[currentChallenge - 1].title,
    objective: Level3Instructions.challenges[currentChallenge - 1].objective,
  };

  return (
    <div className="w-screen h-screen relative">
      {showModal && (
        <InitialInstructionsModal
          levelInfo={Level3Instructions.challenges[currentChallenge - 1]}
          isPaused={isPaused}
          setShowModal={setShowModal}
        />
      )}

      {!showModal && !isLevelCompleted && (
        <>
          <Canvas style={{ pointerEvents: isPaused ? "none" : "auto" }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <CameraAndMovement isPaused={isPaused} />
            <Level3Environment />

            {currentChallenge === 1 && (
              <Level3Challenge1
                handleCompleteChallenge={() => onCompleteChallenge(2)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 2 && (
              <Level3Challenge2
                handleCompleteChallenge={() => setIsLevelCompleted(true)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}
          </Canvas>
        </>
      )}

      <Scoreboard metrics={totalMetrics} />

      <PauseMenu
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        currentChallengeInfo={
          Level3Instructions.challenges[currentChallenge - 1]
        }
        resetLevel={onResetLevel}
      />

      {isLevelCompleted && (
        <CompletedLevelModal
          scoreDetails={globalMetrics}
          handleReplay={() => {
            setIsLevelCompleted(false);
            onResetLevel();
          }}
          handleMainMenu={() => navigate("/")}
          handleSelectLevel={() => navigate("/play")}
        />
      )}

      <div className="pointer" />
    </div>
  );
};

export default Level3;
