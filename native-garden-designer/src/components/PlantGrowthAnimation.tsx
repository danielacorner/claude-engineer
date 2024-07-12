import React, { useEffect } from "react";
import { useSpring, animated, config, SpringValue } from "@react-spring/three";
import * as THREE from "three";

interface PlantGrowthAnimationProps {
  scale: [number, number, number];
  rotation: [number, number, number];
  growthDuration: number;
  onGrowthComplete: () => void;
  children?: React.ReactNode;
}

const SCALE = 2;

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({
  scale,
  rotation,
  growthDuration,
  onGrowthComplete,
  children,
}) => {
  const finalScale = new THREE.Vector3(...scale.map((n) => n * SCALE));

  const [springs, api] = useSpring(() => ({
    scale: [0.1, 0.1, 0.1],
    rotation: rotation,
    config: {
      ...config.wobbly,
      duration: undefined,
      friction: 12 * growthDuration,
      tension: 170,
    },
    onRest: () => {
      onGrowthComplete();
    },
  }));

  useEffect(() => {
    api.start({
      scale: [finalScale.x, finalScale.y, finalScale.z],
    });
  }, [api, finalScale]);

  return (
    <animated.group
      scale={springs.scale as unknown as SpringValue<[number, number, number]>}
      rotation={springs.rotation as unknown as [number, number, number]}
    >
      {children}
    </animated.group>
  );
};

export default PlantGrowthAnimation;
