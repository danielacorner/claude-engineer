import { StateCreator, create } from "zustand";
import { PlantData, Plant, ProjectPage } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

export type ToolType =
  | "select"
  | "move"
  | "add"
  | "delete"
  | "edit"
  | "terrain";
interface AppState {
  /** plants in the catalogue */
  allPlants: PlantData[];
  selectedPlant: PlantData | null;
  hoveredPlant: PlantData | null;
  /** plants visible in the current project current page */
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
  currentProject: {
    name: string;
    pages: ProjectPage[];
  } | null;
  currentPageIdx: number | null;
  currentTool: ToolType;
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
  setcurrentPageIdx: (pageIndex: number) => void;
  setCurrentTool: (tool: ToolType) => void;
  addNewPage: () => void;
  deleteSelectedPlants: () => void;
  placePlant: (position: [number, number, number]) => void;
  duplicateSelectedPlants: () => void;
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
  deletePlant: (id: number) => void;
  deletePlants: (ids: number[]) => void;
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
  createNewProject: () => void;
  shareProject: () => void;
  showLabels: boolean;

  selectedPlantIds: number[];
  setSelectedPlantIds: (ids: number[]) => void;
  addToSelection: (id: number) => void;
  removeFromSelection: (id: number) => void;
  clearSelection: () => void;

  // updateSelectedPlantsPosition: (newPosition: [number, number, number]) => void;
  updateSelectedPlantsPositions: (offset: [number, number, number]) => void;
  removeSelectedPlants: () => void;
  customizeSelectedPlants: (customizations: Partial<Plant>) => void;
  gridMode: boolean;
  toggleGridMode: () => void;
}
const OFFSET_NEW_PLANT = {
  x: 0.25,
  y: 0.25,
};

export const useAppStore = create<AppState>(
  persist(
    devtools((set, get) => ({
      gridMode: false,
      toggleGridMode: () =>
        set(
          (state) => ({ gridMode: !state.gridMode }),
          false,
          "toggleGridMode"
        ),
      allPlants: [] as PlantData[],
      selectedPlant: null,
      hoveredPlant: null,
      plants: [],
      showLabels: false,
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
      currentProject: {
        name: "Project 1",
        pages: [
          {
            plants: [],
            name: "Page 1",
          },
        ],
      },
      currentPageIdx: null,
      currentTool: "add",
      setTooltipPlant: (plant) =>
        set({ tooltipPlant: plant }, false, "setTooltipPlant"),
      setSelectedPlant: (plant) =>
        set({ selectedPlant: plant }, false, "setTooltipPlant"),
      setHoveredPlant: (plant) =>
        set({ hoveredPlant: plant }, false, "setTooltipPlant"),
      addPlant: (plant) =>
        set(
          (state) => ({
            allPlants: [...state.allPlants, plant],
            selectedPlant: {
              ...plant,
              position: state.hoveredPosition || [0, 0, 0],
            },
          }),
          false,
          "addPlant"
        ),
      setPlants: (plants) => set({ plants }, false, "setPlants"),
      setHoveredPosition: (position) =>
        set({ hoveredPosition: position } /* , false, "setHoveredPosition" */),
      setTimeOfDay: (time) => set({ timeOfDay: time }, false, "setTimeOfDay"),
      setSeason: (season) => set({ season }, false, "setSeason"),
      setShowPlantInfo: (plant) =>
        set({ showPlantInfo: plant }, false, "setShowPlantInfo"),
      setCustomizingPlant: (plant) =>
        set({ customizingPlant: plant }, false, "setCustomizingPlant"),
      setTimeSpeed: (speed) => set({ timeSpeed: speed }, false, "setTimeSpeed"),
      setRainIntensity: (intensity) =>
        set({ rainIntensity: intensity }, false, "setRainIntensity"),
      setWindSpeed: (speed) => set({ windSpeed: speed }, false, "setWindSpeed"),
      setCloudCover: (cover) =>
        set({ cloudCover: cover }, false, "setCloudCover"),
      setShowGrid: (show) => set({ showGrid: show }, false, "setShowGrid"),
      setShowTutorial: (show) =>
        set({ showTutorial: show }, false, "setShowTutorial"),
      setErrorMessage: (message) =>
        set({ errorMessage: message }, false, "setErrorMessage"),
      setShowPlantSelector: (show) =>
        set({ showPlantSelector: show }, false, "setShowPlantSelector"),
      setEditMode: (edit) => set({ editMode: edit }, false, "setEditMode"),
      setcurrentPageIdx: (pageIndex) =>
        set({ currentPageIdx: pageIndex }, false, "setcurrentPageIdx"),
      setCurrentTool: (tool) =>
        set({ currentTool: tool }, false, "setCurrentTool"),
      addNewPage: () =>
        set(
          (state) => {
            if (state.currentProject) {
              const newPage: ProjectPage = {
                plants: [],
                name: "Page " + state.currentProject.pages.length,
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: [...state.currentProject.pages, newPage],
                },
                currentPageIdx: state.currentProject.pages.length,
              };
            }
            return state;
          },
          false,
          "addNewPage"
        ),

      placePlant: (position) =>
        set(
          (state) => {
            if (
              state.selectedPlant &&
              state.currentProject &&
              state.currentPageIdx !== null &&
              state.currentTool === "add"
            ) {
              const newPlant: Plant = {
                ...state.selectedPlant,
                id: state.plants.length + 1,
                position,
                rotation: [0, Math.random() * 360, 0],
                scale: state.selectedPlant.scale.map(
                  (s) => s * (0.8 + Math.random() * 0.4)
                ) as [number, number, number],
                selected: false,
              };
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: [
                  ...updatedPages[state.currentPageIdx].plants,
                  newPlant,
                ],
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: [...state.plants, newPlant],
              };
            }
            return state;
          },
          false,
          "placePlant"
        ),
      duplicateSelectedPlants: () =>
        set(
          (state) => {
            if (
              state.selectedPlantIds &&
              state.currentProject &&
              state.currentPageIdx !== null
            ) {
              const currentPage =
                state.currentProject.pages[state.currentPageIdx];
              const selectedPlants = currentPage.plants.filter((plant) =>
                state.selectedPlantIds.includes(plant.id)
              );

              const duplicatePlants: Plant[] = selectedPlants.map(
                (plant, idx) => ({
                  ...plant,
                  id: state.plants.length + 1 + idx,
                  position: [
                    plant.position[0] + OFFSET_NEW_PLANT.x,
                    plant.position[1],
                    plant.position[2] + OFFSET_NEW_PLANT.y,
                  ],
                  rotation: [0, Math.random() * 360, 0],
                  scale: plant.scale.map(
                    (s) => s * (0.8 + Math.random() * 0.4)
                  ) as [number, number, number],
                  selected: true,
                })
              );

              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: [
                  ...updatedPages[state.currentPageIdx].plants.map((p) => ({
                    ...p,
                    selected: false,
                  })),
                  ...duplicatePlants,
                ],
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: [...state.plants, ...duplicatePlants],
                selectedPlantIds: duplicatePlants.map((p) => p.id),
              };
            }
            return state;
          },
          false,
          "duplicateSelectedPlants"
        ),

      updatePlantPosition: (id, newPosition) =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.map((plant) =>
                  plant.id === id ? { ...plant, position: newPosition } : plant
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.map((plant) =>
                  plant.id === id ? { ...plant, position: newPosition } : plant
                ),
              };
            }
            return state;
          },
          false,
          "updatePlantPosition"
        ),

      removePlant: (id) =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.filter(
                  (plant) => plant.id !== id
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.filter((plant) => plant.id !== id),
              };
            }
            return state;
          },
          false,
          "removePlant"
        ),

      customizePlant: (id, customizations) =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.map((plant) =>
                  plant.id === id ? { ...plant, ...customizations } : plant
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.map((plant) =>
                  plant.id === id ? { ...plant, ...customizations } : plant
                ),
              };
            }
            return state;
          },
          false,
          "customizePlant"
        ),

      openPlantInfo: (plant) =>
        set(
          () => ({
            showPlantInfo: plant,
            customizingPlant: null,
          }),
          false,
          "openPlantInfo"
        ),
      deleteSelectedPlants: () => {
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.filter(
                  (plant) => !state.selectedPlantIds.includes(plant.id)
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.filter(
                  (plant) => !state.selectedPlantIds.includes(plant.id)
                ),
              };
            }
            return state;
          },
          false,
          "deleteSelectedPlants"
        );
      },
      showEnvironmentControls: false,
      setShowEnvironmentControls: (show) =>
        set(
          { showEnvironmentControls: show },
          false,
          "setShowEnvironmentControls"
        ),
      isDragging: false,
      setIsDragging: (dragging) =>
        set({ isDragging: dragging }, false, "setIsDragging"),
      isHovered: false,
      setIsHovered: (hovered) =>
        set({ isHovered: hovered }, false, "setIsHovered"),
      showContextMenu: false,
      setShowContextMenu: (show) =>
        set({ showContextMenu: show }, false, "setShowContextMenu"),

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
      deletePlant: (id: number) => {
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.filter(
                  (plant) => plant.id !== id
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.filter((plant) => plant.id !== id),
              };
            }
            return state;
          },
          false,
          "deletePlant"
        );
      },
      deletePlants: (ids: number[]) => {
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.filter(
                  (plant) => !ids.includes(plant.id)
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.filter((plant) => !ids.includes(plant.id)),
              };
            }
            return state;
          },
          false,
          "deletePlants"
        );
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
        set((state) => ({ showLabels: !state.showLabels }));
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
          set(parsedState, false, "openFile");
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      },
      createNewProject: () => {
        set(
          () => ({
            currentProject: {
              name: `Untitled Project`,
              pages: [{ plants: [] as Plant[], name: "Page 1" }],
            },
            currentPageIdx: 0,
            plants: [],
            showPlantSelector: false,
            editMode: false,
            showPlantInfo: null,
            customizingPlant: null,
            showEnvironmentControls: false,
            isDragging: false,
            isHovered: false,
            showContextMenu: false,
          }),
          false,
          "createNewProject"
        );
      },
      shareProject: () => {
        console.log("Share Project functionality to be implemented");
      },
      selectedPlantIds: [],
      setSelectedPlantIds: (ids) =>
        set({ selectedPlantIds: ids }, false, "setSelectedPlantIds"),
      addToSelection: (id) =>
        set(
          (state) => ({ selectedPlantIds: [...state.selectedPlantIds, id] }),
          false,
          "addToSelection"
        ),
      removeFromSelection: (id) =>
        set(
          (state) => ({
            selectedPlantIds: state.selectedPlantIds.filter(
              (plantId) => plantId !== id
            ),
          }),
          false,
          "removeFromSelection"
        ),
      clearSelection: () =>
        set({ selectedPlantIds: [] }, false, "clearSelection"),

      // updateSelectedPlantsPosition: (newPosition) =>
      //   set((state) => {
      //     if (state.currentProject && state.currentPageIdx !== null) {
      //       const updatedPages = [...state.currentProject.pages];
      //       updatedPages[state.currentPageIdx] = {
      //         ...updatedPages[state.currentPageIdx],
      //         plants: updatedPages[state.currentPageIdx].plants.map((plant) =>
      //           state.selectedPlantIds.includes(plant.id)
      //             ? { ...plant, position: newPosition }
      //             : plant
      //         ),
      //       };
      //       return {
      //         currentProject: {
      //           ...state.currentProject,
      //           pages: updatedPages,
      //         },
      //         plants: state.plants.map((plant) =>
      //           state.selectedPlantIds.includes(plant.id)
      //             ? { ...plant, position: newPosition }
      //             : plant
      //         ),
      //       };
      //     }
      //     return state;
      //   }),
      updateSelectedPlantsPositions: (newPosition: [number, number, number]) =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              const currentPagePlants =
                updatedPages[state.currentPageIdx].plants;

              // Find the plant being directly dragged
              const draggedPlant = currentPagePlants.find(
                (plant) => plant.id === state.isDragging
              );

              if (!draggedPlant) return state; // If no plant is being dragged, return the current state

              // Calculate the offset based on the dragged plant's movement
              const offsetX = newPosition[0] - draggedPlant.position[0];
              const offsetZ = newPosition[2] - draggedPlant.position[2];

              const updatedPlants: Plant[] = currentPagePlants.map((plant) => {
                if (state.selectedPlantIds.includes(plant.id)) {
                  return {
                    ...plant,
                    position: [
                      plant.position[0] + offsetX,
                      plant.position[1], // Keep vertical position unchanged
                      plant.position[2] + offsetZ,
                    ],
                  };
                }
                return plant;
              });

              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPlants,
              };

              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: updatedPlants,
              };
            }
            return state;
          },
          false,
          "updateSelectedPlantsPositions"
        ),

      removeSelectedPlants: () =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.filter(
                  (plant) => !state.selectedPlantIds.includes(plant.id)
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.filter(
                  (plant) => !state.selectedPlantIds.includes(plant.id)
                ),
                selectedPlantIds: [],
              };
            }
            return state;
          },
          false,
          "removeSelectedPlants"
        ),

      customizeSelectedPlants: (customizations) =>
        set(
          (state) => {
            if (state.currentProject && state.currentPageIdx !== null) {
              const updatedPages = [...state.currentProject.pages];
              updatedPages[state.currentPageIdx] = {
                ...updatedPages[state.currentPageIdx],
                plants: updatedPages[state.currentPageIdx].plants.map((plant) =>
                  state.selectedPlantIds.includes(plant.id)
                    ? { ...plant, ...customizations }
                    : plant
                ),
              };
              return {
                currentProject: {
                  ...state.currentProject,
                  pages: updatedPages,
                },
                plants: state.plants.map((plant) =>
                  state.selectedPlantIds.includes(plant.id)
                    ? { ...plant, ...customizations }
                    : plant
                ),
              };
            }
            return state;
          },
          false,
          "customizeSelectedPlants"
        ),
    })),
    {
      name: "app",
      storage: createJSONStorage(() => localStorage),
    }
  ) as StateCreator<AppState, [], []>
);

export function useCurrentPagePlants() {
  const { currentProject, currentPageIdx } = useAppStore();
  const currentPagePlants =
    currentPageIdx !== null
      ? currentProject?.pages[currentPageIdx].plants ?? []
      : [];
  return currentPagePlants;
}
export function useSelectedPlants() {
  const { selectedPlantIds } = useAppStore();
  const currentPagePlants = useCurrentPagePlants();
  return currentPagePlants.filter((plant) =>
    selectedPlantIds.includes(plant.id)
  );
}
