import React from 'react';
import { useAppStore } from '../store';
import { Plant } from '../types';

const PlantEditor: React.FC = () => {
  const { customizingPlant, customizePlant, setCustomizingPlant } = useAppStore();

  if (!customizingPlant) return null;

  const handleCustomization = (field: keyof Plant, value: any) => {
    customizePlant(customizingPlant.id, { [field]: value });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      <h2>Edit Plant: {customizingPlant.name}</h2>
      <div>
        <label>
          Scale:
          <input
            type="number"
            value={customizingPlant.scale[0]}
            onChange={(e) => handleCustomization('scale', [parseFloat(e.target.value), parseFloat(e.target.value), parseFloat(e.target.value)])}
          />
        </label>
      </div>
      <div>
        <label>
          Color:
          <input
            type="color"
            value={customizingPlant.color || '#ffffff'}
            onChange={(e) => handleCustomization('color', e.target.value)}
          />
        </label>
      </div>
      {/* Add more customization options as needed */}
      <button onClick={() => setCustomizingPlant(null)}>Close</button>
    </div>
  );
};

export default PlantEditor;