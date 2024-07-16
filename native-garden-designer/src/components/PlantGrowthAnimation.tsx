import React, { useEffect } from "react";
import { useSpring, animated, config, SpringValue } from "@react-spring/three";
import * as THREE from "three";

interface PlantGrowthAnimationProps {
  scale: [number, number, number];
  growthDuration: number;
  onGrowthComplete: () => void;
  children?: React.ReactNode;
  id: number;
}

const SCALE = 2;

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({
  scale,
  growthDuration,
  onGrowthComplete,
  children,
  id,
}) => {
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
    const finalScale = new THREE.Vector3(...scale.map((n) => n * SCALE));
    api.start({
      scale: [finalScale.x, finalScale.y, finalScale.z],
    });
  }, [api, scale]);

  return (
    <animated.group
      scale={springs.scale as unknown as SpringValue<[number, number, number]>}
      userData={{
        id,
      }}
      name={`growth-animation-${id}`}
    >
      {children}
    </animated.group>
  );
};

export default PlantGrowthAnimation;
