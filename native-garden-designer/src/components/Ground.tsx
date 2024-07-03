import React, { useRef, useMemo, useState } from "react";
import { Plane, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GroundProps {
  onPlantPlace: (position: [number, number, number]) => void;
}

const GRID_SIZE = 1; // Size of each grid cell

const Ground: React.FC<GroundProps> = ({ onPlantPlace }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, raycaster, mouse } = useThree();
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);

  // Load a grass texture
  const texture = useTexture("/textures/grass.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

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
        const snappedPosition = snapToGrid(point);
        onPlantPlace([snappedPosition.x, snappedPosition.y, snappedPosition.z]);
      }
    }
  };

  const handlePointerMove = (event: THREE.Event) => {
    if (meshRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        const snappedPosition = snapToGrid(point);
        setHoverPoint(snappedPosition);
      } else {
        setHoverPoint(null);
      }
    }
  };

  const snapToGrid = (point: THREE.Vector3): THREE.Vector3 => {
    return new THREE.Vector3(
      Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      point.y,
      Math.round(point.z / GRID_SIZE) * GRID_SIZE
    );
  };

  return (
    <group>
      <Plane
        ref={meshRef}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        args={[1000, 1000, 200, 200]}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
      >
        <primitive object={groundMaterial} attach="material" />
      </Plane>
      <gridHelper
        args={[1000, 1000 / GRID_SIZE, "#888888", "#444444"]}
        position={[0, 0.01, 0]}
      />
      {hoverPoint && (
        <mesh position={hoverPoint}>
          <boxGeometry args={[GRID_SIZE, 0.1, GRID_SIZE]} />
          <meshBasicMaterial color="yellow" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};

export default Ground;