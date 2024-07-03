import { PlantData } from '../types';

const plantDatabase: PlantData[] = [
  {
    id: 1,
    name: 'Oak Tree',
    modelUrl: '/models/oak_tree.glb',
    scale: [1, 1, 1],
  },
  {
    id: 2,
    name: 'Pine Tree',
    modelUrl: '/models/pine_tree.glb',
    scale: [0.8, 0.8, 0.8],
  },
  {
    id: 3,
    name: 'Flower Bush',
    modelUrl: '/models/flower_bush.glb',
    scale: [0.5, 0.5, 0.5],
  },
  // Add more plants as needed
];

export default plantDatabase;