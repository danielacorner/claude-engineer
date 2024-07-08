import React from "react";
import { useAppStore } from "../store";
import styled from "@emotion/styled";

const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const EnvironmentControls: React.FC = () => {
  const {
    timeOfDay,
    setTimeOfDay,
    season,
    setSeason,
    timeSpeed,
    setTimeSpeed,
    rainIntensity,
    setRainIntensity,
    windSpeed,
    setWindSpeed,
    cloudCover,
    setCloudCover,
  } = useAppStore();

  return (
    <Styles>
      <div className={"environmentControls"}>
        <h3>Environment Controls</h3>
        <div className={"controlGroup"}>
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
        <div className={"controlGroup"}>
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
        <div className={"controlGroup"}>
          <label htmlFor="timeSpeed">Time Speed: </label>
          <input
            type="range"
            id="timeSpeed"
            min="1"
            max="100"
            step="1"
            value={timeSpeed}
            onChange={(e) => setTimeSpeed(parseInt(e.target.value))}
          />
          <span>{timeSpeed}x</span>
        </div>
        <div className={"controlGroup"}>
          <label htmlFor="rainIntensity">Rain Intensity: </label>
          <input
            type="range"
            id="rainIntensity"
            min="0"
            max="1"
            step="0.1"
            value={rainIntensity}
            onChange={(e) => setRainIntensity(parseFloat(e.target.value))}
          />
          <span>{(rainIntensity * 100).toFixed(0)}%</span>
        </div>
        <div className={"controlGroup"}>
          <label htmlFor="windSpeed">Wind Speed: </label>
          <input
            type="range"
            id="windSpeed"
            min="0"
            max="20"
            step="1"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseInt(e.target.value))}
          />
          <span>{windSpeed} km/h</span>
        </div>
        <div className={"controlGroup"}>
          <label htmlFor="cloudCover">Cloud Cover: </label>
          <input
            type="range"
            id="cloudCover"
            min="0"
            max="1"
            step="0.1"
            value={cloudCover}
            onChange={(e) => setCloudCover(parseFloat(e.target.value))}
          />
          <span>{(cloudCover * 100).toFixed(0)}%</span>
        </div>
      </div>
    </Styles>
  );
};
const Styles = styled.div``;

export default EnvironmentControls;
