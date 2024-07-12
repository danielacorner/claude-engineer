import React, { useState } from "react";
import styled from "styled-components";

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <MenuContainer>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      <MenuDropdown isOpen={isMenuOpen}>
        <MenuItemWithSub>
          File
          <SubMenu>
            <MenuItem>New Project</MenuItem>
            <MenuItem>Open Project</MenuItem>
            <MenuItem>Save</MenuItem>
            <MenuItem>Save As...</MenuItem>
            <MenuItem>Close Project</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Edit
          <SubMenu>
            <MenuItem>Undo</MenuItem>
            <MenuItem>Redo</MenuItem>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
            <MenuItem>Delete</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          View
          <SubMenu>
            <MenuItem>Zoom In</MenuItem>
            <MenuItem>Zoom Out</MenuItem>
            <MenuItem>Reset View</MenuItem>
            <MenuItem>Toggle Grid</MenuItem>
            <MenuItem>Toggle Labels</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Export
          <SubMenu>
            <MenuItem>Export as Image</MenuItem>
            <MenuItem>Export as 3D Model</MenuItem>
            <MenuItem>Export Plant List</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
        <MenuItemWithSub>
          Preferences
          <SubMenu>
            <MenuItem>General Settings</MenuItem>
            <MenuItem>Appearance</MenuItem>
            <MenuItem>Keyboard Shortcuts</MenuItem>
            <MenuItem>Plant Database</MenuItem>
          </SubMenu>
        </MenuItemWithSub>
      </MenuDropdown>
    </MenuContainer>
  );
};

export default TopLeftMenu;
