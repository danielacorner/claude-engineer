import { useAppStore } from "../store";
import { PlantData } from "../types";
import { RelatedWikiLinks } from "./RelatedWikiLinks";
import WikiImage from "./WikiImage";

export function PlantSelectorItem({
  plant,
  idx,
  imgHeight,
  imgWidth,
}: {
  plant: PlantData;
  idx: number;
  imgHeight: number;
  imgWidth: number;
}) {
  const { selectedPlant, setSelectedPlant } = useAppStore();
  return (
    <div
      key={plant.id ?? idx}
      className={`${"plantCard"} ${
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
      <RelatedWikiLinks plant={plant} />
      <div className={"plantInfo"}>
        <h4>{plant.name}</h4>
        <p className={"scientificName"}>{plant.scientificName}</p>
        <p className={"plantDescription"}>{plant.description}</p>
        {plant.height && <p>Height: {plant.height}m</p>}
        {plant.spread && <p>Spread: {plant.spread}m</p>}
        <p className={"category"}>Category: {plant.category}</p>
      </div>
    </div>
  );
}
