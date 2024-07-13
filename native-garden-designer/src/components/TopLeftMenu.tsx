import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useAppStore } from "../store";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const MenuContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const MenuDropdown = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const SubMenu = styled.div`
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
`;

const MenuItemWithSub = styled(MenuItem)`
  position: relative;
  &:hover ${SubMenu} {
    display: block;
  }
`;

const TopLeftMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    createNewProject,
    openFile,
    saveACopy,
    shareProject,
    setShowGrid,
    showGrid,
    currentProject,
    undo,
    redo,
    cut,
    copy,
    paste,
    delete: deleteItem,
    zoomIn,
    zoomOut,
    resetView,
    toggleLabels,
    showLabels,
    exportAsImage,
    exportAs3DModel,
    exportPlantList,
    openGeneralSettings,
    openAppearanceSettings,
    openKeyboardShortcuts,
    openPlantDatabase,
  } = useAppStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNewProject = () => {
    setIsNewProjectDialogOpen(true);
    setIsMenuOpen(false);
  };

  const handleCreateNewProject = () => {
    createNewProject();
    setIsNewProjectDialogOpen(false);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        openFile(content);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveACopy = () => {
    saveACopy();
    setIsMenuOpen(false);
  };

  const handleShareProject = () => {
    if (currentProject) {
      shareProject();
    } else {
      alert("No active project to share.");
    }
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <MenuContainer>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      <MenuDropdown isOpen={isMenuOpen}>
        <MenuItemWithSub>
          File
          <SubMenu>
            <MenuItem onClick={handleNewProject}>New Project</MenuItem>
            <MenuItem onClick={handleOpenFile}>Open File</MenuItem>
            <MenuItem onClick={handleSaveACopy}>Save a copy</MenuItem>
            <MenuItem onClick={handleShareProject}>Share this project</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Edit
          <SubMenu>
            <MenuItem onClick={() => handleMenuItemClick(undo)}>Undo</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(redo)}>Redo</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(cut)}>Cut</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(copy)}>Copy</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(paste)}>
              Paste
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(deleteItem)}>
              Delete
            </MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          View
          <SubMenu>
            <MenuItem onClick={() => handleMenuItemClick(zoomIn)}>
              Zoom In
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(zoomOut)}>
              Zoom Out
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(resetView)}>
              Reset View
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick(() => setShowGrid(!showGrid))}
            >
              {showGrid ? "Hide Grid" : "Show Grid"}
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(toggleLabels)}>
              {showLabels ? "Hide Labels" : "Show Labels"}
            </MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Export
          <SubMenu>
            <MenuItem onClick={() => handleMenuItemClick(exportAsImage)}>
              Export as Image
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(exportAs3DModel)}>
              Export as 3D Model
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(exportPlantList)}>
              Export Plant List
            </MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Preferences
          <SubMenu>
            <MenuItem onClick={() => handleMenuItemClick(openGeneralSettings)}>
              General Settings
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick(openAppearanceSettings)}
            >
              Appearance
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick(openKeyboardShortcuts)}
            >
              Keyboard Shortcuts
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(openPlantDatabase)}>
              Plant Database
            </MenuItem>
          </SubMenu>
        </MenuItemWithSub>
      </MenuDropdown>

      <Dialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
      >
        <DialogTitle>Clear current project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Creating a new project will clear your current project and any
            unsaved changes will be lost. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewProjectDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewProject}
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".json"
      />
    </MenuContainer>
  );
};

export default TopLeftMenu;
