import React from "react";
import { useSpring, animated, config, SpringValue } from "@react-spring/three";

export const PlantShrinkAnimation: React.FC<{
  shrink: boolean;
  children?: React.ReactElement;
}> = ({ shrink, children }) => {
  const [springs] = useSpring(
    () => ({
      scale: shrink ? [0, 0, 0] : [1, 1, 1],
      config: {
        ...config.wobbly,
        duration: undefined,
        friction: 12,
        tension: 170,
      },
    }),
    [shrink]
  );

  return (
    <animated.group
      scale={springs.scale as unknown as SpringValue<[number, number, number]>}
    >
      {children}
    </animated.group>
  );
};
