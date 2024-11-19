import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

const CameraAndMovement = ({ isPaused }) => {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const speed = 5;
  const [isWalking, setIsWalking] = useState(false);
  const [stepAudio] = useState(() => new Audio("/sounds/pasos.wav"));

  useEffect(() => {
    stepAudio.loop = true;
  }, [stepAudio]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPaused) return;
      switch (event.code) {
        case "KeyW":
          setMoveForward(true);
          break;
        case "KeyA":
          setMoveLeft(true);
          break;
        case "KeyS":
          setMoveBackward(true);
          break;
        case "KeyD":
          setMoveRight(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "KeyW":
          setMoveForward(false);
          break;
        case "KeyA":
          setMoveLeft(false);
          break;
        case "KeyS":
          setMoveBackward(false);
          break;
        case "KeyD":
          setMoveRight(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused]);

  useEffect(() => {
    if (moveForward || moveBackward || moveLeft || moveRight) {
      if (!isWalking) {
        stepAudio.play();
        setIsWalking(true);
      }
    } else {
      if (isWalking) {
        stepAudio.pause();
        stepAudio.currentTime = 0;
        setIsWalking(false);
      }
    }
  }, [moveForward, moveBackward, moveLeft, moveRight, isWalking, stepAudio]);

  useFrame((state, delta) => {
    if (isPaused) return;

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const front = new THREE.Vector3();

    camera.getWorldDirection(direction);
    right.crossVectors(direction, camera.up).normalize();
    front.copy(direction).normalize();

    if (moveForward) {
      camera.position.addScaledVector(front, speed * delta);
    }
    if (moveBackward) {
      camera.position.addScaledVector(front, -speed * delta);
    }
    if (moveLeft) {
      camera.position.addScaledVector(right, -speed * delta);
    }
    if (moveRight) {
      camera.position.addScaledVector(right, speed * delta);
    }

    camera.position.y = 2;
  });

  return isPaused ? null : <PointerLockControls />;
};

export default CameraAndMovement;
