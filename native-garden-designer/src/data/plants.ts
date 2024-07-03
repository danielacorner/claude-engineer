import { PlantData } from '../types';

export const plants: PlantData[] = [
  {
    id: 'oak_tree',
    name: 'Oak Tree',
    type: 'tree',
    model: '/models/oak_tree.glb',
    thumbnail: '/thumbnails/oak_tree.jpg',
    description: 'A majestic oak tree, providing shade and habitat for wildlife.',
    seasons: ['Spring', 'Summer', 'Autumn'],
    height: 20,
    width: 15,
  },
  {
    id: 'maple_tree',
    name: 'Maple Tree',
    type: 'tree',
    model: '/models/maple_tree.glb',
    thumbnail: '/thumbnails/maple_tree.jpg',
    description: 'A beautiful maple tree with vibrant autumn colors.',
    seasons: ['Spring', 'Summer', 'Autumn'],
    height: 18,
    width: 12,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    type: 'flower',
    model: '/models/lavender.glb',
    thumbnail: '/thumbnails/lavender.jpg',
    description: 'Fragrant lavender plants, perfect for borders and attracting pollinators.',
    seasons: ['Spring', 'Summer'],
    height: 0.6,
    width: 0.5,
  },
  {
    id: 'rose_bush',
    name: 'Rose Bush',
    type: 'shrub',
    model: '/models/rose_bush.glb',
    thumbnail: '/thumbnails/rose_bush.jpg',
    description: 'A classic rose bush with beautiful blooms.',
    seasons: ['Spring', 'Summer'],
    height: 1.5,
    width: 1,
  },
  {
    id: 'fern',
    name: 'Fern',
    type: 'groundcover',
    model: '/models/fern.glb',
    thumbnail: '/thumbnails/fern.jpg',
    description: 'Lush ferns for shaded areas and woodland gardens.',
    seasons: ['Spring', 'Summer', 'Autumn'],
    height: 0.5,
    width: 0.7,
  },
];

export const plantTypes = ['tree', 'shrub', 'flower', 'groundcover'];
export const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];