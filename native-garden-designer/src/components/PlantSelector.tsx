import React, { useState } from "react";
import { plants, plantTypes, seasons } from "../data/plants";
import { PlantData } from "../types";
import styles from "./PlantSelector.module.css";

interface PlantSelectorProps {
  addPlant: (plant: PlantData) => void;
  selectedPlant: PlantData | null;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ addPlant, selectedPlant }) => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPlants = plants.filter((plant) => {
    return (
      (!typeFilter || plant.type === typeFilter) &&
      (!seasonFilter || plant.seasons.includes(seasonFilter)) &&
      (!searchTerm || plant.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className={styles.plantSelector}>
      <h3>Plant Selector</h3>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          {plantTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Seasons</option>
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.plantList}>
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className={`${styles.plantCard} ${selectedPlant?.id === plant.id ? styles.selected : ''}`}
            onClick={() => addPlant(plant)}
          >
            <img
              src={plant.thumbnail}
              alt={plant.name}
              className={styles.plantImage}
            />
            <div className={styles.plantInfo}>
              <h4>{plant.name}</h4>
              <p className={styles.plantType}>{plant.type}</p>
              <p className={styles.plantDescription}>{plant.description}</p>
              <p>Height: {plant.height}m</p>
              <p>Width: {plant.width}m</p>
              <p>Seasons: {plant.seasons.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPlant && (
        <div className={styles.selectedPlant}>
          <h4>Selected: {selectedPlant.name}</h4>
          <button onClick={() => addPlant(selectedPlant)}>Place Plant</button>
          <button onClick={() => addPlant(null)}>Clear Selection</button>
        </div>
      )}
    </div>
  );
};

export default PlantSelector;