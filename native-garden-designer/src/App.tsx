import React, { useState, Suspense, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Html } from "@react-three/drei";
import Ground from "./components/Ground";
import PlantSelector from "./components/PlantSelector";
import PlantInstance from "./components/PlantInstance";
import PlantPreview from "./components/PlantPreview";
import EnvironmentControls from "./components/EnvironmentControls";
import SaveLoadControls from "./components/SaveLoadControls";
import PlantGrowthSimulation from "./components/PlantGrowthSimulation";
import RainEffect from "./components/RainEffect";
import WindEffect from "./components/WindEffect";
import GridSystem from "./components/GridSystem";
import { Plant, PlantData } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { Instructions } from "./Instructions";
import Tutorial from "./components/Tutorial";
import * as THREE from "three";

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

  const lightIntensity = 1; // Declare the lightIntensity variable
  const sunPosition = new THREE.Vector3(0, 10, 0); // Declare and initialize the sunPosition variable as a Vector3 object

  function placePlant(position: [number, number, number]): void {
    const newPlant = {
      id: plants.length + 1,
      position,
      species: selectedPlant,
      customizations: {},
    };
    setPlants([...plants, newPlant] as Plant[]);
  }

  function updatePlantPosition(
    id: number,
    newPosition: [number, number, number]
  ): void {
    const plantToUpdate = plants.find((plant) => plant.id === id);
    if (plantToUpdate) {
      plantToUpdate.position = newPosition;
      setPlants([...plants]);
    }
  }

  function removePlant(id: number): void {
    setPlants(plants.filter((plant) => plant.id !== id));
  }
  function customizePlant(id: number, customizations: Partial<Plant>): void {
    const updatedPlants = plants.map((plant) => {
      if (plant.id === id) {
        return { ...plant, ...customizations };
      }
      return plant;
    });
    setPlants(updatedPlants);
  }

  function openPlantInfo(plant: Plant): void {
    setSelectedPlant(plant);
    setShowPlantInfo(plant);
  }

  function startCustomizingPlant(plant: Plant): void {
    setSelectedPlant(plant);
    setShowCustomizer(true);
  }
  function resetCamera(): void {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
    }
  }
  function loadPlants(plants: Plant[]): void {
    setPlants(plants);
  }

  function addPlant(plantData: PlantData | null): void {
    if (plantData) {
      const newPlant: Plant = {
        ...plantData,
        id: plants.length + 1,
        position: [0, 0, 0],
      };
      setPlants(
        [...plants, newPlant].filter((plant) => plant.id !== plantData.id)
      );
    }
  }

  function updatePlant(id: number, updates: Partial<Plant>): void {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, ...updates } : plant
      )
    );
  }

  // ... (keep all the existing functions as they are)

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
          {plants.map((plant) => (
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
        <PlantSelector
          addPlant={addPlant}
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
        />
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
      <PlantGrowthSimulation
        plants={plants}
        updatePlant={updatePlant}
        timeSpeed={timeSpeed}
        season={season}
        rainIntensity={rainIntensity}
        windSpeed={windSpeed}
        cloudCover={cloudCover}
      />
      {showPlantInfo && (
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
          <h2>{showPlantInfo.name}</h2>
          <p>
            <strong>Scientific Name:</strong>{" "}
            {showPlantInfo.scientificName || "N/A"}
          </p>
          <p>
            <strong>Model URL:</strong> {showPlantInfo.modelUrl}
          </p>
          <p>
            <strong>Scale:</strong> {showPlantInfo.scale.join(", ")}
          </p>
          <p>
            <strong>Height:</strong> {showPlantInfo.height || "N/A"}m
          </p>
          <p>
            <strong>Spread:</strong> {showPlantInfo.spread || "N/A"}m
          </p>
          <p>
            <strong>Description:</strong> {showPlantInfo.description || "N/A"}
          </p>
          <p>
            <strong>Color:</strong> {showPlantInfo.color || "Default"}
          </p>
          <button onClick={() => setShowPlantInfo(null)}>Close</button>
        </div>
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
function setShowCustomizer(arg0: boolean) {
  throw new Error("Function not implemented.");
}
