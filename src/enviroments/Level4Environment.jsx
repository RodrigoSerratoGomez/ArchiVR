import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Level4Environment = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#FAF3E0");
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#E3E3DF" />
      </mesh>

      <mesh position={[0, 5, -300]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[200, 200, 10]} />
        <meshStandardMaterial color="#D3D3D3" />
      </mesh>
      {[
        [-50, 0, -220],
        [0, 0, -220],
        [50, 0, -220],
      ].map((position, index) => (
        <mesh
          key={`stair-${index}`}
          position={position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <boxGeometry args={[50, 10, 20]} />
          <meshStandardMaterial color="#E3E3DF" />
        </mesh>
      ))}

      <group position={[0, 60, -300]}>
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, -50, 0]}>
          <cylinderGeometry args={[60, 60, 100, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {[
          [-40, -50, 40],
          [40, -50, 40],
          [-40, -50, -40],
          [40, -50, -40],
        ].map((position, index) => (
          <mesh key={`temple-column-${index}`} position={position}>
            <cylinderGeometry args={[5, 5, 100, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>

      {[
        [-150, 50, -300],
        [150, 50, -300],
      ].map((position, index) => (
        <group key={`hourglass-${index}`} position={position}>
          <mesh position={[0, 50, 0]}>
            <sphereGeometry args={[30, 32, 32]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <mesh position={[0, -50, 0]}>
            <sphereGeometry args={[30, 32, 32]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[20, 20, 100, 32]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {[
        [-100, 0, -200],
        [100, 0, -200],
        [-120, 0, -400],
        [120, 0, -400],
      ].map((position, index) => (
        <group key={`tree-${index}`} position={position}>
          <mesh position={[0, 25, 0]}>
            <cylinderGeometry args={[5, 5, 50, 16]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 75, 0]}>
            <sphereGeometry args={[25, 32, 32]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}

      <ambientLight intensity={0.6} color="#FFFFFF" />
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};

export default Level4Environment;
