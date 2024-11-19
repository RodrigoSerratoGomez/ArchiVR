import React from "react";
import * as THREE from "three";

const LineRenderLevel1 = ({ lines }) => {
  return (
    <>
      {lines.map((line, index) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...line.start),
          new THREE.Vector3(...line.end),
        ]);
        return (
          <line key={index}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial attach="material" color="green" />
          </line>
        );
      })}
    </>
  );
};

export default LineRenderLevel1;
