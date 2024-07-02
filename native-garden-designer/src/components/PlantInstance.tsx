import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { Plant } from '../types'
import { Group, Vector3, InstancedMesh, MeshStandardMaterial, BoxGeometry } from 'three'
import { useSpring, a } from '@react-spring/three'

interface PlantInstanceProps {
  plant: Plant;
  updatePosition: (newPosition: [number, number, number]) => void;
  removePlant: () => void;
}

const PlantInstance: React.FC<PlantInstanceProps> = ({ plant, updatePosition, removePlant }) => {
  const groupRef = useRef<Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [position, setPosition] = useState<[number, number, number]>(plant.position)
  const { scene, animations } = useGLTF(plant.model)
  const { size, viewport, camera } = useThree()
  const aspect = size.width / viewport.width

  // Wind animation
  const windFactor = useRef(Math.random() * 0.05 + 0.02).current
  const windSpeed = useRef(Math.random() * 1.5 + 0.5).current
  
  // LOD system
  const [lodLevel, setLodLevel] = useState(0)
  const lodDistances = [20, 50, 100] // Distances for each LOD level

  const lodMeshes = useMemo(() => {
    const geometry = new BoxGeometry(plant.width, plant.height, plant.width)
    const material = new MeshStandardMaterial({ color: 0x00ff00 })
    return [
      scene.clone(), // High detail
      new InstancedMesh(geometry, material, 1), // Medium detail
      new InstancedMesh(geometry, material, 1), // Low detail
    ]
  }, [plant, scene])

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(1, plant.height, 1)
    }
  }, [plant.height])

  const [spring, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }))

  useEffect(() => {
    api.start({ scale: isHovered ? 1.1 : 1 })
  }, [isHovered, api])

  useFrame((state, delta) => {
    if (isDragging && groupRef.current) {
      const intersection = state.raycaster.intersectObjects(state.scene.children)[0]
      if (intersection) {
        const { x, z } = intersection.point
        const newPosition: [number, number, number] = [x, 0, z]
        setPosition(newPosition)
        updatePosition(newPosition)
      }
    }

    // Wind animation
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * windSpeed) * windFactor
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * windSpeed * 2) * windFactor * 0.2
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

  return (
    <a.group
      ref={groupRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation()
        setIsDragging(true)
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerOut={() => {
        setIsDragging(false)
        setIsHovered(false)
      }}
      onPointerOver={() => setIsHovered(true)}
      onContextMenu={handleContextMenu}
      {...spring}
    >
      <primitive object={lodMeshes[lodLevel]} />
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
              // TODO: Implement plant info dialog
              setShowContextMenu(false)
            }}>Plant Info</button>
            <button onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement plant customization
              setShowContextMenu(false)
            }}>Customize</button>
          </div>
        )}
      </Html>
    </a.group>
  )
}

export default PlantInstance