import React, { useEffect } from "react";
import PlantSelector from "./components/PlantSelector/PlantSelector";
import { Plant } from "./types";
import ErrorBoundary from "./components/ErrorBoundary";
import { getAllPlants } from "./data/plantDatabase";
import { useAppStore } from "./store";
import BottomToolbar from "./components/BottomToolbar";
import TopLeftMenu from "./components/TopLeftMenu"; // Import the new TopLeftMenu component
import { GardenScene } from "./components/GardenScene";

const App: React.FC = () => {
  const { setTooltipPlant, showPlantInfo, setSelectedPlant, setShowPlantInfo } =
    useAppStore();

  useEffect(() => {
    // Load initial plant data
    const allPlants = getAllPlants();
    if (allPlants.length > 0) {
      setSelectedPlant(allPlants[0]);
    }
  }, [setSelectedPlant]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        zIndex: 1,
      }}
      onClick={() => {
        setTooltipPlant(null);
      }}
    >
      <TopLeftMenu /> {/* Add the TopLeftMenu component here */}
      <GardenScene />
      <ErrorBoundary>
        <PlantSelector />
      </ErrorBoundary>
      {showPlantInfo && (
        <PlantInfoModal
          plant={showPlantInfo}
          onClose={() => setShowPlantInfo(null)}
        />
      )}
      <BottomToolbar />
    </div>
  );
};

export default App;

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
