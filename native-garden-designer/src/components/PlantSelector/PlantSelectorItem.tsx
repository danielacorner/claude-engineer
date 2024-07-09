import { imgHeight, imgWidth } from "../../constants";
import { useAppStore } from "../../store";
import { PlantData } from "../../types";
import WikiImage from "../WikiImage";
import styled from "@emotion/styled";

export function PlantSelectorItem({
  plant,
  idx,
}: {
  plant: PlantData;
  idx: number;
}) {
  const { selectedPlant, setSelectedPlant, setTooltipPlant } = useAppStore();

  return (
    <>
      <Styles
        onMouseEnter={() => setTooltipPlant(plant)}
        key={plant.id ?? idx}
        className={`${"plantCard plantCard-"}${plant.id} ${
          selectedPlant?.id === plant.id ? "selected" : ""
        }`}
        onClick={() => setSelectedPlant(plant)}
      >
        <WikiImage
          imageTitle={plant.scientificName ?? plant.name}
          style={{ width: imgWidth, height: imgHeight }}
        />
        {/* <img
        // src={`/plant_thumbnails/${plant.id}.jpg`}
        src={`https://source.unsplash.com/${imgWidth}x${imgHeight}/${plant.name}`}
        className="plantImage"
        alt={plant.name}
        style={{ width: imgWidth, height: imgHeight }}
        // onError={handleImageError}
      /> */}
        <div className={"plantInfo"}>
          <h4>{plant.name}</h4>
          <p className={"scientificName"}>
            <em>{plant.scientificName}</em>
          </p>
          <p className={"plantDescription"}>{plant.description}</p>
          {/* {plant.height && <p>Height: {plant.height}m</p>}
          {plant.spread && <p>Spread: {plant.spread}m</p>} */}
          {plant.category && (
            <p className={"category"}>Category: {plant.category}</p>
          )}
        </div>
      </Styles>
    </>
  );
}

const PREVIEW_INFO_HEIGHT = 148;

const Styles = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  width: ${imgWidth}px;
  height: ${imgHeight + PREVIEW_INFO_HEIGHT}px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border: 2px solid #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  .plantImage {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }

  .plantInfo {
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .plantInfo h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  p {
    margin: 0;
  }
  .scientificName {
    font-size: 12px;
  }
  .plantType {
    font-size: 12px;
    color: #666;
    margin: 0 0 8px 0;
  }

  .plantDescription {
    font-size: 12px;
    margin: 0 0 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    flex-grow: 1;
  }
`;
