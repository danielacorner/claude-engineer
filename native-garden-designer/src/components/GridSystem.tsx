import React from 'react';
import { Grid } from '@react-three/drei';

interface GridSystemProps {
  size: number;
  divisions: number;
}

const GridSystem: React.FC<GridSystemProps> = ({ size, divisions }) => {
  return (
    <Grid
      args={[size, size, divisions, divisions]}
      cellSize={size / divisions}
      cellThickness={0.5}
      cellColor="#6f6f6f"
      sectionSize={size / divisions}
      sectionThickness={1}
      sectionColor="#9f9f9f"
      fadeDistance={size}
      fadeStrength={1}
      position={[0, 0.01, 0]} // Slightly above the ground to prevent z-fighting
    />
  );
};

export default GridSystem;