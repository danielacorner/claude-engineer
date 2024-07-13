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
    instanceId: number,
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
  showContextMenu: false | number;
  setShowContextMenu: (show: false | number) => void;

  undo: () => void;
  redo: () => void;
  cut: () => void;
  copy: () => void;
  paste: () => void;
  delete: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  toggleLabels: () => void;
  exportAsImage: () => void;
  exportAs3DModel: () => void;
  exportPlantList: () => void;
  openGeneralSettings: () => void;
  openAppearanceSettings: () => void;
  openKeyboardShortcuts: () => void;
  openPlantDatabase: () => void;
  saveACopy: () => void;
  openFile: (fileContent: string) => void;
  createNewProject: (name: string) => void;
}

export const useAppStore = create<AppState>(
  persist(
    (set, get) => ({
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
              rotation: [0, Math.random() * 360, 0],
              // modify the scale a bit at random
              scale: state.selectedPlant.scale.map(
                (s) => s * (0.8 + Math.random() * 0.4)
              ) as [number, number, number],
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
      showContextMenu: false,
      setShowContextMenu: (show) => set({ showContextMenu: show }),

      undo: () => {
        console.log("Undo functionality to be implemented");
      },
      redo: () => {
        console.log("Redo functionality to be implemented");
      },
      cut: () => {
        console.log("Cut functionality to be implemented");
      },
      copy: () => {
        console.log("Copy functionality to be implemented");
      },
      paste: () => {
        console.log("Paste functionality to be implemented");
      },
      delete: () => {
        console.log("Delete functionality to be implemented");
      },
      zoomIn: () => {
        console.log("Zoom In functionality to be implemented");
      },
      zoomOut: () => {
        console.log("Zoom Out functionality to be implemented");
      },
      resetView: () => {
        console.log("Reset View functionality to be implemented");
      },
      toggleLabels: () => {
        console.log("Toggle Labels functionality to be implemented");
      },
      exportAsImage: () => {
        console.log("Export as Image functionality to be implemented");
      },
      exportAs3DModel: () => {
        console.log("Export as 3D Model functionality to be implemented");
      },
      exportPlantList: () => {
        console.log("Export Plant List functionality to be implemented");
      },
      openGeneralSettings: () => {
        console.log("Open General Settings functionality to be implemented");
      },
      openAppearanceSettings: () => {
        console.log("Open Appearance Settings functionality to be implemented");
      },
      openKeyboardShortcuts: () => {
        console.log("Open Keyboard Shortcuts functionality to be implemented");
      },
      openPlantDatabase: () => {
        console.log("Open Plant Database functionality to be implemented");
      },
      saveACopy: () => {
        const state = get();
        const jsonState = JSON.stringify(state);
        const blob = new Blob([jsonState], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "garden_project.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      openFile: (fileContent: string) => {
        try {
          const parsedState = JSON.parse(fileContent);
          set(parsedState);
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      },
      createNewProject: (name: string) => {
        console.log("Create New Project functionality to be implemented", name);
      },
    }),
    {
      name: "app",
      storage: createJSONStorage(() => localStorage),
    }
  ) as StateCreator<AppState, [], []>
);
