import { create } from "zustand";
import { PlantData, Plant } from "./types";

interface AppState {
  allPlants: PlantData[];
  selectedPlant: PlantData | null;
  plants: Plant[];
  hoveredPosition: [number, number, number] | null;
  timeOfDay: number;
  season: string;
  showPlantInfo: Plant | null;
  customizingPlant: Plant | null;
  timeSpeed: number;
  rainIntensity: number;
  windSpeed: number;
  cloudCover: number;
  showGrid: boolean;
  showTutorial: boolean;
  errorMessage: string | null;

  setSelectedPlant: (plant: PlantData | null) => void;
  addPlant: (plant: PlantData) => void;
  setPlants: (plants: Plant[]) => void;
  setHoveredPosition: (position: [number, number, number] | null) => void;
  setTimeOfDay: (time: number) => void;
  setSeason: (season: string) => void;
  setShowPlantInfo: (plant: Plant | null) => void;
  setCustomizingPlant: (plant: Plant | null) => void;
  setTimeSpeed: (speed: number) => void;
  setRainIntensity: (intensity: number) => void;
  setWindSpeed: (speed: number) => void;
  setCloudCover: (cover: number) => void;
  setShowGrid: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  setErrorMessage: (message: string | null) => void;

  placePlant: (position: [number, number, number]) => void;
  updatePlantPosition: (
    id: number,
    newPosition: [number, number, number]
  ) => void;
  removePlant: (id: number) => void;
  customizePlant: (id: number, customizations: Partial<Plant>) => void;
  openPlantInfo: (plant: Plant) => void;
}

export const useAppStore = create<AppState>((set) => ({
  allPlants: [],
  selectedPlant: null,
  plants: [],
  hoveredPosition: null,
  timeOfDay: 12,
  season: "Summer",
  showPlantInfo: null,
  customizingPlant: null,
  timeSpeed: 1,
  rainIntensity: 0,
  windSpeed: 0,
  cloudCover: 0,
  showGrid: true,
  showTutorial: true,
  errorMessage: null,

  setSelectedPlant: (plant) => set({ selectedPlant: plant }),
  addPlant: (plant) =>
    set((state) => ({
      allPlants: [...state.allPlants, plant],
      selectedPlant: { ...plant, position: state.hoveredPosition || [0, 0, 0] },
    })),
  setPlants: (plants) => set({ plants }),
  setHoveredPosition: (position) => set({ hoveredPosition: position }),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setSeason: (season) => set({ season }),
  setShowPlantInfo: (plant) => set({ showPlantInfo: plant }),
  setCustomizingPlant: (plant) => set({ customizingPlant: plant }),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setRainIntensity: (intensity) => set({ rainIntensity: intensity }),
  setWindSpeed: (speed) => set({ windSpeed: speed }),
  setCloudCover: (cover) => set({ cloudCover: cover }),
  setShowGrid: (show) => set({ showGrid: show }),
  setShowTutorial: (show) => set({ showTutorial: show }),
  setErrorMessage: (message) => set({ errorMessage: message }),

  placePlant: (position) =>
    set((state) => {
      if (state.selectedPlant) {
        const newPlant: Plant = {
          ...state.selectedPlant,
          id: state.plants.length + 1,
          position,
        };
        return { plants: [...state.plants, newPlant] };
      }
      return state;
    }),

  updatePlantPosition: (id, newPosition) =>
    set((state) => ({
      plants: state.plants.map((plant) =>
        plant.id === id ? { ...plant, position: newPosition } : plant
      ),
    })),

  removePlant: (id) =>
    set((state) => ({
      plants: state.plants.filter((plant) => plant.id !== id),
    })),

  customizePlant: (id, customizations) =>
    set((state) => ({
      plants: state.plants.map((plant) =>
        plant.id === id ? { ...plant, ...customizations } : plant
      ),
    })),

  openPlantInfo: (plant) =>
    set((state) => ({
      showPlantInfo: plant,
      customizingPlant: null,
    })),
}));
