import React from 'react';

interface EnvironmentControlsProps {
  timeOfDay: number;
  setTimeOfDay: (time: number) => void;
  season: string;
  setSeason: (season: string) => void;
}

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

const EnvironmentControls: React.FC<EnvironmentControlsProps> = ({
  timeOfDay,
  setTimeOfDay,
  season,
  setSeason,
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '10px',
      borderRadius: '5px',
    }}>
      <h3>Environment Controls</h3>
      <div>
        <label htmlFor="timeOfDay">Time of Day: </label>
        <input
          type="range"
          id="timeOfDay"
          min="0"
          max="24"
          step="0.5"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        />
        <span>{timeOfDay.toFixed(1)} hours</span>
      </div>
      <div>
        <label htmlFor="season">Season: </label>
        <select
          id="season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          {seasons.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EnvironmentControls;