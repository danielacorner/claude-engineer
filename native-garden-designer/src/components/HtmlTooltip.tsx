import styled from "@emotion/styled";
import { PlantData } from "../types";
import { RelatedWikiLinks } from "./RelatedWikiLinks";
import { useAppStore } from "../store";
import WikiImage from "./WikiImage";

const PADDING = 20;
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
        style={{
          width: `calc(100% + ${2 * PADDING}px)`,
          height: `max(240px, 50vh)`,
          objectFit: "cover",
        }}
      />
      <h3>{plant.name}</h3>
      <p>{plant.description}</p>
      {plant.height && <p>Height: {plant.height}m</p>}
      {plant.spread && <p>Spread: {plant.spread}m</p>}
      {plant.category && <p>Category: {plant.category}</p>}
      <h5>Related links:</h5>
      <RelatedWikiLinks plant={plant} />
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
  width: max(360px, 40vw);
  height: calc(100vh - 64px);
  padding: ${PADDING}px;
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
  h5 {
    margin: 2em 0 1em;
  }
  .tooltip-content {
    img {
      margin: -${PADDING}px;
      margin-bottom: 0;
      border-radius: 10px 10px 0 0;
    }
  }
`;
