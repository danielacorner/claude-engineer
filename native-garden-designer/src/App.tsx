import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky, Html } from "@react-three/drei";
import Ground from "./components/Ground";
import PlantSelector from "./components/PlantSelector";
import EnvironmentControls from "./components/EnvironmentControls";
import SaveLoadControls from "./components/SaveLoadControls";
import RainEffect from "./components/RainEffect";
import WindEffect from "./components/WindEffect";
import GridSystem from "./components/GridSystem";
import { Plant } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { Instructions } from "./Instructions";
import * as THREE from "three";
import { getAllPlants } from "./data/plantDatabase";
import { useAppStore } from "./store";
import { PlantsInstances } from "./components/PlantsInstances";

const App: React.FC = () => {
  const {
    plants,
    selectedPlant,
    hoveredPosition,
    timeOfDay,
    season,
    showPlantInfo,
    rainIntensity,
    windSpeed,
    cloudCover,
    showGrid,
    setSelectedPlant,
    setPlants,
    setHoveredPosition,
    placePlant,
    updatePlantPosition,
    removePlant,
    customizePlant,
    setShowPlantInfo,
    setCustomizingPlant,
  } = useAppStore();

  const orbitControlsRef = useRef<any>();
  const groundRef = useRef<any>(null);
  const [heightMap, setHeightMap] = useState<number[][]>([]);

  const fogColor = useMemo(() => {
    const color = new THREE.Color();
    color.setHSL(0.6, 0.7, 0.9);
    return color;
  }, []);

  const lightIntensity = 1;
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

  function resetCamera(): void {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
    }
  }

  function loadPlants(loadedPlants: Plant[]): void {
    setPlants(loadedPlants);
  }

  const handleGroundHeightChange = (x: number, y: number, height: number) => {
    setHeightMap((prevHeightMap) => {
      const newHeightMap = [...prevHeightMap];
      newHeightMap[x][y] = height;
      return newHeightMap;
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas id="canvas" shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <fog attach="fog" args={[fogColor, 10, 100]} />
        <ambientLight
          intensity={lightIntensity * 0.5 * (1 - cloudCover * 0.5)}
        />
        <pointLight
          position={sunPosition}
          intensity={lightIntensity * (1 - cloudCover * 0.5)}
          castShadow
        />
        <Sky sunPosition={sunPosition} />
        <OrbitControls ref={orbitControlsRef} />
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
        <CompassIcon onClick={resetCamera} />
      </Canvas>

      <ErrorBoundary>
        <PlantSelector />
      </ErrorBoundary>
      <EnvironmentControls />
      <SaveLoadControls />
      {showPlantInfo && (
        <PlantInfoModal
          plant={showPlantInfo}
          onClose={() => setShowPlantInfo(null)}
        />
      )}
      <Instructions />
    </div>
  );
};

export default App;

function CompassIcon(props: { onClick: () => void }): JSX.Element {
  return (
    <Html>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={props.onClick}
      >
        <img src="https://picsum.photos/50/50" alt="Compass" />
      </div>
    </Html>
  );
}

function PlantInfoModal({
  plant,
  onClose,
}: {
  plant: Plant;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <h2>{plant.name}</h2>
      <p>
        <strong>Scientific Name:</strong> {plant.scientificName || "N/A"}
      </p>
      <p>
        <strong>Model URL:</strong> {plant.modelUrl}
      </p>
      <p>
        <strong>Scale:</strong> {plant.scale.join(", ")}
      </p>
      <p>
        <strong>Height:</strong> {plant.height || "N/A"}m
      </p>
      <p>
        <strong>Spread:</strong> {plant.spread || "N/A"}m
      </p>
      <p>
        <strong>Description:</strong> {plant.description || "N/A"}
      </p>
      <p>
        <strong>Color:</strong> {plant.color || "Default"}
      </p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
