export interface PlantData {
  id: number;
  name: string;
  modelUrl: string;
  scale: [number, number, number];
  scientificName?: string;
  color?: string;
  /** height of plant in meters */
  height?: number;
  /** spread / width of plant in meters */
  spread?: number;
  description?: string;
  category?: string;
  previewImage?: string;
  href?: string;
}

export interface Plant extends PlantData {
  position: [number, number, number];
  rotation: [number, number, number];
  selected: boolean;
}

export interface ProjectPage {
  name: string;
  plants: Plant[];
}
