import { PlantData } from "../types";

export const plantDatabase: PlantData[] = [
  {
    id: 1,
    name: "Sunflower",
    scientificName: "Helianthus annuus",
    // modelUrl: '/models/sunflower.glb',
    modelUrl: "/models/Canada_Lily.glb",
    scale: [1, 1, 1],
    height: 2.5,
    spread: 0.6,
    description: "Tall annual plant with large yellow flowers",
    color: "yellow",
  },
  {
    id: 2,
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    // modelUrl: '/models/lavender.glb',
    modelUrl: "/models/Canada_Lily.glb",
    scale: [0.8, 0.8, 0.8],
    height: 0.6,
    spread: 0.4,
    description: "Fragrant perennial herb with purple flowers",
    color: "purple",
  },
  {
    id: 3,
    name: "Rose Bush",
    scientificName: "Rosa",
    // modelUrl: '/models/rose_bush.glb',
    modelUrl: "/models/Canada_Lily.glb",
    scale: [1.2, 1.2, 1.2],
    height: 1.5,
    spread: 1.2,
    description: "Woody perennial flowering plant with fragrant blooms",
    color: "red",
  },
  {
    id: 4,
    name: "Fern",
    scientificName: "Polypodiopsida",
    // modelUrl: '/models/fern.glb',
    modelUrl: "/models/Canada_Lily.glb",
    scale: [0.9, 0.9, 0.9],
    height: 0.8,
    spread: 1.0,
    description: "Non-flowering vascular plant with feathery fronds",
    color: "green",
  },
  {
    id: 5,
    name: "Oak Tree",
    scientificName: "Quercus",
    modelUrl: "/models/oak_tree.glb",
    scale: [2, 2, 2],
    height: 20,
    spread: 15,
    description: "Large deciduous tree with lobed leaves and acorns",
    color: "green",
  },
];

export function getPlantById(id: number): PlantData | undefined {
  return plantDatabase.find((plant) => plant.id === id);
}

export function getAllPlants(): PlantData[] {
  return plantDatabase;
}
