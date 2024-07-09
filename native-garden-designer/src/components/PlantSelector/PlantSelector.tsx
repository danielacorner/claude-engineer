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
import { IconButton } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

const ITEMS_PER_PAGE = 12;

const PlantSelector: React.FC = () => {
  const selectedPlant = useAppStore((state) => state.selectedPlant);
  const addPlant = useAppStore((state) => state.addPlant);
  const setSelectedPlant = useAppStore((state) => state.setSelectedPlant);
  const setHoveredPlant = useAppStore((state) => state.setHoveredPlant);
  const [[searchTerm, isFirstLetterOnly], setSearchTerm] = useState<
    [string, boolean]
  >(["", false]);
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

  const firstLetterFilteredPlants = isFirstLetterOnly
    ? filteredPlants.filter((plant) => {
        return (
          plant.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          plant.scientificName
            ?.toLowerCase()
            .startsWith(searchTerm.toLowerCase())
        );
      })
    : filteredPlants;

  const pageCount = Math.ceil(
    firstLetterFilteredPlants.length / ITEMS_PER_PAGE
  );
  let paginatedPlants = firstLetterFilteredPlants.slice(
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
  const [open, setOpen] = useState(true);
  return (
    <PlantSelectorStyles
      $open={open}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={() => setHoveredPlant(null)}
    >
      <div className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
        <HtmlTooltip />
      </div>
      <div className={"plantSelectorWrapper"}>
        <div className={"plantSelector"}>
          <IconButton
            onClick={() => setOpen(!open)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "0.5rem",
              zIndex: 1000,
              transform: `rotate(${open ? 0 : 180}deg)`,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <h3>Plant Selector</h3>
          <div className={"filters"}>
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm((p) => [e.target.value, true])}
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
                onClick={() => {
                  setCurrentPage(i + 1);
                  // setSearchTerm([searchTerm[0], false]);
                }}
                className={currentPage === i + 1 ? "activePage" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {/* a second pagination but showing one tile per letter in alphabet, which filters the list to items starting with that letter */}
          <div className={"pagination"}>
            {Array.from({ length: 26 }, (_, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSearchTerm([
                      String.fromCharCode(65 + i).toLowerCase(),
                      true,
                    ]);
                    setCurrentPage(1);
                  }}
                  className={
                    isFirstLetterOnly &&
                    searchTerm[0].toLowerCase() ===
                      String.fromCharCode(65 + i).toLowerCase()
                      ? "activePage"
                      : ""
                  }
                >
                  {String.fromCharCode(65 + i)}
                </button>
              );
            })}
            <button onClick={() => setSearchTerm(["", false])}>Clear</button>
            <button onClick={() => setCurrentPage(1)}>Reset</button>
            <button onClick={() => setSelectedPlant(null)}>Deselect</button>
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
              <button onClick={() => addPlant(selectedPlant)}>
                Place Plant
              </button>
              <button onClick={() => setSelectedPlant(null)}>
                Clear Selection
              </button>
            </div>
          )}
        </div>
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
