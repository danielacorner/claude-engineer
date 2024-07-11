import React from "react";
import { useAppStore } from "../store";

const BottomToolbar: React.FC = () => {
  const { setShowPlantSelector, showPlantSelector, setEditMode } =
    useAppStore();

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <button onClick={() => setShowPlantSelector(!showPlantSelector)}>
        Add Plant
      </button>
      <button onClick={() => setEditMode(true)}>Edit Plant</button>
      {/* Add more buttons as needed */}
    </div>
  );
};

export default BottomToolbar;
