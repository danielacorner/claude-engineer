import React, { useState, useRef, useEffect, useMemo } from "react";
import { plantDatabase } from "../../data/plantDatabase";
import { useAppStore } from "../../store";
import ErrorBoundary from "../ErrorBoundary";
import { PlantSelectorItem } from "./PlantSelectorItem";
import { HtmlTooltip } from "./HtmlTooltip";
import { PlantSelectorStyles } from "./PlantSelectorStyles";
import { IconButton } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { PlantSelectionPreview } from "./PlantSelectionPreview";
import styled from "styled-components";

const ITEMS_PER_PAGE = 12;

const PlantSelector: React.FC = () => {
  const selectedPlant = useAppStore((state) => state.selectedPlant);
  const addPlant = useAppStore((state) => state.addPlant);
  const setSelectedPlant = useAppStore((state) => state.setSelectedPlant);
  const setHoveredPlant = useAppStore((state) => state.setHoveredPlant);
  const {
    showPlantSelector,
    setShowPlantSelector,
    currentTool,
    setCurrentTool,
  } = useAppStore();
  useEffect(() => {
    if (currentTool !== "add") {
      setShowPlantSelector(false);
    }
  }, [currentTool, setShowPlantSelector]);
  const [[searchTerm, isFirstLetterOnly], setSearchTerm] = useState<
    [string, boolean]
  >(["", false]);
  const [currentPageIdx, setcurrentPageIdx] = useState(1);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setcurrentPageIdx(1);
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
  const paginatedPlants = firstLetterFilteredPlants.slice(
    (currentPageIdx - 1) * ITEMS_PER_PAGE,
    currentPageIdx * ITEMS_PER_PAGE
  );

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (selectedPlant) {
      addPlant({ ...selectedPlant, color });
    }
  };

  return (
    <PlantSelectorStyles
      $open={showPlantSelector}
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={() => setHoveredPlant(null)}
    >
      <div className="tooltip-wrapper" onClick={(e) => e.stopPropagation()}>
        <HtmlTooltip />
      </div>
      <PanelWrapper>
        <CloseButton
          onClick={() => {
            setShowPlantSelector(false);
            setCurrentTool("select");
          }}
        >
          <ArrowBackIos />
        </CloseButton>
        <div className={"plantSelector"}>
          <h3>Plant Selector</h3>
          <div className={"filters"}>
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(() => [e.target.value, true])}
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
              <PlantSelectorItem key={plant.name} {...{ plant, idx }} />
            ))}
          </div>
          <div className={"pagination"}>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setcurrentPageIdx(i + 1);
                  // setSearchTerm([searchTerm[0], false]);
                }}
                className={currentPageIdx === i + 1 ? "activePage" : ""}
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
                    setcurrentPageIdx(1);
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
            <button onClick={() => setcurrentPageIdx(1)}>Reset</button>
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
      </PanelWrapper>
    </PlantSelectorStyles>
  );
};

export default PlantSelector;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  background-color: #f0f0f0;
  border-radius: 4px 0 0 4px;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const PanelWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 342px;

  &:hover ${CloseButton} {
    opacity: 1;
  }

  .plantSelector {
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  &:hover .plantSelector {
    padding-right: 9px;
    scrollbar-width: thin;
    -ms-overflow-style: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  }
`;
