import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { Plant } from '../types'
import { Group, Vector3, InstancedMesh, MeshStandardMaterial, BoxGeometry, Raycaster, Plane, Object3D } from 'three'
import { useSpring, a } from '@react-spring/three'

interface PlantInstanceProps {
  plant: Plant;
  updatePosition: (newPosition: [number, number, number]) => void;
  removePlant: () => void;
  customizePlant: (customizations: Partial<Plant>) => void;
  openPlantInfo: () => void;
  startCustomizing: () => void;
  windSpeed: number;
  rainIntensity: number;
}

const GRID_SIZE = 1; // Size of each grid cell

const PlantInstance: React.FC<PlantInstanceProps> = ({
  plant,
  updatePosition,
  removePlant,
  customizePlant,
  openPlantInfo,
  startCustomizing,
  windSpeed,
  rainIntensity
}) => {
  const groupRef = useRef<Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [position, setPosition] = useState<[number, number, number]>(plant.position)
  const { scene } = useGLTF(plant.modelUrl)
  const { size, viewport, camera, gl, raycaster } = useThree()
  const aspect = size.width / viewport.width

  // Wind animation
  const windFactor = useRef(Math.random() * 0.05 + 0.02).current
  
  // LOD system
  const [lodLevel, setLodLevel] = useState(0)
  const lodDistances = [10, 20, 40] // Distances for each LOD level

  const lodMeshes = useMemo(() => {
    const highDetailModel = scene.clone()
    const mediumDetailModel = scene.clone()
    const lowDetailModel = scene.clone()

    // Simplify medium and low detail models
    simplifyModel(mediumDetailModel, 0.5)
    simplifyModel(lowDetailModel, 0.2)

    return [highDetailModel, mediumDetailModel, lowDetailModel]
  }, [plant, scene])

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(...(plant.scale || [1, 1, 1]))
    }
  }, [plant.scale])

  const [spring, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }))

  useEffect(() => {
    api.start({ scale: isHovered ? 1.1 : 1 })
  }, [isHovered, api])

  const snapToGrid = (point: Vector3): Vector3 => {
    return new Vector3(
      Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      point.y,
      Math.round(point.z / GRID_SIZE) * GRID_SIZE
    );
  };

  const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);

  useFrame((state, delta) => {
    if (isDragging && groupRef.current) {
      const intersection = new Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersection);
      const snappedPosition = snapToGrid(intersection);
      setPosition([snappedPosition.x, 0, snappedPosition.z]);
      updatePosition([snappedPosition.x, 0, snappedPosition.z]);
    }

    // Enhanced wind and rain animation
    if (groupRef.current) {
      animatePlant(groupRef.current, state.clock.elapsedTime, windSpeed, rainIntensity)
    }

    // LOD system
    const distanceToCamera = camera.position.distanceTo(new Vector3(...position))
    const newLodLevel = lodDistances.findIndex(distance => distanceToCamera < distance)
    if (newLodLevel !== lodLevel) {
      setLodLevel(newLodLevel === -1 ? lodDistances.length - 1 : newLodLevel)
    }
  })

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowContextMenu(true)
  }

  const handleCustomize = () => {
    startCustomizing()
    setShowContextMenu(false)
  }

  return (
    <a.group
      ref={groupRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation()
        setIsDragging(true)
        gl.domElement.style.cursor = 'grabbing'
      }}
      onPointerUp={() => {
        setIsDragging(false)
        gl.domElement.style.cursor = 'auto'
      }}
      onPointerOut={() => {
        setIsDragging(false)
        setIsHovered(false)
        gl.domElement.style.cursor = 'auto'
      }}
      onPointerOver={(e) => {
        setIsHovered(true)
        gl.domElement.style.cursor = 'grab'
      }}
      onContextMenu={handleContextMenu}
      {...spring}
    >
      <primitive object={lodMeshes[lodLevel]} />
      {isDragging && (
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="yellow" opacity={0.5} transparent />
        </mesh>
      )}
      <Html distanceFactor={10}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 'bold',
          transform: `scale(${1 / aspect})`,
        }}>
          {plant.name}
        </div>
        {showContextMenu && (
          <div style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '5px',
            zIndex: 1000,
          }}>
            <button onClick={(e) => {
              e.stopPropagation()
              removePlant()
              setShowContextMenu(false)
            }}>Remove Plant</button>
            <button onClick={(e) => {
              e.stopPropagation()
              openPlantInfo()
              setShowContextMenu(false)
            }}>Plant Info</button>
            <button onClick={(e) => {
              e.stopPropagation()
              handleCustomize()
            }}>Customize</button>
          </div>
        )}
      </Html>
    </a.group>
  )
}

function simplifyModel(model: Object3D, factor: number) {
  model.traverse((child) => {
    if (child instanceof InstancedMesh) {
      const geometry = child.geometry;
      const vertexCount = geometry.getAttribute('position').count;
      const newVertexCount = Math.max(4, Math.floor(vertexCount * factor));
      
      // This is a simple vertex reduction. For production, use a more sophisticated algorithm.
      geometry.setDrawRange(0, newVertexCount);
    }
  });
}

function animatePlant(plant: Object3D, time: number, windSpeed: number, rainIntensity: number) {
  plant.traverse((child) => {
    if (child instanceof Object3D) {
      // Different parts of the plant react differently to wind and rain
      const windFactor = Math.random() * 0.05 + 0.02;
      const rainFactor = Math.random() * 0.02 + 0.01;

      // Wind animation
      child.rotation.y = Math.sin(time * windSpeed * windFactor) * windSpeed * 0.1;
      child.position.x = Math.sin(time * windSpeed * windFactor * 2) * windSpeed * 0.05;

      // Rain effect
      child.rotation.x = Math.sin(time * 2) * rainIntensity * rainFactor;
      child.position.y = Math.sin(time * 3) * rainIntensity * rainFactor * 0.1;

      // Adjust material properties for wet appearance
      if (child instanceof InstancedMesh) {
        const material = child.material as MeshStandardMaterial;
        material.roughness = Math.max(0.2, 1 - rainIntensity * 0.5);
        material.metalness = Math.min(0.8, rainIntensity * 0.2);
      }
    }
  });
}

export default PlantInstance