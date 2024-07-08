import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { Plane, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface GroundProps {
  onPlantPlace: (position: [number, number, number]) => void;
  onHover: (position: [number, number, number] | null) => void;
  heightMap: number[][];
  onHeightChange?: (x: number, y: number, height: number) => void;
  setHeightmap: React.Dispatch<React.SetStateAction<number[][]>>;
}

const GRID_SIZE = 1; // Size of each grid cell
const GROUND_SIZE = 100; // Total size of the ground plane
const HEIGHTMAP_RESOLUTION = 128; // Resolution of the heightmap

const Ground = React.forwardRef<THREE.Mesh, GroundProps>(
  ({ onPlantPlace, onHover, heightMap, setHeightmap }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera, raycaster, mouse } = useThree();
    const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);

    // Load a grass texture
    const texture = useTexture("/textures/grass.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);

    // Create custom shader material for the ground
    const groundMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        uniforms: {
          grassTexture: { value: texture },
          heightmap: {
            value: new THREE.DataTexture(
              new Float32Array(heightMap.flat()),
              HEIGHTMAP_RESOLUTION,
              HEIGHTMAP_RESOLUTION,
              THREE.RedFormat,
              THREE.FloatType
            ),
          },
          time: { value: 0 },
        },
        vertexShader: `
        uniform float time;
        uniform sampler2D heightmap;
        varying vec2 vUv;
        varying float vHeight;
        void main() {
          vUv = uv;
          vec4 heightData = texture2D(heightmap, uv);
          vHeight = heightData.r;
          vec3 transformed = vec3(position.x, position.y + vHeight * 5.0, position.z);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
        fragmentShader: `
        uniform sampler2D grassTexture;
        varying vec2 vUv;
        varying float vHeight;
        void main() {
          vec4 grassColor = texture2D(grassTexture, vUv * 100.0);
          // Adjust color based on height
          vec3 heightColor = mix(vec3(0.2, 0.5, 0.1), vec3(0.8, 0.8, 0.4), vHeight);
          gl_FragColor = vec4(grassColor.rgb * heightColor, 1.0);
        }
      `,
      });
    }, [texture, heightMap]);

    // Animate grass
    useFrame(({ clock }) => {
      if (groundMaterial) {
        groundMaterial.uniforms.time.value = clock.getElapsedTime();
      }
    });
    const getHeightAtPosition = useCallback(
      (x: number, z: number) => {
        const xIndex = Math.floor(
          ((x + GROUND_SIZE / 2) / GROUND_SIZE) * heightMap[0].length
        );
        const zIndex = Math.floor(
          ((z + GROUND_SIZE / 2) / GROUND_SIZE) * heightMap.length
        );
        return heightMap[zIndex][xIndex] * 5; // Multiply by 5 to match the shader's height scale
      },
      [heightMap]
    );

    const handleClick = () => {
      if (meshRef.current) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0) {
          const { point } = intersects[0];
          const snappedPosition = snapToGrid(point);
          const height = getHeightAtPosition(
            snappedPosition.x,
            snappedPosition.z
          );
          onPlantPlace([snappedPosition.x, height, snappedPosition.z]);
        }
      }
    };

    const handlePointerMove = () => {
      if (meshRef.current) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0) {
          const { point } = intersects[0];
          const snappedPosition = snapToGrid(point);
          const height = getHeightAtPosition(
            snappedPosition.x,
            snappedPosition.z
          );
          const hoverPointWithHeight = new THREE.Vector3(
            snappedPosition.x,
            height,
            snappedPosition.z
          );
          setHoverPoint(hoverPointWithHeight);
          onHover([
            hoverPointWithHeight.x,
            hoverPointWithHeight.y,
            hoverPointWithHeight.z,
          ]);
        } else {
          setHoverPoint(null);
          onHover(null);
        }
      }
    };

    const snapToGrid = (point: THREE.Vector3): THREE.Vector3 => {
      return new THREE.Vector3(
        Math.round(point.x / GRID_SIZE) * GRID_SIZE,
        point.y,
        Math.round(point.z / GRID_SIZE) * GRID_SIZE
      );
    };

    const adjustGroundHeight = useCallback(
      (_x: number, _z: number, delta: number) => {
        // const xIndex = Math.floor(
        //   ((x + GROUND_SIZE / 2) / GROUND_SIZE) * HEIGHTMAP_RESOLUTION
        // );
        // const zIndex = Math.floor(
        //   ((z + GROUND_SIZE / 2) / GROUND_SIZE) * HEIGHTMAP_RESOLUTION
        // );
        // const index = zIndex * HEIGHTMAP_RESOLUTION + xIndex;

        setHeightmap((prevHeightmap) => {
          const newHeightmap: number[][] = prevHeightmap.map((row, y) =>
            row.map((height, x) => {
              const index = y * HEIGHTMAP_RESOLUTION + x;
              if (index === index) {
                return Math.max(0, Math.min(1, height + delta));
              }
              return height;
            })
          );
          groundMaterial.uniforms.heightmap.value.image.data = new Float32Array(
            newHeightmap.flat()
          );
          groundMaterial.uniforms.heightmap.value.needsUpdate = true;
          return newHeightmap;
        });
      },
      [groundMaterial.uniforms.heightmap.value, setHeightmap]
    );

    // Add event listeners for ground height adjustment
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (hoverPoint) {
          if (event.key === "q") {
            adjustGroundHeight(hoverPoint.x, hoverPoint.z, 0.01);
          } else if (event.key === "e") {
            adjustGroundHeight(hoverPoint.x, hoverPoint.z, -0.01);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [hoverPoint, adjustGroundHeight]);

    useImperativeHandle(ref, () => meshRef.current as any);

    return (
      <group>
        <Plane
          ref={meshRef}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          args={[
            GROUND_SIZE,
            GROUND_SIZE,
            HEIGHTMAP_RESOLUTION - 1,
            HEIGHTMAP_RESOLUTION - 1,
          ]}
          onClick={handleClick}
          onPointerMove={handlePointerMove}
        >
          <primitive object={groundMaterial} attach="material" />
        </Plane>
        <gridHelper
          args={[GROUND_SIZE, GROUND_SIZE / GRID_SIZE, "#888888", "#444444"]}
          position={[0, 0.01, 0]}
        />
        {hoverPoint && (
          <>
            <mesh position={hoverPoint}>
              <boxGeometry args={[GRID_SIZE, 0.1, GRID_SIZE]} />
              <meshBasicMaterial color="yellow" opacity={0.5} transparent />
            </mesh>
            <mesh position={[hoverPoint.x, hoverPoint.y + 0.5, hoverPoint.z]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="red" />
            </mesh>
          </>
        )}
      </group>
    );
  }
);

export default Ground;
