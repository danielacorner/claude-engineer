import React, { Suspense } from "react";
import PlantInstance from "./PlantInstance";
import PlantPreview from "./PlantSelector/PlantPreview";
import { useAppStore } from "../store";

export function PlantsInstances({
  groundRef,
}: {
  groundRef: React.RefObject<any>;
}) {
  const { plants, selectedPlant, hoveredPosition } = useAppStore();
  return (
    <Suspense fallback={null}>
      {plants.map((plant) => (
        <PlantInstance
          key={plant.id}
          id={plant.id}
          plant={plant}
          groundRef={groundRef}
        />
      ))}
      {selectedPlant && hoveredPosition && (
        <PlantPreview plant={selectedPlant} position={hoveredPosition} />
      )}
    </Suspense>
  );
}
