import React, { useState } from "react";
import { GardenScene } from "./components/GardenScene";
import BottomToolbar from "./components/BottomToolbar";
import TopLeftMenu from "./components/TopLeftMenu";
import PlantSelector from "./components/PlantSelector/PlantSelector";
import SelectionRectangle from "./components/SelectionRectangle";
import { useAppStore } from "./store";

function App() {
  const { currentTool } = useAppStore();
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(
    null
  );
  const [selectionEnd, setSelectionEnd] = useState<[number, number] | null>(
    null
  );

  const handlePointerDown = (event: React.PointerEvent) => {
    if (currentTool === "select" && event.button === 0) {
      setSelectionStart([event.clientX, event.clientY]);
      setSelectionEnd(null);
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (currentTool === "select" && selectionStart) {
      setSelectionEnd([event.clientX, event.clientY]);
    }
  };

  const handlePointerUp = (_event: React.PointerEvent) => {
    if (currentTool === "select" && selectionStart && selectionEnd) {
      // Here you would implement the logic to determine which plants are within the selection rectangle
      // and call setSelectedPlantIds with the array of selected plant IDs
      // For now, we'll just log the selection coordinates
      console.log("Selection from", selectionStart, "to", selectionEnd);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  return (
    <div
      className="App"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <GardenScene />
      <BottomToolbar />
      <TopLeftMenu />
      <PlantSelector />
      <SelectionRectangle start={selectionStart} end={selectionEnd} />
    </div>
  );
}

export default App;
