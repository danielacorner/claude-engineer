import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainEffectProps {
  intensity: number;
}

const RainEffect: React.FC<RainEffectProps> = ({ intensity }) => {
  const rainCount = useMemo(() => Math.floor(intensity * 5000), [intensity]);
  const rainGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const rainMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  const raindrops = useMemo(() => {
    const positions = new Float32Array(rainCount * 3);
    const speeds = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = Math.random() * 100 - 50; // x
      positions[i * 3 + 1] = Math.random() * 50; // y
      positions[i * 3 + 2] = Math.random() * 100 - 50; // z
      speeds[i] = 0.1 + Math.random() * 0.3; // Random speed
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    return { positions, speeds };
  }, [rainCount, rainGeometry]);

  const rainRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      const speeds = rainRef.current.geometry.attributes.speed.array as Float32Array;

      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= speeds[i]; // Move raindrop down

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 50; // Reset to top when it reaches the ground
        }
      }

      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (intensity === 0) return null;

  return <points ref={rainRef} geometry={rainGeometry} material={rainMaterial} />;
};

export default RainEffect;