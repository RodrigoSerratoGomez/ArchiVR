import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Level3Environment = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#353535");
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#A9A9A9" />
      </mesh>

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-400 + i * 200, 0.1, -200]}>
          <boxGeometry args={[180, 1, 5]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {[
        [-300, 15, -150],
        [0, 15, -150],
        [300, 15, -150],
        [-300, 15, 150],
        [0, 15, 150],
        [300, 15, 150],
      ].map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[20, 30, 20]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      ))}

      {[
        [-150, 15, -100],
        [150, 15, -100],
        [-150, 15, 100],
        [150, 15, 100],
      ].map((position, index) => (
        <mesh key={`middle-column-${index}`} position={position}>
          <boxGeometry args={[20, 30, 20]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      ))}

      <gridHelper
        args={[1000, 20, "#A9A9A9", "#A9A9A9"]}
        position={[0, 50, 0]}
      />

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`light-${i}`} position={[-400 + i * 200, 48, 0]}>
          <boxGeometry args={[80, 5, 5]} />
          <meshStandardMaterial
            emissive="#FFFFFF"
            emissiveIntensity={1}
            color="#E0E0E0"
          />
        </mesh>
      ))}

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`light-2-${i}`} position={[-400 + i * 200, 48, -150]}>
          <boxGeometry args={[80, 5, 5]} />
          <meshStandardMaterial
            emissive="#FFFFFF"
            emissiveIntensity={1}
            color="#E0E0E0"
          />
        </mesh>
      ))}
    </>
  );
};

export default Level3Environment;
