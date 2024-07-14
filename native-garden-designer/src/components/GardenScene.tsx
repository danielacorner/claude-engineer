import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import Ground from "./Ground";
import RainEffect from "./RainEffect";
import WindEffect from "./WindEffect";
import GridSystem from "./GridSystem";
import * as THREE from "three";
import { getAllPlants } from "../data/plantDatabase";
import { useAppStore } from "../store";
import { PlantsInstances } from "./PlantsInstances";

export const GardenScene: React.FC = () => {
  const {
    rainIntensity,
    windSpeed,
    cloudCover,
    showGrid,
    setSelectedPlant,
    setHoveredPosition,
    placePlant,
    isDragging,
    isHovered,
    currentTool,
  } = useAppStore();

  const orbitControlsRef = useRef<any>();
  const groundRef = useRef<any>(null);
  const [heightMap, setHeightMap] = useState<number[][]>([]);

  // disable orbitControls while dragging
  useEffect(() => {
    if (!orbitControlsRef.current) {
      return;
    }
    if (isDragging || isHovered) {
      orbitControlsRef.current.enabled = false;
    } else {
      orbitControlsRef.current.enabled = true;
    }
  }, [isDragging, isHovered]);

  const fogColor = useMemo(() => {
    const color = new THREE.Color();
    color.setHSL(0.6, 0.7, 0.9);
    return color;
  }, []);

  const lightIntensity = 1.5;
  const sunPosition = new THREE.Vector3(0, 10, 0);

  useEffect(() => {
    // Load initial plant data
    const allPlants = getAllPlants();
    if (allPlants.length > 0) {
      setSelectedPlant(allPlants[0]);
    }

    // Initialize height map
    const size = 100;
    const initialHeightMap = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    setHeightMap(initialHeightMap);
  }, [setSelectedPlant]);

  const handleGroundHeightChange = (x: number, y: number, height: number) => {
    setHeightMap((prevHeightMap) => {
      const newHeightMap = [...prevHeightMap];
      newHeightMap[x][y] = height;
      return newHeightMap;
    });
  };

  return (
    <Canvas
      id="canvas"
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <fog attach="fog" args={[fogColor, 10, 100]} />
      <ambientLight intensity={lightIntensity * 0.5 * (1 - cloudCover * 0.5)} />
      <pointLight
        position={sunPosition}
        intensity={lightIntensity * (1 - cloudCover * 0.5)}
        castShadow
      />
      <directionalLight
        position={new THREE.Vector3(0, 1, 0)}
        intensity={lightIntensity * (1 - cloudCover * 0.5)}
        castShadow
      />
      <Sky sunPosition={sunPosition} />
      <OrbitControls ref={orbitControlsRef} enabled={currentTool === "move"} />
      <Ground
        ref={groundRef}
        onPlantPlace={placePlant}
        onHover={setHoveredPosition}
        heightMap={heightMap}
        onHeightChange={handleGroundHeightChange}
        setHeightmap={setHeightMap}
      />
      {showGrid && <GridSystem size={20} divisions={20} />}
      <PlantsInstances groundRef={groundRef} />
      <RainEffect intensity={rainIntensity} />
      <WindEffect speed={windSpeed} />
    </Canvas>
  );
};
