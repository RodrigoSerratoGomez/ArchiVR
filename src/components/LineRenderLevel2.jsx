import React from "react";
import * as THREE from "three";

const LineRenderLevel2 = ({ lines }) => {
  return (
    <>
      {lines.map((line, index) => {
        if (!line.start || !line.end) return null;

        const curve = new THREE.LineCurve3(
          new THREE.Vector3(...line.start),
          new THREE.Vector3(...line.end)
        );

        const geometry = new THREE.TubeGeometry(curve, 20, 0.1, 4, false);

        return (
          <mesh key={index} geometry={geometry}>
            <meshStandardMaterial
              attach="material"
              color="cyan"
              emissive="blue"
              emissiveIntensity={0.6}
              opacity={0.8}
              transparent
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default LineRenderLevel2;
