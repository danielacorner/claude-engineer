import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WindEffectProps {
  speed: number;
}

const WindEffect: React.FC<WindEffectProps> = ({ speed }) => {
  const { scene } = useThree();
  const windForce = useRef(new THREE.Vector3());

  useEffect(() => {
    // Update wind force based on speed
    windForce.current.set(speed * 0.1, 0, speed * 0.05);
  }, [speed]);

  useFrame(() => {
    // Apply wind force to all meshes in the scene
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.isPlant) {
        const plant = object;
        
        // Simple wind effect: rotate the plant slightly
        plant.rotation.x = Math.sin(Date.now() * 0.001 * speed) * 0.05;
        plant.rotation.z = Math.sin(Date.now() * 0.002 * speed) * 0.05;
        
        // If the plant has a custom wind animation, call it here
        if (typeof plant.userData.animateWind === 'function') {
          plant.userData.animateWind(windForce.current);
        }
      }
    });
  });

  return null; // This component doesn't render anything visible
};

export default WindEffect;