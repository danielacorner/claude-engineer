import React, { useState, useEffect } from "react";
import { PlantData } from "../../types";
import * as THREE from "three";

interface PlantPreviewProps {
  plant: PlantData;
  position: [number, number, number];
}

const PlantPreview: React.FC<PlantPreviewProps> = ({ plant, position }) => {
  const [error, setError] = useState<string | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!plant || !plant.previewImage) {
      setError("Invalid plant data");
      return;
    }

    const loadTexture = async () => {
      try {
        const loadedTexture = await new THREE.TextureLoader().loadAsync(
          plant.previewImage ?? ""
        );
        setTexture(loadedTexture);
        setError(null);
      } catch (err) {
        console.error("Failed to load texture:", err);
        setError("Failed to load plant preview");
      }
    };

    loadTexture();
  }, [plant]);

  if (error) {
    return (
      <sprite position={position} scale={[1, 1, 1]}>
        <spriteMaterial attach="material">
          <canvasTexture attach="map" image={getErrorCanvas(error)} />
        </spriteMaterial>
      </sprite>
    );
  }

  if (!texture) {
    return null; // Or you could return a loading indicator here
  }

  return (
    <sprite position={position} scale={plant.scale || [1, 1, 1]}>
      <spriteMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={0.5}
      />
    </sprite>
  );
};

function getErrorCanvas(message: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, 128, 128);
  }
  return canvas;
}

export default PlantPreview;
