import React, { useState, Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Html } from "@react-three/drei";
import Ground from "./components/Ground";
import PlantSelector from "./components/PlantSelector";
import PlantInstance from "./components/PlantInstance";
import PlantPreview from "./components/PlantPreview";
import EnvironmentControls from "./components/EnvironmentControls";
import SaveLoadControls from "./components/SaveLoadControls";
import RainEffect from "./components/RainEffect";
import WindEffect from "./components/WindEffect";
import GridSystem from "./components/GridSystem";
import { Plant, PlantData } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { Instructions } from "./Instructions";
import Tutorial from "./components/Tutorial";
import * as THREE from "three";
import { getAllPlants, getPlantById } from "./data/plantDatabase";

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<
    [number, number, number] | null
  >(null);
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [season, setSeason] = useState("Summer");
  const [showPlantInfo, setShowPlantInfo] = useState<Plant | null>(null);
  const [customizingPlant, setCustomizingPlant] = useState<Plant | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [rainIntensity, setRainIntensity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [cloudCover, setCloudCover] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orbitControlsRef = useRef<any>();
  const groundRef = useRef<any>(null);

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
  }, []);

  function placePlant(position: [number, number, number]): void {
    if (selectedPlant) {
      const newPlant: Plant = {
        ...selectedPlant,
        id: plants.length + 1,
        position,
      };
      setPlants([...plants, newPlant]);
    }
  }

  function updatePlantPosition(
    id: number,
    newPosition: [number, number, number]
  ): void {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, position: newPosition } : plant
      )
    );
  }

  function removePlant(id: number): void {
    setPlants(plants.filter((plant) => plant.id !== id));
  }

  function customizePlant(id: number, customizations: Partial<Plant>): void {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, ...customizations } : plant
      )
    );
  }

  function openPlantInfo(plant: Plant): void {
    setShowPlantInfo(plant);
  }

  function startCustomizingPlant(plant: Plant): void {
    setCustomizingPlant(plant);
  }

  function resetCamera(): void {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
    }
  }

  function loadPlants(loadedPlants: Plant[]): void {
    setPlants(loadedPlants);
  }

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
        />
        {showGrid && <GridSystem size={20} divisions={20} />}
        <Suspense fallback={null}>
          {plants
            .filter((p) => p.modelUrl)
            .map((plant) => (
              <PlantInstance
                key={plant.id}
                plant={plant}
                updatePosition={(newPosition) =>
                  updatePlantPosition(plant.id, newPosition)
                }
                removePlant={() => removePlant(plant.id)}
                customizePlant={(customizations) =>
                  customizePlant(plant.id, customizations)
                }
                openPlantInfo={() => openPlantInfo(plant)}
                startCustomizing={() => startCustomizingPlant(plant)}
                rainIntensity={rainIntensity}
                windSpeed={windSpeed}
                groundRef={groundRef}
              />
            ))}
          {selectedPlant && hoveredPosition && (
            <PlantPreview plant={selectedPlant} position={hoveredPosition} />
          )}
        </Suspense>
        <RainEffect intensity={rainIntensity} />
        <WindEffect speed={windSpeed} />
        <CompassIcon onClick={resetCamera} />
      </Canvas>

      <ErrorBoundary>
        <PlantSelector />
      </ErrorBoundary>
      <EnvironmentControls
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        season={season}
        setSeason={setSeason}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        rainIntensity={rainIntensity}
        setRainIntensity={setRainIntensity}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        cloudCover={cloudCover}
        setCloudCover={setCloudCover}
      />
      <SaveLoadControls plants={plants} loadPlants={loadPlants} />
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
