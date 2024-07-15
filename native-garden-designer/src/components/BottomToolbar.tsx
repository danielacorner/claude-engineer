import React, { useEffect } from "react";
import styled from "styled-components";
import { IconButton, Tooltip } from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import TerrainIcon from "@mui/icons-material/Terrain";
import { ToolType, useAppStore } from "../store";
import { RxCursorArrow } from "react-icons/rx";
import { isMac } from "../constants";

const ToolbarContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  gap: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledIconButton = styled(IconButton)<{ $active: boolean }>`
  margin: 0 2px;
  border-radius: 8px !important;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  background-color: ${(props) =>
    props.$active ? "#2196f3" : "transparent"} !important;
  color: ${(props) => (props.$active ? "#ffffff" : "#000000")} !important;

  &:hover {
    background-color: ${(props) =>
      props.$active ? "#1976d2" : "rgba(0, 0, 0, 0.04)"} !important;
  }
`;

const tools: { kbd: string; name: ToolType; icon: any; tooltip: string }[] = [
  { kbd: "s", name: "select", icon: RxCursorArrow, tooltip: "Select (S)" },
  { kbd: "m", name: "move", icon: PanToolIcon, tooltip: "Move (M)" },
  {
    kbd: "a",
    name: "add",
    icon: AddCircleOutlineIcon,
    tooltip: "Add Plant (A)",
  },
  // { kbd: "d", name: "delete", icon: DeleteIcon, tooltip: "Delete Plant (D)" },
  { kbd: "e", name: "edit", icon: EditIcon, tooltip: "Edit Plant (E)" },
  { kbd: "t", name: "terrain", icon: TerrainIcon, tooltip: "Edit Terrain (T)" },
];

const BottomToolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useAppStore();
  useKeyboardShortcuts();
  const handleToolClick = (toolName: ToolType) => {
    setCurrentTool(toolName);
  };

  return (
    <ToolbarContainer>
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentTool === tool.name;

        return (
          <Tooltip key={tool.name} title={tool.tooltip}>
            <StyledIconButton
              onClick={() => handleToolClick(tool.name)}
              $active={isActive}
            >
              <Icon />
            </StyledIconButton>
          </Tooltip>
        );
      })}
    </ToolbarContainer>
  );
};

export default BottomToolbar;

function useKeyboardShortcuts() {
  const { setCurrentTool, deleteSelectedPlants } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      console.log(
        "⭐� ~ handleKeyDown ~ event.key.toLowerCase():",
        event.key.toLowerCase()
      );
      const lowerKey = event.key.toLowerCase();
      if (modKey) {
        switch (lowerKey) {
          case "m":
            setCurrentTool("move");
            event.preventDefault();
            break;
          case "s":
            setCurrentTool("select");
            event.preventDefault();
            break;
          case "a":
            setCurrentTool("add");
            event.preventDefault();
            break;
          case "e":
            setCurrentTool("edit");
            event.preventDefault();
            break;
          case "t":
            setCurrentTool("terrain");
            event.preventDefault();
            break;
        }
      } else {
        switch (lowerKey) {
          case "delete":
            deleteSelectedPlants();
            event.preventDefault();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentTool]);
}
