import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { plantDatabase } from "../../data/plantDatabase";
import { PlantData } from "../../types";
import { useAppStore } from "../../store";
import ErrorBoundary from "../ErrorBoundary";
import { PlantSelectorItem } from "./PlantSelectorItem";
import { HtmlTooltip } from "./HtmlTooltip";
import { PlantSelectorStyles } from "./PlantSelectorStyles";

const ITEMS_PER_PAGE = 12;

const PlantSelector: React.FC = () => {
  const selectedPlant = useAppStore((state) => state.selectedPlant);
  const addPlant = useAppStore((state) => state.addPlant);
  const setSelectedPlant = useAppStore((state) => state.setSelectedPlant);
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

  // const handleImageError = (
  //   event: React.SyntheticEvent<HTMLImageElement, Event>
  // ) => {
  //   event.currentTarget.src = "/plant_thumbnails/default.jpg";
  // };

  return (
    <PlantSelectorStyles onClick={(e) => e.stopPropagation()}>
      <div className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
        <HtmlTooltip />
      </div>
      <div className={"plantSelector"}>
        <h3>Plant Selector</h3>
        <div className={"filters"}>
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={"searchInput"}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={"categorySelect"}
          >
            {categories.map((category, idx) => (
              <option key={category ?? idx} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className={"plantList"}>
          {paginatedPlants.map((plant, idx) => (
            <PlantSelectorItem {...{ plant, idx }} />
          ))}
        </div>
        <div className={"pagination"}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "activePage" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {selectedPlant && (
          <div className={"selectedPlant"}>
            <h4>Selected: {selectedPlant.name}</h4>
            <div ref={previewRef} className={"preview"}>
              <ErrorBoundary>
                {selectedPlant.modelUrl ? (
                  <PlantSelectionPreview plant={selectedPlant} />
                ) : null}
              </ErrorBoundary>
            </div>
            <div className={"colorCustomization"}>
              <label htmlFor="colorPicker">Customize Color:</label>
              <input
                type="color"
                id="colorPicker"
                value={customColor || selectedPlant.color || "#ffffff"}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
            <button onClick={() => addPlant(selectedPlant)}>Place Plant</button>
            <button onClick={() => setSelectedPlant(null)}>
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </PlantSelectorStyles>
  );
};

const PlantSelectionPreview: React.FC<{ plant: PlantData }> = ({ plant }) => {
  const { scene } = useGLTF(plant.modelUrl);

  return scene ? (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} scale={plant.scale} />
      <OrbitControls />
    </Canvas>
  ) : null;
};

export default PlantSelector;
