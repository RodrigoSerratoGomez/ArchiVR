import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Level1Environment = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("black");
  }, [scene]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <gridHelper args={[1000, 20, 0xffffff, 0xffffff]} position={[0, 50, 0]} />
    </>
  );
};

export default Level1Environment;
