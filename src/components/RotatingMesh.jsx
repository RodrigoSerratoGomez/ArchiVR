import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const RotatingMesh = ({ shape, color }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {shape === "cube" && <boxGeometry args={[2, 2, 2]} />}
      {shape === "sphere" && <sphereGeometry args={[1.5, 32, 32]} />}
      {shape === "prism" && <coneGeometry args={[1.5, 2.5, 8]} />}
      {shape === "cylinder" && <cylinderGeometry args={[1.5, 1.5, 3, 32]} />}
      {shape === "tetrahedron" && <tetrahedronGeometry args={[1.5]} />}
      {shape === "torus" && <torusGeometry args={[1.5, 0.4, 16, 100]} />}
      <MeshDistortMaterial color={color} distort={0.2} speed={1} />
    </mesh>
  );
};

export default RotatingMesh;
