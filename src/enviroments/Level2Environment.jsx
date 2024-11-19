import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Level2Environment = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#87CEEB");
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#E3E3DF" />
      </mesh>

      {[
        [-50, 25, -30],
        [-20, 25, -30],
        [20, 25, -30],
        [50, 25, -30],
        [-50, 25, 30],
        [-20, 25, 30],
        [20, 25, 30],
        [50, 25, 30],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[3, 3, 50, 32]} />

          <meshStandardMaterial color="#D3D3D3" />
        </mesh>
      ))}

      <mesh position={[-10, 5, -50]} rotation={[0.3, 0.4, 0]}>
        <boxGeometry args={[10, 10, 10]} />

        <meshStandardMaterial color="#D3D3D3" />
      </mesh>

      <mesh position={[20, 5, -40]} rotation={[0.1, 0.3, 0]}>
        <boxGeometry args={[12, 12, 12]} />

        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      <ambientLight intensity={0.5} color="#FFFFFF" />

      <directionalLight
        position={[50, 100, 50]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <gridHelper
        args={[1000, 20, "#ffffff", "#ffffff"]}
        position={[0, 50, 0]}
      />
    </>
  );
};

export default Level2Environment;
