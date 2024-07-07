import React from "react";
import { useTexture } from "@react-three/drei";
import { PlantData } from "../types";

interface PlantPreviewProps {
  plant: PlantData;
  position: [number, number, number];
}

const PlantPreview: React.FC<PlantPreviewProps> = ({ plant, position }) => {
  const texture = useTexture(plant.previewImage || "https://picsum.photos/200");

  return (
    <sprite position={position} scale={plant.scale}>
      <spriteMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={0.5}
      />
    </sprite>
  );
};

export default PlantPreview;
