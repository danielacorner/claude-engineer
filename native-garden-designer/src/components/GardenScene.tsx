import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import Ground from "./Ground";
import RainEffect from "./RainEffect";
import WindEffect from "./WindEffect";
import GridSystem from "./GridSystem";
import * as THREE from "three";
import { getAllPlants } from "../data/plantDatabase";
import { useAppStore } from "../store";
import { PlantsInstances } from "./PlantsInstances";
import SelectionRectangle from "./SelectionRectangle";

export const GardenScene: React.FC = () => {
  const {
    rainIntensity,
    windSpeed,
    cloudCover,
    showGrid,
    setHoveredPosition,
    placePlant,
    isDragging,
    isHovered,
    currentTool,
  } = useAppStore();

  const orbitControlsRef = useRef<any>();
  const groundRef = useRef<any>(null);
  const [heightMap, setHeightMap] = useState<number[][]>([]);

  // disable orbitControls while dragging
  useEffect(() => {
    if (!orbitControlsRef.current) {
      return;
    }
    if (isDragging || isHovered) {
      orbitControlsRef.current.enabled = false;
    } else {
      orbitControlsRef.current.enabled = true;
    }
  }, [isDragging, isHovered]);

  const fogColor = useMemo(() => {
    const color = new THREE.Color();
    color.setHSL(0.6, 0.7, 0.9);
    return color;
  }, []);

  const lightIntensity = 1.5;
  const sunPosition = new THREE.Vector3(0, 10, 0);

  useEffect(() => {
    // Initialize height map
    const size = 100;
    const initialHeightMap = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    setHeightMap(initialHeightMap);
  }, []);

  const handleGroundHeightChange = (x: number, y: number, height: number) => {
    setHeightMap((prevHeightMap) => {
      const newHeightMap = [...prevHeightMap];
      newHeightMap[x][y] = height;
      return newHeightMap;
    });
  };

  return (
    <Canvas
      id="canvas"
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <HandleSelectPlants />
      <fog attach="fog" args={[fogColor, 10, 100]} />
      <ambientLight intensity={lightIntensity * 0.5 * (1 - cloudCover * 0.5)} />
      <pointLight
        position={sunPosition}
        intensity={lightIntensity * (1 - cloudCover * 0.5)}
        castShadow
      />
      <directionalLight
        position={new THREE.Vector3(0, 1, 0)}
        intensity={lightIntensity * (1 - cloudCover * 0.5)}
        castShadow
      />
      <Sky sunPosition={sunPosition} />
      <OrbitControls
        ref={orbitControlsRef}
        mouseButtons={{
          LEFT: currentTool === "select" ? undefined : THREE.MOUSE.ROTATE,
          MIDDLE:
            currentTool === "select" ? THREE.MOUSE.DOLLY : THREE.MOUSE.PAN,
          RIGHT:
            currentTool === "select" ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
        }}
      />
      <Ground
        ref={groundRef}
        onPlantPlace={placePlant}
        onHover={setHoveredPosition}
        heightMap={heightMap}
        onHeightChange={handleGroundHeightChange}
        setHeightmap={setHeightMap}
      />
      {showGrid && <GridSystem size={20} divisions={20} />}
      <PlantsInstances groundRef={groundRef} />
      <RainEffect intensity={rainIntensity} />
      <WindEffect speed={windSpeed} />
    </Canvas>
  );
};

function HandleSelectPlants() {
  const {
    setSelectedPlant,

    currentTool,

    setSelectedPlantIds,
  } = useAppStore();

  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(
    null
  );
  const [selectionEnd, setSelectionEnd] = useState<[number, number] | null>(
    null
  );

  const { camera, scene } = useThree();

  useEffect(() => {
    // Load initial plant data
    const allPlants = getAllPlants();
    if (allPlants.length > 0) {
      setSelectedPlant(allPlants[0]);
    }
  }, [setSelectedPlant]);

  const handlePointerDown = (event: PointerEvent) => {
    if (currentTool === "select" && event.button === 0) {
      setSelectionStart([event.clientX, event.clientY]);
      setSelectionEnd(null);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (currentTool === "select" && selectionStart) {
      setSelectionEnd([event.clientX, event.clientY]);
    }
  };

  const handlePointerUp = (_event: PointerEvent) => {
    if (currentTool === "select" && selectionStart && selectionEnd) {
      const selectedPlants = getSelectedPlants(selectionStart, selectionEnd);
      setSelectedPlantIds(selectedPlants.map((plant) => plant.id));
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  const getSelectedPlants = (
    start: [number, number],
    end: [number, number]
  ) => {
    const selectedPlants = [];
    const plants = scene.children.filter((child) => child.userData.isPlant);

    for (const plant of plants) {
      const screenPosition = new THREE.Vector3();
      screenPosition.setFromMatrixPosition(plant.matrixWorld);
      screenPosition.project(camera);

      const x = ((screenPosition.x + 1) * window.innerWidth) / 2;
      const y = ((-screenPosition.y + 1) * window.innerHeight) / 2;

      if (
        x >= Math.min(start[0], end[0]) &&
        x <= Math.max(start[0], end[0]) &&
        y >= Math.min(start[1], end[1]) &&
        y <= Math.max(start[1], end[1])
      ) {
        selectedPlants.push(plant);
      }
    }

    return selectedPlants;
  };

  // handle mouse events if mouse is hovered over the canvas
  // (attach the handler to the window, and just detect when the mouse is over the canvas)
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      return;
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return <SelectionRectangle start={selectionStart} end={selectionEnd} />;
}
