import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeatherEffectsProps {
  weather: 'clear' | 'rain' | 'snow';
  intensity: number;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weather, intensity }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const [particles, particleSystem] = useMemo(() => {
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = Math.random() * 100 - 50;
      positions[i + 1] = Math.random() * 50;
      positions[i + 2] = Math.random() * 100 - 50;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const texture = new THREE.TextureLoader().load(
      weather === 'snow' ? '/textures/snowflake.png' : '/textures/raindrop.png'
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: weather === 'snow' ? 0.2 : 0.1,
      map: texture,
      transparent: true,
      opacity: 0.6,
      color: weather === 'snow' ? 0xffffff : 0x99ccff,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    return [particles, particleSystem];
  }, [weather]);

  useFrame(() => {
    if (particlesRef.current && weather !== 'clear') {
      const positions = particles.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= weather === 'snow' ? 0.05 * intensity : 0.2 * intensity;
        if (positions[i + 1] < 0) {
          positions[i + 1] = 50;
        }
      }
      particles.attributes.position.needsUpdate = true;
    }
  });

  if (weather === 'clear') {
    return null;
  }

  return <primitive object={particleSystem} ref={particlesRef} />;
};

export default WeatherEffects;