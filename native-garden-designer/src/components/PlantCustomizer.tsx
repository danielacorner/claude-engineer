import React, { useState } from 'react';
import { Plant } from '../types';

interface PlantCustomizerProps {
  plant: Plant;
  customizePlant: (customizations: Partial<Plant>) => void;
  closePlantCustomizer: () => void;
}

const PlantCustomizer: React.FC<PlantCustomizerProps> = ({ plant, customizePlant, closePlantCustomizer }) => {
  const [height, setHeight] = useState(plant.height);
  const [width, setWidth] = useState(plant.width);
  const [color, setColor] = useState(plant.color || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    customizePlant({ height, width, color: color || undefined });
    closePlantCustomizer();
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      <h2>Customize {plant.name}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="height">Height (m): </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="width">Width (m): </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="color">Color: </label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="">Default</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit">Apply Changes</button>
          <button type="button" onClick={closePlantCustomizer}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PlantCustomizer;