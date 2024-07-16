import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAppStore } from "../store";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Select,
  FormControl,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { isMac } from "../constants";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";

const MenuContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: #ffffff73;
  padding: 4px;
  padding-left: 16px;
  * {
    font-size: 16px !important;
  }
  .MuiSelect-select {
    padding: 12px;
  }
  .MuiInputBase-root {
    height: 32px;
  }
`;

const MenuDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
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

const ShortcutIndicator = styled.span`
  float: right;
  color: #888;
  font-size: 0.8em;
`;

const PageSelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const PageSelect = styled(FormControl)``;

const StyledSelect = styled(Select)`
  height: 40px;
  min-width: 150px;
`;

const PageMenuTitle = styled(MuiMenuItem)`
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px;
`;

const PageMenuItem = styled(MuiMenuItem)`
  padding-left: 32px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
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
    deletePlant: deleteItem,
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
    currentPageIdx,
    setcurrentPageIdx,
    addNewPage,
    setCurrentTool,
    deleteSelectedPlants,
    gridMode,
    toggleGridMode,
    duplicateSelectedPlants,
  } = useAppStore();

  useEffect(() => {
    if (
      currentProject &&
      currentProject.pages.length > 0 &&
      currentPageIdx === null
    ) {
      setcurrentPageIdx(0);
    }
  }, [currentProject, currentPageIdx, setcurrentPageIdx]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      if (modKey) {
        switch (event.key.toLowerCase()) {
          case "z":
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            event.preventDefault();
            break;
          case "y":
            redo();
            event.preventDefault();
            break;
          case "x":
            cut();
            event.preventDefault();
            break;
          case "c":
            copy();
            event.preventDefault();
            break;
          case "v":
            paste();
            event.preventDefault();
            break;
        }
      }
      if (event.key === "Delete" || (isMac && event.key === "Backspace")) {
        // deleteItem();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, cut, copy, paste, deleteItem, setCurrentTool]);

  const modKeySymbol = isMac ? "⌘" : "Ctrl";

  const handlePageChange = (event: SelectChangeEvent<unknown>) => {
    setcurrentPageIdx(event.target.value as number);
  };

  const handleAddNewPage = () => {
    addNewPage();
  };

  const handleEditPages = () => {
    // Implement edit pages functionality
    console.log("Edit pages");
  };

  // handle duplicate on modKey + D
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      console.log("⭐🎈  handleKeyDown  modKey:", modKey, event.key);
      if (modKey && event.key === "d") {
        duplicateSelectedPlants();
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [duplicateSelectedPlants]);

  const pageNameDisplay =
    currentProject?.pages[currentPageIdx ?? 0]?.name ??
    `Page ${(currentPageIdx ?? 0) + 1}`;
  return (
    <MenuContainer>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleMenu}
        sx={{ width: 40, height: 40 }}
      >
        <MenuIcon />
      </IconButton>
      <MenuDropdown $isOpen={isMenuOpen}>
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
            <MenuItem onClick={() => handleMenuItemClick(undo)}>
              Undo
              <ShortcutIndicator>{modKeySymbol}+Z</ShortcutIndicator>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(redo)}>
              Redo
              <ShortcutIndicator>{modKeySymbol}+Y</ShortcutIndicator>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(cut)}>
              Cut
              <ShortcutIndicator>{modKeySymbol}+X</ShortcutIndicator>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(copy)}>
              Copy
              <ShortcutIndicator>{modKeySymbol}+C</ShortcutIndicator>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(paste)}>
              Paste
              <ShortcutIndicator>{modKeySymbol}+V</ShortcutIndicator>
            </MenuItem>
            <MenuItem onClick={deleteSelectedPlants}>
              Delete
              <ShortcutIndicator>{isMac ? "⌫" : "Del"}</ShortcutIndicator>
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

      <PageSelectContainer>
        <PageSelect>
          <StyledSelect
            value={currentPageIdx ?? ""}
            onChange={handlePageChange}
            renderValue={() => pageNameDisplay}
          >
            <PageMenuTitle>
              {currentPageIdx === -1 ? "No pages" : `${pageNameDisplay}`}
              <div>
                <IconButton size="small" onClick={handleEditPages}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleAddNewPage}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            </PageMenuTitle>
            {currentProject?.pages.map((_page, index) => (
              <PageMenuItem key={index} value={index}>
                <ListItemIcon>
                  {index === currentPageIdx ? <CheckIcon /> : null}
                </ListItemIcon>
                <ListItemText>Page {index + 1}</ListItemText>
              </PageMenuItem>
            ))}
          </StyledSelect>
        </PageSelect>
      </PageSelectContainer>

      <ActionButtonsContainer>
        <Tooltip title="Undo">
          <IconButton onClick={undo} size="small">
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={redo} size="small">
            <RedoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={deleteSelectedPlants} size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Duplicate (${modKeySymbol}+D)`}>
          <IconButton onClick={duplicateSelectedPlants} size="small">
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={gridMode ? "Disable Grid" : "Enable Grid"}>
          <IconButton onClick={toggleGridMode} size="small">
            {gridMode ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>
      </ActionButtonsContainer>

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
