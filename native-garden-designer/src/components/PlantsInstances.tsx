import React, { Suspense } from "react";
import PlantInstance from "./PlantInstance";
import PlantPreview from "./PlantSelector/PlantPreview";
import { useAppStore } from "../store";
import * as THREE from "three";
import { Select } from "@react-three/drei";
import { uniq } from "lodash";

export function PlantsInstances({
  groundRef,
}: {
  groundRef: React.RefObject<any>;
}) {
  const {
    plants,
    selectedPlant,
    setSelectedPlantIds,
    hoveredPosition,
    currentTool,
  } = useAppStore();
  const selectionEnabled = currentTool === "select";
  return (
    <Select
      multiple
      box={selectionEnabled}
      onChange={(selectedMeshes) => {
        if (!selectionEnabled) {
          return;
        }
        const selectedIds = selectedMeshes.map(
          (mesh) => mesh.parent?.userData.id
        );
        const uniqIds = uniq(selectedIds);
        setSelectedPlantIds(uniqIds);
      }}
    >
      <Suspense fallback={null}>
        {plants.map((plant) => (
          <PlantInstance
            key={plant.id}
            id={plant.id}
            plant={plant}
            groundRef={groundRef}
          />
        ))}
        {selectedPlant && hoveredPosition && currentTool === "add" && (
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
    </Select>
  );
}
