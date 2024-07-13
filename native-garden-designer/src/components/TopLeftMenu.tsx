import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useAppStore } from "../store";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material";

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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
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
    setIsConfirmDialogOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmNewProject = () => {
    setIsConfirmDialogOpen(false);
    setIsNewProjectDialogOpen(true);
  };

  const handleCreateNewProject = () => {
    if (newProjectName.trim()) {
      createNewProject(newProjectName.trim());
      setIsNewProjectDialogOpen(false);
      setNewProjectName("");
    }
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

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
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
            <MenuItem onClick={() => { undo(); setIsMenuOpen(false); }}>Undo</MenuItem>
            <MenuItem onClick={() => { redo(); setIsMenuOpen(false); }}>Redo</MenuItem>
            <MenuItem onClick={() => { cut(); setIsMenuOpen(false); }}>Cut</MenuItem>
            <MenuItem onClick={() => { copy(); setIsMenuOpen(false); }}>Copy</MenuItem>
            <MenuItem onClick={() => { paste(); setIsMenuOpen(false); }}>Paste</MenuItem>
            <MenuItem onClick={() => { deleteItem(); setIsMenuOpen(false); }}>Delete</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          View
          <SubMenu>
            <MenuItem onClick={() => { zoomIn(); setIsMenuOpen(false); }}>Zoom In</MenuItem>
            <MenuItem onClick={() => { zoomOut(); setIsMenuOpen(false); }}>Zoom Out</MenuItem>
            <MenuItem onClick={() => { resetView(); setIsMenuOpen(false); }}>Reset View</MenuItem>
            <MenuItem onClick={handleToggleGrid}>
              {showGrid ? "Hide Grid" : "Show Grid"}
            </MenuItem>
            <MenuItem onClick={() => { toggleLabels(); setIsMenuOpen(false); }}>Toggle Labels</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Export
          <SubMenu>
            <MenuItem onClick={() => { exportAsImage(); setIsMenuOpen(false); }}>Export as Image</MenuItem>
            <MenuItem onClick={() => { exportAs3DModel(); setIsMenuOpen(false); }}>Export as 3D Model</MenuItem>
            <MenuItem onClick={() => { exportPlantList(); setIsMenuOpen(false); }}>Export Plant List</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Preferences
          <SubMenu>
            <MenuItem onClick={() => { openGeneralSettings(); setIsMenuOpen(false); }}>General Settings</MenuItem>
            <MenuItem onClick={() => { openAppearanceSettings(); setIsMenuOpen(false); }}>Appearance</MenuItem>
            <MenuItem onClick={() => { openKeyboardShortcuts(); setIsMenuOpen(false); }}>Keyboard Shortcuts</MenuItem>
            <MenuItem onClick={() => { openPlantDatabase(); setIsMenuOpen(false); }}>Plant Database</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
      </MenuDropdown>

      <Dialog open={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)}>
        <DialogTitle>Clear current project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Creating a new project will clear your current project and any unsaved changes will be lost. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmNewProject} variant="contained" color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isNewProjectDialogOpen} onClose={() => setIsNewProjectDialogOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNewProject} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".json"
      />
    </MenuContainer>
  );
};

export default TopLeftMenu;