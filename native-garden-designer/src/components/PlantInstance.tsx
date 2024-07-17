import React, { useRef, useState, useEffect, useMemo } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { DragControls, useGLTF } from "@react-three/drei";
import { Plant } from "../types";
import {
  Group,
  Vector3,
  InstancedMesh,
  MeshStandardMaterial,
  Raycaster,
  Object3D,
} from "three";
import { useSpring, a } from "@react-spring/three";
import PlantGrowthAnimation from "./PlantGrowthAnimation";
import { useAppStore } from "../store";
import { HEIGHT_SCALE } from "../constants";
import { useEvent } from "react-use";
import * as THREE from "three";

const GRID_SIZE = 1; // Size of each grid cell
const HOVER_SCALE = 1.05; // Scale factor for hover effect

const PlantInstance = ({
  plant,
  id,
  groundRef,
}: {
  plant: Plant;
  id: number;
  groundRef: React.RefObject<Object3D>;
}) => {
  const {
    windSpeed,
    rainIntensity,
    isDragging,
    setIsDragging,
    isHovered,
    setIsHovered,
    hoveredPlant,
    setHoveredPlant,
    setShowContextMenu,
    gridMode,
    currentTool,
    selectedPlantIds,
    updateSelectedPlantsPositions,
  } = useAppStore();

  const [isDraggingPreview, setIsDraggingPreview] = useState<false | Vector3>(
    false
  );

  const groupRef = useRef<Group>(null);
  const plantHeight = (plant.height ?? 0) * HEIGHT_SCALE;
  const [position, setPosition] = useState<[number, number, number]>([
    plant.position[0],
    plant.position[1] + plantHeight,
    plant.position[2],
  ]);
  useEffect(() => {
    setPosition([
      plant.position[0],
      plant.position[1] + plantHeight,
      plant.position[2],
    ]);
  }, [plant.position, plantHeight]);
  const [rotation] = useState<[number, number, number]>(
    plant.rotation ?? [0, 0, 0]
  );
  const { scene } = useGLTF(plant.modelUrl);

  const { camera, gl, raycaster } = useThree();
  const [isGrowing] = useState(true);

  // LOD system
  const [lodLevel, setLodLevel] = useState(0);
  const lodDistances = [10, 20, 40]; // Distances for each LOD level

  const lodMeshes = useMemo(() => {
    const highDetailModel = scene.clone();
    const mediumDetailModel = scene.clone();
    const lowDetailModel = scene.clone();

    // Simplify medium and low detail models
    simplifyModel(mediumDetailModel, 0.5);
    simplifyModel(lowDetailModel, 0.2);

    return [highDetailModel, mediumDetailModel, lowDetailModel];
  }, [scene]);

  const [spring, api] = useSpring(() => ({
    scale: plant.scale[0] ?? 1,
  }));

  useEffect(() => {
    api.start({
      scale: (plant.scale[0] ?? 1) * (isHovered === plant.id ? HOVER_SCALE : 1),
      immediate: false,
    });
  }, [isHovered, api, plant.id, plant.scale]);

  const snapToGrid = (
    point: Vector3 | [number, number, number]
  ): [number, number, number] => {
    const x =
      typeof (point as any).x === "number"
        ? (point as any).x
        : (point as any)[0];
    const y =
      typeof (point as any).y === "number"
        ? (point as any).y
        : (point as any)[1];
    const z =
      typeof (point as any).z === "number"
        ? (point as any).z
        : (point as any)[2];
    return [
      Math.round(x / GRID_SIZE) * GRID_SIZE,
      y,
      Math.round(z / GRID_SIZE) * GRID_SIZE,
    ];
  };

  // const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);

  const getGroundHeight = (x: number, z: number): number => {
    if (groundRef.current) {
      const raycaster = new Raycaster(
        new Vector3(x, 100, z),
        new Vector3(0, -1, 0)
      );
      const intersects = raycaster.intersectObject(groundRef.current, true);
      if (intersects.length > 0) {
        return intersects[0].point.y;
      }
    }
    return 0;
  };

  useFrame((state) => {
    if (groupRef.current && !isGrowing) {
      animatePlant(
        groupRef.current,
        state.clock.elapsedTime,
        windSpeed,
        rainIntensity
      );
    }

    // LOD system
    const distanceToCamera = camera.position.distanceTo(
      new Vector3(...position)
    );
    const newLodLevel = lodDistances.findIndex(
      (distance) => distanceToCamera < distance
    );
    if (newLodLevel !== lodLevel) {
      setLodLevel(newLodLevel === -1 ? lodDistances.length - 1 : newLodLevel);
    }
  });

  const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setShowContextMenu(plant.id);
  };

  const handleGrowthComplete = () => {
    // setIsGrowing(false);
  };
  useEvent("pointerup", () => {
    setIsDragging(false);
    gl.domElement.style.cursor = "auto";
  });

  // Create outline material
  const outlineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ff00) },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          float glow = sin(time * 2.0) * 0.5 + 0.5;
          gl_FragColor = vec4(color, 1.0) * intensity * glow;
        }
      `,
      side: THREE.FrontSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const ref = useRef<THREE.Group>(null);
  const isSelected = selectedPlantIds.includes(plant.id);

  // Simulate wind effect and update outline glow
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      if (isSelected && outlineMaterial.uniforms) {
        outlineMaterial.uniforms.time.value = time;
      }
    }
  });
  const isPlantHovered = hoveredPlant && hoveredPlant.id === id;
  const prevDragOffset = useRef(new Vector3(0, 0, 0));
  return (
    <DragControls
      axisLock="y"
      onDragStart={(_e) => {
        setIsDragging(plant.id);

        const intersection = new THREE.Vector3();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        raycaster.ray.intersectPlane(
          new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
          intersection
        );
        const totalDragOffset = intersection.sub(
          new THREE.Vector3(...position)
        );
        console.log("⭐� ~ totalDragOffset:", totalDragOffset);
        setIsDraggingPreview(totalDragOffset);
      }}
      onDrag={(_e) => {
        if (!isDraggingPreview) return;
        // The actual drag logic is now handled in the DraggablePreview component
      }}
      onDragEnd={() => {
        setIsDragging(false);
        // only update the position using the dragged plant (we're in PlantInstance here)
        if (!isPlantHovered) {
          return;
        }
        // Final position update is handled in the store

        const intersection = new THREE.Vector3();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        raycaster.ray.intersectPlane(
          new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
          intersection
        );

        const snappedPosition = gridMode
          ? snapToGrid(intersection)
          : [intersection.x, intersection.y, intersection.z];
        console.log("⭐� ~ snappedPosition:", snappedPosition);
        const groundHeight = getGroundHeight(
          snappedPosition[0],
          snappedPosition[2]
        );
        const newPosition = [
          snappedPosition[0],
          groundHeight + plantHeight,
          snappedPosition[2],
        ] as [number, number, number];
        console.log("⭐� ~ newPosition:", newPosition);
        const offset = new Vector3(...position).sub(
          new Vector3(...newPosition)
        );
        console.log("⭐� ~ offset:", offset);

        if (!isDraggingPreview) {
          return;
        }
        const [x, y, z] = [
          isDraggingPreview.x,
          isDraggingPreview.y,
          isDraggingPreview.z,
        ];
        const [dx, dy, dz] = [x - offset.x, y - offset.y, z - offset.z];
        updateSelectedPlantsPositions([dx, dy, dz]);
        prevDragOffset.current = offset;
        setIsDraggingPreview(false);
      }}
    >
      <a.group
        ref={groupRef}
        position={position}
        onPointerDown={(_e) => {
          if (currentTool === "select") {
            return;
          }
          if (!selectedPlantIds.includes(plant.id)) {
            useAppStore.getState().setSelectedPlantIds([plant.id]);
          }
        }}
        onPointerUp={() => {
          if (currentTool === "select") {
            return;
          }
          gl.domElement.style.cursor = "auto";
        }}
        onPointerOut={() => {
          setIsHovered(false);
          setHoveredPlant(null);
          gl.domElement.style.cursor = "auto";
        }}
        onPointerOver={() => {
          setIsHovered(plant.id);
          setHoveredPlant(plant);
          gl.domElement.style.cursor = "grab";
        }}
        onContextMenu={isDragging ? () => {} : handleContextMenu}
        {...spring}
      >
        {isSelected && <SelectedIndicator hovered={Boolean(isPlantHovered)} />}
        <mesh rotation={rotation}>
          <PlantGrowthAnimation
            scale={plant.scale || [1, 1, 1]}
            growthDuration={1}
            onGrowthComplete={handleGrowthComplete}
            id={plant.id}
          >
            <primitive
              ref={ref}
              object={lodMeshes[lodLevel]}
              userData-id={plant.id}
            />
          </PlantGrowthAnimation>
        </mesh>
      </a.group>
    </DragControls>
  );
};
function SelectedIndicator({ hovered }: { hovered: boolean }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color="yellow"
        opacity={hovered ? 0.5 : 0.25}
        transparent
      />
    </mesh>
  );
}

function simplifyModel(model: Object3D, factor: number) {
  model.traverse((child) => {
    if (child instanceof InstancedMesh) {
      const geometry = child.geometry;
      const vertexCount = geometry.getAttribute("position").count;
      const newVertexCount = Math.max(4, Math.floor(vertexCount * factor));

      // This is a simple vertex reduction. For production, use a more sophisticated algorithm.
      geometry.setDrawRange(0, newVertexCount);
    }
  });
}

function animatePlant(
  plant: Object3D,
  time: number,
  windSpeed: number,
  rainIntensity: number
) {
  plant.traverse((child) => {
    if (child instanceof Object3D) {
      // Different parts of the plant react differently to wind and rain
      const windFactor = Math.random() * 0.05 + 0.02;
      const rainFactor = Math.random() * 0.02 + 0.01;

      // Wind animation
      child.rotation.y =
        Math.sin(time * windSpeed * windFactor) * windSpeed * 0.1;
      const windX =
        Math.sin(time * windSpeed * windFactor * 2) * windSpeed * 0.05;
      child.position.x = child.position.x + windX;

      // Rain effect
      child.rotation.x = Math.sin(time * 2) * rainIntensity * rainFactor;
      const rainY = Math.sin(time * 3) * rainIntensity * rainFactor * 0.1;
      child.position.y = child.position.y + rainY;

      // Adjust material properties for wet appearance
      if (child instanceof InstancedMesh) {
        const material = child.material as MeshStandardMaterial;
        material.roughness = Math.max(0.2, 1 - rainIntensity * 0.5);
        material.metalness = Math.min(0.8, rainIntensity * 0.2);
      }
    }
  });
}

export default PlantInstance;
