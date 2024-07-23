import styled from "@emotion/styled";
import { PlantData } from "../../types";
import { RelatedWikiLinks } from "../RelatedWikiLinks";
import { useAppStore } from "../../store";
import WikiImage from "../WikiImage";
import { useSpring, animated } from "@react-spring/web";

const PADDING = 20;
const SCROLLBAR_WIDTH = 17; // Approximate width of a scrollbar

export function HtmlTooltip() {
  const { selectedPlant, hoveredPlant, showPlantSelector } = useAppStore();
  const plant = hoveredPlant || selectedPlant;
  const isOpen = Boolean(hoveredPlant && showPlantSelector);

  const springProps = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    config: { mass: 1, tension: 170, friction: 24 },
  });

  return (
    <TooltipStyles style={springProps}>
      {plant ? <HtmlTooltipContent plant={plant} /> : null}
    </TooltipStyles>
  );
}

function HtmlTooltipContent({ plant }: { plant: PlantData }) {
  const { setHoveredPlant } = useAppStore();

  return (
    <div
      className="tooltip-content"
      onMouseEnter={() => setHoveredPlant(plant)}
      // onMouseLeave={() => setHoveredPlant(null)}
    >
      <WikiImage
        imageTitle={plant.scientificName ?? plant.name}
        style={{
          width: `calc(100% + ${2 * PADDING}px)`,
          height: `calc(100% + ${2 * PADDING}px)`,
          objectFit: "cover",
        }}
      />
      <h3>{plant.name}</h3>
      <p>{plant.description}</p>
      {plant.scientificName && (
        <p>
          <em>{plant.scientificName}</em>
        </p>
      )}
      {plant.height && <p>Height: {plant.height}m</p>}
      {plant.spread && <p>Spread: {plant.spread}m</p>}
      {plant.category && <p>Category: {plant.category}</p>}
      <h5>Related links:</h5>
      <RelatedWikiLinks plant={plant} />
    </div>
  );
}

const TooltipStyles = styled(animated.div)`
  pointer-events: auto;
  background: white;
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: max(200px, 20vw);
  height: 100vh;
  padding: ${PADDING}px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  overflow-y: hidden;

  &:hover {
    overflow-y: auto;
    padding-right: ${PADDING - SCROLLBAR_WIDTH}px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 0;
    transform: none;
  }

  h5 {
    margin: 2em 0 1em;
  }

  .tooltip-content {
    img {
      margin: -${PADDING}px;
      margin-bottom: 0;
      width: calc(100% + ${2 * PADDING}px);
      height: calc(100% + ${2 * PADDING}px);
      object-fit: cover;
    }
  }

  &::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default HtmlTooltip;
