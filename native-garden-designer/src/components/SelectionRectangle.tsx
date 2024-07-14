import React, { useEffect } from "react";
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

interface SelectionRectangleProps {
  start: [number, number] | null;
  end: [number, number] | null;
}

const SelectionRectangle: React.FC<SelectionRectangleProps> = ({
  start,
  end,
}) => {
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
