import React from "react";
import styled from "styled-components";
import { IconButton, Tooltip } from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TerrainIcon from "@mui/icons-material/Terrain";
import { useAppStore } from "../store";
import { RxCursorArrow } from "react-icons/rx";

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

const tools = [
  { name: "select", icon: RxCursorArrow, tooltip: "Select" },
  { name: "move", icon: PanToolIcon, tooltip: "Move" },
  { name: "add", icon: AddCircleOutlineIcon, tooltip: "Add Plant" },
  { name: "delete", icon: DeleteIcon, tooltip: "Delete Plant" },
  { name: "edit", icon: EditIcon, tooltip: "Edit Plant" },
  { name: "terrain", icon: TerrainIcon, tooltip: "Edit Terrain" },
];

const BottomToolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useAppStore();

  const handleToolClick = (toolName: string) => {
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
