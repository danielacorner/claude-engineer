import { create } from "zustand";
import { PlantData } from "./types";

interface PlantState {
  allPlants: PlantData[];
  selectedPlant: PlantData | null;
  setSelectedPlant: (plant: PlantData | null) => void;
  addPlant: (plant: PlantData) => void;
}

export const usePlantStore = create<PlantState>((set) => ({
  allPlants: [],
  selectedPlant: null,
  setSelectedPlant: (plant: PlantData | null) => {
    set((state) => ({
      selectedPlant: plant,
    }));
  },
  addPlant: (plant: PlantData) => {
    set((state) => ({
      allPlants: [...state.allPlants, plant],
      selectedPlant: plant,
    }));
  },
}));
