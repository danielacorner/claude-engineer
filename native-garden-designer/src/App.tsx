import React, { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import Ground from "./components/Ground";
import PlantSelector from "./components/PlantSelector";
import PlantInstance from "./components/PlantInstance";
import EnvironmentControls from "./components/EnvironmentControls";
import SaveLoadControls from "./components/SaveLoadControls";
import PlantGrowthSimulation from "./components/PlantGrowthSimulation";
import RainEffect from "./components/RainEffect";
import WindEffect from "./components/WindEffect";
import { Plant, PlantData } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { Instructions } from "./Instructions";

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [timeOfDay, setTimeOfDay] = useState(12); // Noon by default
  const [season, setSeason] = useState("Summer");
  const [showPlantInfo, setShowPlantInfo] = useState<Plant | null>(null);
  const [customizingPlant, setCustomizingPlant] = useState<Plant | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [rainIntensity, setRainIntensity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [cloudCover, setCloudCover] = useState(0);

  const addPlant = (plantData: PlantData | null) => {
    setSelectedPlant(plantData);
  };

  const placePlant = (position: [number, number, number]) => {
    if (selectedPlant) {
      const newPlant: Plant = {
        ...selectedPlant,
        id: Date.now(),
        position,
      };
      setPlants([...plants, newPlant]);
      setSelectedPlant(null);
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

  const updatePlant = (id: number, updates: Partial<Plant>) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, ...updates } : plant
      )
    );
  };

  const sunPosition: [number, number, number] = useMemo(() => {
    const phi = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(phi) * 100;
    const y = Math.sin(phi) * 100;
    return [x, y, 0];
  }, [timeOfDay]);

  const lightIntensity = useMemo(() => {
    const normalizedTime = timeOfDay / 24;
    return Math.sin(normalizedTime * Math.PI) * 0.5 + 0.5;
  }, [timeOfDay]);

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
        <ambientLight
          intensity={lightIntensity * 0.5 * (1 - cloudCover * 0.5)}
        />
        <pointLight
          position={sunPosition}
          intensity={lightIntensity * (1 - cloudCover * 0.5)}
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
              rainIntensity={rainIntensity * /* plant.rainResistance || */ 1}
              windSpeed={windSpeed * /* plant.windResistance || */ 1}
            />
          ))}
        </Suspense>
        <RainEffect intensity={rainIntensity} />
        <WindEffect speed={windSpeed} />
      </Canvas>
      <ErrorBoundary>
        <PlantSelector addPlant={addPlant} selectedPlant={selectedPlant} />
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
