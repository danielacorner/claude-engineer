import React, { useEffect, useState } from 'react';
import { Plant } from '../types';

interface PlantGrowthSimulationProps {
  plants: Plant[];
  updatePlant: (id: number, updates: Partial<Plant>) => void;
  timeSpeed: number;
  season: string;
  rainIntensity: number;
  windSpeed: number;
  cloudCover: number;
}

const PlantGrowthSimulation: React.FC<PlantGrowthSimulationProps> = ({
  plants,
  updatePlant,
  timeSpeed,
  season,
  rainIntensity,
  windSpeed,
  cloudCover,
}) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    const simulateGrowth = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - lastUpdateTime) * timeSpeed;

      plants.forEach((plant) => {
        const growthRate = calculateGrowthRate(plant, season, rainIntensity, cloudCover);
        const newScale = calculateNewScale(plant.scale, growthRate, elapsedTime);
        const newHealth = calculatePlantHealth(plant, rainIntensity, windSpeed, cloudCover);
        const competitionFactor = calculateCompetitionFactor(plant, plants);
        
        updatePlant(plant.id, { 
          scale: newScale,
          health: newHealth,
          growthRate: growthRate * competitionFactor
        });
      });

      setLastUpdateTime(currentTime);
    };

    const intervalId = setInterval(simulateGrowth, 1000);

    return () => clearInterval(intervalId);
  }, [plants, updatePlant, timeSpeed, season, rainIntensity, windSpeed, cloudCover, lastUpdateTime]);

  return null;
};

const calculateGrowthRate = (plant: Plant, season: string, rainIntensity: number, cloudCover: number): number => {
  let rate = 0.00001;

  // Season adjustment
  const seasonFactor = {
    'Spring': 1.5,
    'Summer': 1.2,
    'Autumn': 0.8,
    'Winter': 0.5
  }[season] || 1;

  // Rain and sunlight (inverse of cloud cover) adjustment
  const waterFactor = 0.5 + rainIntensity * 0.5;
  const sunlightFactor = 1 - cloudCover * 0.5;

  rate *= seasonFactor * waterFactor * sunlightFactor;

  // Plant-specific factors could be added here
  // For example: rate *= plant.growthFactor;

  return rate;
};

const calculateNewScale = (
  currentScale: [number, number, number],
  growthRate: number,
  elapsedTime: number
): [number, number, number] => {
  const growthFactor = 1 + growthRate * elapsedTime;
  return currentScale.map((s) => Math.min(s * growthFactor, s * 2)) as [number, number, number];
};

const calculatePlantHealth = (plant: Plant, rainIntensity: number, windSpeed: number, cloudCover: number): number => {
  let health = plant.health || 100; // Assume 100 if not set

  // Water availability affects health
  health += (rainIntensity - 0.5) * 2; // Too much or too little water is bad

  // Strong winds can damage plants
  health -= Math.max(0, windSpeed - 10) * 0.5;

  // Lack of sunlight can reduce health
  health -= cloudCover * 1.5;

  // Ensure health stays within 0-100 range
  return Math.max(0, Math.min(100, health));
};

const calculateCompetitionFactor = (plant: Plant, allPlants: Plant[]): number => {
  const competingPlants = allPlants.filter(p => 
    p.id !== plant.id && 
    Math.abs(p.position[0] - plant.position[0]) < 2 &&
    Math.abs(p.position[2] - plant.position[2]) < 2
  );

  // Reduce growth rate based on number of competing plants
  return Math.max(0.5, 1 - competingPlants.length * 0.1);
};

export default PlantGrowthSimulation;