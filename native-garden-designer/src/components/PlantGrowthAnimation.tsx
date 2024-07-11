import React, { useEffect } from "react";
import { useSpring, animated, config, SpringValue } from "@react-spring/three";
import * as THREE from "three";

interface PlantGrowthAnimationProps {
  scale: [number, number, number];
  growthDuration: number;
  onGrowthComplete: () => void;
  children?: React.ReactNode;
}

const SCALE = 5;

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({
  scale,
  growthDuration,
  onGrowthComplete,
  children,
}) => {
  const finalScale = new THREE.Vector3(...scale.map((n) => n * SCALE));

  const [springs, api] = useSpring(() => ({
    scale: [0.1, 0.1, 0.1],
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
    >
      {children}
    </animated.group>
  );
};

export default PlantGrowthAnimation;
