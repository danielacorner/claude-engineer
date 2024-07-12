import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { PlantData } from "../../types";
import * as THREE from "three";

interface PlantPreviewProps {
  plant: PlantData;
  cursorPosition: THREE.Vector3;
}

const PlantPreview: React.FC<PlantPreviewProps> = ({
  plant,
  cursorPosition,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(plant.modelUrl);
  const { raycaster } = useThree();

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(...(plant.scale || [1, 1, 1]));
    }
  }, [plant.scale]);

  useFrame(() => {
    if (groupRef.current && cursorPosition) {
      // Update the position to follow the cursor
      groupRef.current.position.copy(cursorPosition);

      // Adjust the height based on the ground
      raycaster.set(
        new THREE.Vector3(cursorPosition.x, 100, cursorPosition.z),
        new THREE.Vector3(0, -1, 0)
      );
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        groupRef.current.position.y = intersects[0].point.y;
      }
    }
  });

  // Clone the scene and apply transparency to all materials
  const previewScene = React.useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0.5;
      }
    });
    return clonedScene;
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={previewScene} />
    </group>
  );
};

export default PlantPreview;
