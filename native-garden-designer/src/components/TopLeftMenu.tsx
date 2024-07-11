import React, { useState } from 'react';
import { useAppStore } from '../store';

const TopLeftMenu: React.FC = () => {
  const { plants, setPlants } = useAppStore();
  const [designs, setDesigns] = useState<{ name: string; plants: any[] }[]>([]);
  const [currentDesign, setCurrentDesign] = useState<string>('');

  const saveDesign = () => {
    const designName = prompt('Enter a name for this design:');
    if (designName) {
      const newDesign = { name: designName, plants: plants };
      setDesigns([...designs, newDesign]);
      setCurrentDesign(designName);
      localStorage.setItem('gardenDesigns', JSON.stringify([...designs, newDesign]));
    }
  };

  const loadDesign = (designName: string) => {
    const design = designs.find(d => d.name === designName);
    if (design) {
      setPlants(design.plants);
      setCurrentDesign(designName);
    }
  };

  React.useEffect(() => {
    const savedDesigns = localStorage.getItem('gardenDesigns');
    if (savedDesigns) {
      setDesigns(JSON.parse(savedDesigns));
    }
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      background: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}>
      <button onClick={saveDesign}>Save Design</button>
      <select 
        value={currentDesign} 
        onChange={(e) => loadDesign(e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="">Load Design</option>
        {designs.map((design, index) => (
          <option key={index} value={design.name}>{design.name}</option>
        ))}
      </select>
    </div>
  );
};

export default TopLeftMenu;