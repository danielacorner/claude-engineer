import React, { Suspense } from "react";
import PlantInstance from "./PlantInstance";
import PlantPreview from "./PlantSelector/PlantPreview";
import { useAppStore } from "../store";
import * as THREE from "three";
import { uniq, uniqBy } from "lodash";
import { AlwaysShiftSelect } from "./AlwaysShiftSelect";

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
  const uniqPlants = uniqBy(plants, "id");
  return (
    <AlwaysShiftSelect
      requireShift={!selectionEnabled}
      multiple={true}
      box={selectionEnabled}
      onChange={(selectedMeshes: any) => {
        if (!selectionEnabled) {
          return;
        }
        const selectedIds = selectedMeshes.map(
          (mesh: any) => mesh.parent?.userData.id
        );
        const uniqIds = uniq(selectedIds);
        setSelectedPlantIds(uniqIds as any);
      }}
    >
      <Suspense fallback={null}>
        {uniqPlants.map((plant) => (
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
    </AlwaysShiftSelect>
  );
}
