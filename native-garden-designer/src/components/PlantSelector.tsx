import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import plantDatabase from "../data/plantDatabase";
import { PlantData } from "../types";
import styles from "./PlantSelector.module.css";

interface PlantSelectorProps {
  addPlant: (plant: PlantData | null) => void;
  selectedPlant: PlantData | null;
}

const ITEMS_PER_PAGE = 12;

const PlantSelector: React.FC<PlantSelectorProps> = ({
  addPlant,
  selectedPlant,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(plantDatabase.map((plant) => plant.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredPlants = useMemo(() => {
    return plantDatabase.filter((plant) => {
      const matchesSearch =
        !searchTerm ||
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        plant.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || plant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const pageCount = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (selectedPlant) {
      addPlant({ ...selectedPlant, color });
    }
  };

  const PlantPreview: React.FC<{ plant: PlantData }> = ({ plant }) => {
    const { scene } = useGLTF(plant.modelUrl);
    return (
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <primitive object={scene} scale={plant.scale} />
        <OrbitControls />
      </Canvas>
    );
  };

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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.plantList}>
        {paginatedPlants.map((plant) => (
          <div
            key={plant.id}
            className={`${styles.plantCard} ${
              selectedPlant?.id === plant.id ? styles.selected : ""
            }`}
            onClick={() => addPlant(plant)}
          >
            <img
              src={`/plant_thumbnails/${plant.id}.jpg`}
              alt={plant.name}
              className={styles.plantImage}
            />
            <div className={styles.plantInfo}>
              <h4>{plant.name}</h4>
              <p className={styles.scientificName}>{plant.scientificName}</p>
              <p className={styles.plantDescription}>{plant.description}</p>
              {plant.height && <p>Height: {plant.height}m</p>}
              {plant.spread && <p>Spread: {plant.spread}m</p>}
              <p className={styles.category}>Category: {plant.category}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {selectedPlant && (
        <div className={styles.selectedPlant}>
          <h4>Selected: {selectedPlant.name}</h4>
          <div ref={previewRef} className={styles.preview}>
            <PlantPreview plant={selectedPlant} />
          </div>
          <div className={styles.colorCustomization}>
            <label htmlFor="colorPicker">Customize Color:</label>
            <input
              type="color"
              id="colorPicker"
              value={customColor || selectedPlant.color || "#ffffff"}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
          <button onClick={() => addPlant(selectedPlant)}>Place Plant</button>
          <button onClick={() => addPlant(null)}>Clear Selection</button>
        </div>
      )}
    </div>
  );
};

export default PlantSelector;
