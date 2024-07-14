import React from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SelectionRectangleProps {
  start: [number, number] | null;
  end: [number, number] | null;
}

const SelectionRectangle: React.FC<SelectionRectangleProps> = ({
  start,
  end,
}) => {
  const { camera, size } = useThree();

  if (!start || !end) return null;

  const startVec = new THREE.Vector3(
    (start[0] / size.width) * 2 - 1,
    -(start[1] / size.height) * 2 + 1,
    0
  ).unproject(camera);

  const endVec = new THREE.Vector3(
    (end[0] / size.width) * 2 - 1,
    -(end[1] / size.height) * 2 + 1,
    0
  ).unproject(camera);

  const points = [
    new THREE.Vector3(startVec.x, startVec.y, 0),
    new THREE.Vector3(endVec.x, startVec.y, 0),
    new THREE.Vector3(endVec.x, endVec.y, 0),
    new THREE.Vector3(startVec.x, endVec.y, 0),
  ];

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          {...({
            attachObject: ["attributes", "position"],
          } as any)}
          count={5}
          array={
            new Float32Array([
              ...points[0].toArray(),
              ...points[1].toArray(),
              ...points[2].toArray(),
              ...points[3].toArray(),
              ...points[0].toArray(),
            ])
          }
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="blue" />
    </line>
  );
};

export default SelectionRectangle;
