import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { plantDatabase } from "../data/plantDatabase";
import { PlantData } from "../types";
import styled from "@emotion/styled";
import { useAppStore } from "../store";
import ErrorBoundary from "./ErrorBoundary";
import { PlantSelectorItem } from "./PlantSelectorItem";
import { HtmlTooltip } from "./HtmlTooltip";

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
    <PlantSelectorStyles>
      <div className="tooltip-wrapper">
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
                  <PlantPreview plant={selectedPlant} />
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

const PlantPreview: React.FC<{ plant: PlantData }> = ({ plant }) => {
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

const PlantSelectorStyles = styled.div`
  position: fixed;
  inset: 0;
  .tooltip-wrapper {
    pointer-events: none;
    position: relative;
    top: 20px;
    width: 420px;
    left: 0;
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .plantSelector {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 350px;
    max-height: calc(100vh - 40px);
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 20px;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .searchInput,
  .filterSelect {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .searchInput:focus,
  .filterSelect:focus {
    outline: none;
    border-color: #4caf50;
  }

  .plantList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }

  .pagination button {
    padding: 6px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .pagination button:hover {
    background-color: #e0e0e0;
  }

  .pagination button.activePage {
    background-color: #4caf50;
    color: white;
  }

  .selectedPlant {
    margin-top: 20px;
    padding: 15px;
    background-color: #e6f7e6;
    border-radius: 8px;
  }

  .selectedPlant h4 {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .preview {
    width: 100%;
    height: 200px;
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
  }

  .colorCustomization {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .colorCustomization label {
    font-size: 14px;
  }

  .colorCustomization input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .selectedPlant button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .selectedPlant button:hover {
    background-color: #45a049;
  }

  .selectedPlant button:last-child {
    background-color: #f44336;
  }

  .selectedPlant button:last-child:hover {
    background-color: #d32f2f;
  }
`;
