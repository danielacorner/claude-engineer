import styled from "@emotion/styled";
import { PlantData } from "../types";
import { RelatedWikiLinks } from "./RelatedWikiLinks";
import { useAppStore } from "../store";
import WikiImage from "./WikiImage";

export function HtmlTooltip() {
  const { tooltipPlant } = useAppStore();
  return (
    <TooltipStyles $open={Boolean(tooltipPlant)}>
      {tooltipPlant ? <HtmlTooltipContent plant={tooltipPlant} /> : null}
    </TooltipStyles>
  );
}

function HtmlTooltipContent({ plant }: { plant: PlantData }) {
  return (
    <div className={"tooltip-content"}>
      <WikiImage
        imageTitle={plant.scientificName ?? plant.name}
        style={{ width: "100%", height: "100%" }}
      />
      <h3>{plant.name}</h3>
      <RelatedWikiLinks plant={plant} />
      <p>{plant.description}</p>
      <p>Height: {plant.height}m</p>
      <p>Spread: {plant.spread}m</p>
      <p>Category: {plant.category}</p>
    </div>
  );
}

const TooltipStyles = styled.div<{
  $open: boolean;
}>`
  pointer-events: auto;
  background: white;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  width: max(360px, 30vw);
  height: calc(100vh - 64px);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
  transform: translateX(-100%);
  ${({ $open }) =>
    $open &&
    `
    transform: translateX(0);
  `}
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 0;
    border-radius: 0;
    transform: none;
  }
`;
