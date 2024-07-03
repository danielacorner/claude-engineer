export interface PlantData {
  id: number;
  name: string;
  modelUrl: string;
  scale: [number, number, number];
  scientificName?: string;
  color?: string;
  height?: number;
  spread?: number;
  description?: string;
}

export interface Plant extends PlantData {
  position: [number, number, number];
}