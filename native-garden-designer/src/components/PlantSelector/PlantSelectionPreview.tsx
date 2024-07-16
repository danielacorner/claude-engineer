import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { PlantData } from "../../types";
import ErrorBoundary from "../ErrorBoundary";
import * as THREE from "three";

export const PlantSelectionPreview: React.FC<{ plant: PlantData }> = ({
  plant,
}) => {
  const [error, setError] = useState<string | null>(null);

  if (!plant.modelUrl) {
    return <div>No 3D model available for this plant.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Error loading 3D model</div>}>
      <Suspense fallback={<div>Loading 3D model...</div>}>
        <Canvas camera={{ position: [0, 0.5, 1], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Model plant={plant} setError={setError} />
          <OrbitControls />
        </Canvas>
      </Suspense>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </ErrorBoundary>
  );
};
const Model: React.FC<{
  plant: PlantData;
  setError: (error: string) => void;
}> = ({ plant, setError }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);

  const { scene } = useGLTF(plant.modelUrl);
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        if (isMounted) {
          setModel(scene);
        }
      } catch (error) {
        console.error("Error loading 3D model:", error);
        if (isMounted) {
          setError(`Error loading 3D model: ${(error as Error).message}`);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [plant.modelUrl, setError, scene]);

  if (!model) {
    return null;
  }

  return <primitive object={model} scale={plant.scale} />;
};
