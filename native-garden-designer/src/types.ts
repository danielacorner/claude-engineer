export interface PlantData {
  id: number;
  name: string;
  scientificName: string;
  color: string;
  height: number;
  spread: number;
  description: string;
  modelUrl: string;
  scale: [number, number, number];
}

export interface Plant extends PlantData {
  position: [number, number, number];
}