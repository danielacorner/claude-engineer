import React, { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import Ground from "./components/Ground";
import PlantSelector from "./components/PlantSelector";
import PlantInstance from "./components/PlantInstance";
import EnvironmentControls from "./components/EnvironmentControls";
import SaveLoadControls from "./components/SaveLoadControls";
import { Plant, PlantData } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [timeOfDay, setTimeOfDay] = useState(12); // Noon by default
  const [season, setSeason] = useState("Summer");
  const [showPlantInfo, setShowPlantInfo] = useState<Plant | null>(null);
  const [customizingPlant, setCustomizingPlant] = useState<Plant | null>(null);

  const addPlant = (plantData: PlantData | null) => {
    setSelectedPlant(plantData);
  };

  const placePlant = (position: [number, number, number]) => {
    if (selectedPlant) {
      const newPlant: Plant = {
        ...selectedPlant,
        id: Date.now(), // Use timestamp as a simple unique id
        position,
      };
      setPlants([...plants, newPlant]);
      setSelectedPlant(null); // Reset selected plant after placing
    }
  };

  const updatePlantPosition = (
    id: number,
    newPosition: [number, number, number]
  ) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, position: newPosition } : plant
      )
    );
  };

  const removePlant = (id: number) => {
    setPlants(plants.filter((plant) => plant.id !== id));
  };

  const loadPlants = (loadedPlants: Plant[]) => {
    setPlants(loadedPlants);
  };

  const customizePlant = (id: number, customizations: Partial<Plant>) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, ...customizations } : plant
      )
    );
    setCustomizingPlant(null);
  };

  const openPlantInfo = (plant: Plant) => {
    setShowPlantInfo(plant);
  };

  const startCustomizingPlant = (plant: Plant) => {
    setCustomizingPlant(plant);
  };

  // Calculate sun position based on time of day
  const sunPosition: [number, number, number] = useMemo(() => {
    const phi = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(phi) * 100;
    const y = Math.sin(phi) * 100;
    return [x, y, 0];
  }, [timeOfDay]);

  // Adjust light intensity based on time of day
  const lightIntensity = useMemo(() => {
    const normalizedTime = timeOfDay / 24;
    return Math.sin(normalizedTime * Math.PI) * 0.5 + 0.5;
  }, [timeOfDay]);

  // Adjust fog color based on season
  const fogColor = useMemo(() => {
    switch (season) {
      case "Spring":
        return "#e6f0ff";
      case "Summer":
        return "#f0f5ff";
      case "Autumn":
        return "#fff0e6";
      case "Winter":
        return "#f0f0f0";
      default:
        return "#ffffff";
    }
  }, [season]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <fog attach="fog" args={[fogColor, 10, 100]} />
        <ambientLight intensity={lightIntensity * 0.5} />
        <pointLight
          position={sunPosition}
          intensity={lightIntensity}
          castShadow
        />
        <Sky sunPosition={sunPosition} />
        <OrbitControls />
        <Ground onPlantPlace={placePlant} />
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
            />
          ))}
        </Suspense>
      </Canvas>
      <ErrorBoundary>
        <PlantSelector addPlant={addPlant} selectedPlant={selectedPlant} />
      </ErrorBoundary>
      <EnvironmentControls
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        season={season}
        setSeason={setSeason}
      />
      <SaveLoadControls plants={plants} loadPlants={loadPlants} />
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
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Instructions:</h3>
        <p>1. Select a plant from the list on the left.</p>
        <p>2. Click on the ground to place the selected plant.</p>
        <p>3. Click and drag to move placed plants.</p>
        <p>4. Right-click on a plant for more options:</p>
        <ul>
          <li>View plant information</li>
          <li>Customize plant appearance</li>
          <li>Remove plant</li>
        </ul>
        <p>5. Use the environment controls to adjust time and season.</p>
        <p>6. Save and load your garden designs using the controls.</p>
      </div>
    </div>
  );
};

export default App;
