import { StateCreator, create } from "zustand";
import { PlantData, Plant } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  allPlants: PlantData[];
  selectedPlant: PlantData | null;
  hoveredPlant: PlantData | null;
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
  tooltipPlant: PlantData | null;
  showPlantSelector: boolean;
  editMode: boolean;
  setTooltipPlant: (plant: PlantData | null) => void;
  setSelectedPlant: (plant: PlantData | null) => void;
  setHoveredPlant: (plant: PlantData | null) => void;
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
  setShowPlantSelector: (show: boolean) => void;
  setEditMode: (edit: boolean) => void;

  placePlant: (position: [number, number, number]) => void;
  updatePlantPosition: (
    id: number,
    newPosition: [number, number, number]
  ) => void;
  removePlant: (id: number) => void;
  customizePlant: (id: number, customizations: Partial<Plant>) => void;
  openPlantInfo: (plant: Plant) => void;
  showEnvironmentControls: boolean;
  setShowEnvironmentControls: (show: boolean) => void;
  isDragging: false | number;
  setIsDragging: (dragging: false | number) => void;
  isHovered: false | number;
  setIsHovered: (hovered: false | number) => void;
}

export const useAppStore = create<AppState>(
  persist(
    (set) => ({
      allPlants: [],
      selectedPlant: null,
      hoveredPlant: null,
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
      tooltipPlant: null,
      showPlantSelector: false,
      editMode: false,
      setTooltipPlant: (plant) => set({ tooltipPlant: plant }),
      setSelectedPlant: (plant) => set({ selectedPlant: plant }),
      setHoveredPlant: (plant) => set({ hoveredPlant: plant }),
      addPlant: (plant) =>
        set((state) => ({
          allPlants: [...state.allPlants, plant],
          selectedPlant: {
            ...plant,
            position: state.hoveredPosition || [0, 0, 0],
          },
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
      setShowPlantSelector: (show) => set({ showPlantSelector: show }),
      setEditMode: (edit) => set({ editMode: edit }),

      placePlant: (position) =>
        set((state) => {
          if (state.selectedPlant) {
            const newPlant: Plant = {
              ...state.selectedPlant,
              id: state.plants.length + 1,
              position,
              instanceId: state.plants.length + 1,
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
        set(() => ({
          showPlantInfo: plant,
          customizingPlant: null,
        })),
      showEnvironmentControls: false,
      setShowEnvironmentControls: (show) =>
        set({ showEnvironmentControls: show }),
      isDragging: false,
      setIsDragging: (dragging) => set({ isDragging: dragging }),
      isHovered: false,
      setIsHovered: (hovered) => set({ isHovered: hovered }),
    }),
    {
      name: "app",
      storage: createJSONStorage(() => window.localStorage),
    }
  ) as StateCreator<AppState, [], []>
);
