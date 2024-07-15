import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppStore } from "../store";

const SelectionRect = styled.div<{
  start: [number, number];
  end: [number, number];
}>`
  position: fixed;
  border: 2px solid #007bff;
  background-color: rgba(0, 123, 255, 0.1);
  pointer-events: none;
  left: ${(props) => Math.min(props.start[0], props.end[0])}px;
  top: ${(props) => Math.min(props.start[1], props.end[1])}px;
  width: ${(props) => Math.abs(props.end[0] - props.start[0])}px;
  height: ${(props) => Math.abs(props.end[1] - props.start[1])}px;
`;

const SelectionRectangle: React.FC<{}> = () => {
  const [end, setSelectionEnd] = useState<[number, number] | null>(null);
  const [start, setSelectionStart] = useState<[number, number] | null>(null);
  const { currentTool } = useAppStore();
  const handlePointerDown = (event: PointerEvent) => {
    if (currentTool === "select" && event.button === 0) {
      setSelectionStart([event.clientX, event.clientY]);
      setSelectionEnd(null);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (currentTool === "select") {
      setSelectionEnd([event.clientX, event.clientY]);
    }
  };

  const handlePointerUp = (_event: PointerEvent) => {
    if (currentTool === "select") {
      // Here you would implement the logic to determine which plants are within the selection rectangle
      // and call setSelectedPlantIds with the array of selected plant IDs
      // For now, we'll just log the selection coordinates
      console.log("Selection from", start, "to", end);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  useEffect(() => {
    const sceneWrapper = document.querySelector<HTMLDivElement>("body");
    if (!sceneWrapper) return;
    sceneWrapper.addEventListener("pointerdown", handlePointerDown);
    sceneWrapper.addEventListener("pointermove", handlePointerMove);
    sceneWrapper.addEventListener("pointerup", handlePointerUp);
    return () => {
      sceneWrapper.removeEventListener("pointerdown", handlePointerDown);
      sceneWrapper.removeEventListener("pointermove", handlePointerMove);
      sceneWrapper.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const { plants, setSelectedPlantIds } = useAppStore();

  // in a performant way, when start and end change, change selected plants according to the rectangle's position on the viewport vs the plant's position on the scene
  useEffect(() => {
    if (!start || !end) return;
    const newSelectedPlantIds: number[] = [];
    for (const plant of plants) {
      if (
        plant.position[0] >= start[0] &&
        plant.position[0] <= end[0] &&
        plant.position[1] >= start[1] &&
        plant.position[1] <= end[1]
      ) {
        newSelectedPlantIds.push(plant.id);
      }
    }
    setSelectedPlantIds(newSelectedPlantIds);
  }, [start, end]);
  if (!start || !end) return null;
  return <SelectionRect start={start} end={end} />;
};

export default SelectionRectangle;
