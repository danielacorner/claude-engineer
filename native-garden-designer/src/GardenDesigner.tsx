import React, { useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Plane, Html } from '@react-three/drei'
import * as THREE from 'three'
import plants from './plantDatabase'

interface PlantInstance {
  id: string
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
}

const Ground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [heightMap, setHeightMap] = useState<number[][]>([])

  // Initialize height map
  React.useEffect(() => {
    const size = 100
    const initialHeightMap = Array(size).fill(null).map(() => Array(size).fill(0))
    setHeightMap(initialHeightMap)
  }, [])

  // Update ground geometry based on height map
  useFrame(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry
      const position = geometry.attributes.position
      const size = Math.sqrt(position.count)

      for (let i = 0; i < position.count; i++) {
        const x = i % size
        const y = Math.floor(i / size)
        const z = heightMap[x]?.[y] || 0
        position.setZ(i, z)
      }

      position.needsUpdate = true
      geometry.computeVertexNormals()
    }
  })

  return (
    <Plane args={[100, 100, 99, 99]} rotation={[-Math.PI / 2, 0, 0]} ref={meshRef}>
      <meshStandardMaterial color="green" side={THREE.DoubleSide} />
    </Plane>
  )
}

const Plant: React.FC<{ plant: any, position: THREE.Vector3 }> = ({ plant, position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, plant.height / 100, 1]} />
      <meshStandardMaterial color={plant.flowerColor.toLowerCase()} />
      <Html position={[0, plant.height / 200 + 0.5, 0]}>
        <div style={{ background: 'white', padding: '5px', borderRadius: '5px' }}>
          {plant.name}
        </div>
      </Html>
    </mesh>
  )
}

const GardenDesigner: React.FC = () => {
  const [placedPlants, setPlacedPlants] = useState<PlantInstance[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)

  const handlePlantSelection = (plantId: string) => {
    setSelectedPlant(plantId)
  }

  const handlePlantPlacement = (event: any) => {
    if (selectedPlant) {
      const plant = plants.find(p => p.id === selectedPlant)
      if (plant) {
        const newPlant: PlantInstance = {
          id: `${plant.id}-${Date.now()}`,
          position: event.point,
          rotation: new THREE.Euler(),
          scale: new THREE.Vector3(1, 1, 1)
        }
        setPlacedPlants([...placedPlants, newPlant])
      }
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Ground />
        {placedPlants.map(plant => {
          const plantData = plants.find(p => p.id === plant.id.split('-')[0])
          return plantData ? (
            <Plant key={plant.id} plant={plantData} position={plant.position} />
          ) : null
        })}
        <OrbitControls />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: 10 }}>
        <h3>Plant Selection</h3>
        {plants.map(plant => (
          <button key={plant.id} onClick={() => handlePlantSelection(plant.id)}>
            {plant.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GardenDesigner