import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlantGrowthAnimationProps {
  scale: [number, number, number];
  growthDuration: number;
  onGrowthComplete: () => void;
  children?: React.ReactNode;
}

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({
  scale,
  growthDuration,
  onGrowthComplete,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const finalScale = useRef(new THREE.Vector3(...scale));

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      const elapsedTime = (Date.now() - startTime.current) / 1000;
      const progress = Math.min(elapsedTime / growthDuration, 1);

      const currentScale = new THREE.Vector3(
        THREE.MathUtils.lerp(0.1, finalScale.current.x, progress),
        THREE.MathUtils.lerp(0.1, finalScale.current.y, progress),
        THREE.MathUtils.lerp(0.1, finalScale.current.z, progress)
      );

      groupRef.current.scale.copy(currentScale);

      if (progress === 1) {
        onGrowthComplete();
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default PlantGrowthAnimation;
