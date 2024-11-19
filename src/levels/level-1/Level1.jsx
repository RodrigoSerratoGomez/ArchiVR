import { Canvas } from "@react-three/fiber";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraAndMovement from "../../components/CameraAndMovement";
import CompletedLevelModal from "../../components/modals/CompletedLevelModal";
import InitialInstructionsModal from "../../components/modals/InitialInstructionsModal";
import PauseMenu from "../../components/PauseMenu";
import Scoreboard from "../../components/Scoreboard";
import Level1Environment from "../../enviroments/Level1Environment";
import { addMetrics } from "../../firebase/firestoreService";
import Level1Instructions from "../../instructions/level1-instructions.json";
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
import Level1Challenge1 from "./challenges/Level1Challenge1";
import Level1Challenge2 from "./challenges/Level1Challenge2";
import Level1Challenge3 from "./challenges/Level1Challenge3";
import Level1Challenge4 from "./challenges/Level1Challenge4";
import Level1Challenge5 from "./challenges/Level1Challenge5";
import Level1Challenge6 from "./challenges/Level1Challenge6";

const Level1 = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [currentChallenge, setCurrentChallenge] = useState(1);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // Inicialización de métricas
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
      6
    );
  };

  const onResetLevel = () => {
    resetLevel(
      setCurrentChallenge,
      setCurrentMetrics,
      setGlobalMetrics,
      setCurrentMetricsList,
      setShowModal,
      "Nivel 1: Conceptos Básicos"
    );
  };

  useEffect(() => {
    if (isLevelCompleted) {
      saveCompletedMetrics(
        currentUser,
        globalMetrics,
        currentMetricsList,
        "level1",
        addMetrics
      );
    }
  }, [isLevelCompleted]);

  const totalMetrics = {
    correct: globalMetrics.correct,
    errors: globalMetrics.errors,
    totalPoints: globalMetrics.totalPoints,
    time: globalMetrics.time,
    title: Level1Instructions.challenges[currentChallenge - 1].title,
    objective: Level1Instructions.challenges[currentChallenge - 1].objective,
  };

  return (
    <div className="w-screen h-screen relative">
      {showModal && (
        <InitialInstructionsModal
          levelInfo={Level1Instructions.challenges[currentChallenge - 1]}
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
            <Level1Environment />

            {currentChallenge === 1 && (
              <Level1Challenge1
                handleCompleteChallenge={() => onCompleteChallenge(2)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 2 && (
              <Level1Challenge2
                handleCompleteChallenge={() => onCompleteChallenge(3)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 3 && (
              <Level1Challenge3
                handleCompleteChallenge={() => onCompleteChallenge(4)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 4 && (
              <Level1Challenge4
                handleCompleteChallenge={() => onCompleteChallenge(5)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 5 && (
              <Level1Challenge5
                handleCompleteChallenge={() => onCompleteChallenge(6)}
                updateScore={onScoreUpdate}
                setGlobalMetrics={setGlobalMetrics}
                setCurrentMetrics={setCurrentMetrics}
                currentMetrics={currentMetrics}
                setCurrentMetricsList={setCurrentMetricsList}
              />
            )}

            {currentChallenge === 6 && (
              <Level1Challenge6
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
          Level1Instructions.challenges[currentChallenge - 1]
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

export default Level1;
