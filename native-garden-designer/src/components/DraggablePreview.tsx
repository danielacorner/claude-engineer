import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { Plant } from "../types";
import { useAppStore, useSelectedPlants } from "../store";
import * as THREE from "three";

interface DraggablePreviewProps {
  plants: Plant[];
}

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const DraggablePreview = () => {
  const selectedPlants = useSelectedPlants();
  return <DraggablePreviewContent plants={selectedPlants} />;
};
const DraggablePreviewContent: React.FC<DraggablePreviewProps> = ({
  plants,
}) => {
  const { raycaster, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const { gridMode } = useAppStore();

  const [spring, api] = useSpring<{
    position: THREE.Vector3;
  }>(() => ({
    position: new THREE.Vector3(0, 0, 0),
    config: { tension: 300, friction: 30 },
  }));

  useFrame(() => {
    if (groupRef.current) {
      const intersection = new THREE.Vector3();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      raycaster.ray.intersectPlane(GROUND_PLANE, intersection);

      const snappedPosition = gridMode
        ? snapToGrid(intersection)
        : [intersection.x, intersection.y, intersection.z];

      api.start({
        position: new THREE.Vector3(
          snappedPosition[0],
          snappedPosition[1],
          snappedPosition[2]
        ),
      });
    }
  });

  const snapToGrid = (point: THREE.Vector3): [number, number, number] => {
    const GRID_SIZE = 1;
    return [
      Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      point.y,
      Math.round(point.z / GRID_SIZE) * GRID_SIZE,
    ];
  };

  return (
    <a.group ref={groupRef} position={spring.position}>
      {plants.map((plant) => (
        <mesh
          key={plant.id}
          position={plant.position}
          rotation={plant.rotation}
          scale={plant.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="yellow" opacity={0.5} transparent />
        </mesh>
      ))}
    </a.group>
  );
};

export default DraggablePreview;
