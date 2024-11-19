import * as THREE from "three";

const PlaneRenderLevel3 = ({ planes }) => {
  return (
    <>
      {planes.map((planePoints, index) => {
        const validPlanePoints = planePoints.filter(
          (p) => Array.isArray(p) && p.length === 3
        );

        if (validPlanePoints.length !== 4) {
          console.error(
            `Invalid planePoints for plane at index ${index}:`,
            planePoints
          );
          return null;
        }

        const [p1, p2, p3, p4] = validPlanePoints;

        const centerX = (p1[0] + p2[0] + p3[0] + p4[0]) / 4;
        const centerY = (p1[1] + p2[1] + p3[1] + p4[1]) / 4;
        const centerZ = (p1[2] + p2[2] + p3[2] + p4[2]) / 4;
        const center = [centerX, centerY, centerZ];

        const vec1 = new THREE.Vector3().subVectors(
          new THREE.Vector3(...p1),
          new THREE.Vector3(...p3)
        );
        const vec2 = new THREE.Vector3().subVectors(
          new THREE.Vector3(...p2),
          new THREE.Vector3(...p4)
        );

        const width = vec1.length();
        const depth = vec2.length();

        const vecWidth = new THREE.Vector3(...p2).sub(new THREE.Vector3(...p1));
        const vecDepth = new THREE.Vector3(...p3).sub(new THREE.Vector3(...p1));

        const normal = new THREE.Vector3()
          .crossVectors(vecWidth, vecDepth)
          .normalize();

        const geometry = new THREE.PlaneGeometry(width, depth);

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(
          new THREE.Vector3(0, 0, 0),
          normal,
          new THREE.Vector3(0, 1, 0)
        );
        const rotation = new THREE.Euler().setFromRotationMatrix(
          rotationMatrix
        );

        return (
          <mesh
            key={index}
            geometry={geometry}
            position={center}
            rotation={rotation}
          >
            <meshStandardMaterial
              color="yellow"
              emissiveIntensity={0.2}
              opacity={0.8}
              transparent
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default PlaneRenderLevel3;
