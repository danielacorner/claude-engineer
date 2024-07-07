import React, { useState } from 'react';
import { Plant } from '../types';

interface PlantCustomizerProps {
  plant: Plant;
  onCustomize: (customizations: Partial<Plant>) => void;
  onClose: () => void;
}

const PlantCustomizer: React.FC<PlantCustomizerProps> = ({ plant, onCustomize, onClose }) => {
  const [customizations, setCustomizations] = useState<Partial<Plant>>({
    scale: plant.scale || [1, 1, 1],
    color: plant.color || '#ffffff',
    height: plant.height || 1,
    spread: plant.spread || 1,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'scale') {
      const scale = value.split(',').map(Number) as [number, number, number];
      setCustomizations({ ...customizations, scale });
    } else if (name === 'height' || name === 'spread') {
      setCustomizations({ ...customizations, [name]: Number(value) });
    } else {
      setCustomizations({ ...customizations, [name]: value });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCustomize(customizations);
    onClose();
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
          <label htmlFor="scale">Scale (x,y,z):</label>
          <input
            type="text"
            id="scale"
            name="scale"
            value={customizations.scale?.join(',')}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="color">Color:</label>
          <input
            type="color"
            id="color"
            name="color"
            value={customizations.color}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="height">Height (m):</label>
          <input
            type="number"
            id="height"
            name="height"
            value={customizations.height}
            onChange={handleInputChange}
            step="0.1"
            min="0.1"
          />
        </div>
        <div>
          <label htmlFor="spread">Spread (m):</label>
          <input
            type="number"
            id="spread"
            name="spread"
            value={customizations.spread}
            onChange={handleInputChange}
            step="0.1"
            min="0.1"
          />
        </div>
        <button type="submit">Apply Changes</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default PlantCustomizer;