import React, { useState } from "react";
import { useAppStore } from "../store";

const SaveLoadControls: React.FC = () => {
  const { plants, setPlants } = useAppStore();
  const [designName, setDesignName] = useState("");

  const saveDesign = () => {
    if (designName) {
      const design = {
        name: designName,
        plants: plants,
        timestamp: new Date().toISOString(),
      };
      const savedDesigns = JSON.parse(
        localStorage.getItem("gardenDesigns") || "[]"
      );
      savedDesigns.push(design);
      localStorage.setItem("gardenDesigns", JSON.stringify(savedDesigns));
      alert(`Design "${designName}" saved successfully!`);
      setDesignName("");
    } else {
      alert("Please enter a name for your design.");
    }
  };

  const loadDesign = () => {
    const savedDesigns = JSON.parse(
      localStorage.getItem("gardenDesigns") || "[]"
    );
    if (savedDesigns.length === 0) {
      alert("No saved designs found.");
      return;
    }

    const designOptions = savedDesigns.map(
      (design: any, index: number) =>
        `${index + 1}. ${design.name} (${new Date(
          design.timestamp
        ).toLocaleString()})`
    );

    const selectedIndex = prompt(
      `Select a design to load:\n${designOptions.join("\n")}`
    );
    if (selectedIndex !== null) {
      const index = parseInt(selectedIndex) - 1;
      if (index >= 0 && index < savedDesigns.length) {
        setPlants(savedDesigns[index].plants);
        alert(`Design "${savedDesigns[index].name}" loaded successfully!`);
      } else {
        alert("Invalid selection.");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        background: "rgba(255, 255, 255, 0.8)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <h3>Save/Load Design</h3>
      <div>
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="Enter design name"
        />
        <button onClick={saveDesign}>Save Design</button>
      </div>
      <div>
        <button onClick={loadDesign}>Load Design</button>
      </div>
    </div>
  );
};

export default SaveLoadControls;
