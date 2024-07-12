import React, { Suspense } from "react";
import PlantInstance from "./PlantInstance";
import PlantPreview from "./PlantSelector/PlantPreview";
import { useAppStore } from "../store";
import * as THREE from "three";

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
        <PlantPreview
          plant={selectedPlant}
          cursorPosition={
            new THREE.Vector3(
              hoveredPosition[0],
              hoveredPosition[1],
              hoveredPosition[2]
            )
          }
        />
      )}
    </Suspense>
  );
}
