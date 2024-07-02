import React, { useRef, useMemo } from "react";
import { Plane, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GroundProps {
  onPlantPlace: (position: [number, number, number]) => void;
}

const Ground: React.FC<GroundProps> = ({ onPlantPlace }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, raycaster, mouse } = useThree();

  // Load a grass texture
  const texture = useTexture("/textures/grass.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100); // Increased repeat for more detailed grass

  // Create a heightmap for subtle elevation
  const heightmap = useMemo(() => {
    const size = 1024;
    const data = new Float32Array(size * size);
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      data[i] = (Math.cos(x / 20) + Math.sin(y / 20)) * 0.5;
    }
    return data;
  }, []);

  // Create custom shader material for the ground
  const groundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        grassTexture: { value: texture },
        heightmap: { value: heightmap },
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        uniform sampler2D heightmap;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 heightData = texture2D(heightmap, uv);
          vec3 transformed = vec3(position.x, position.y + heightData.r * 2.0, position.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D grassTexture;
        varying vec2 vUv;
        void main() {
          vec4 grassColor = texture2D(grassTexture, vUv * 100.0);
          gl_FragColor = grassColor;
        }
      `,
    });
  }, [texture, heightmap]);

  // Animate grass
  useFrame(({ clock }) => {
    if (groundMaterial) {
      groundMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const handleClick = (event: THREE.Event) => {
    if (meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        onPlantPlace([point.x, point.y, point.z]); // Use actual y-value for elevation
      }
    }
  };

  return (
    <group>
      <Plane
        ref={meshRef}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        args={[1000, 1000, 200, 200]} // Increased segments for more detailed heightmap
        onClick={handleClick}
      >
        <primitive object={groundMaterial} attach="material" />
      </Plane>
      <gridHelper
        args={[1000, 100, "#888888", "#444444"]}
        position={[0, 0.01, 0]}
      />
      <gridHelper
        args={[1000, 20, "#aaaaaa", "#666666"]}
        position={[0, 0.015, 0]}
      />
    </group>
  );
};

export default Ground;
