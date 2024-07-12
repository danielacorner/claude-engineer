import styled from "@emotion/styled";

export const PlantSelectorStyles = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  pointer-events: none;

  .tooltip-wrapper {
    pointer-events: auto;
  }
  .plantSelectorWrapper {
    position: relative;
    transition: transform 0.2s ease-in-out;
    width: 450px;
    transform: translateX(calc(-100%));
    ${({ $open }) =>
      $open &&
      `
    transform: translateX(0);
  `}
  }
  .plantSelector {
    pointer-events: auto;
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0px;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 0 10px 10px;
    padding: 20px;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .searchInput,
  .filterSelect {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .searchInput:focus,
  .filterSelect:focus {
    outline: none;
    border-color: #4caf50;
  }

  .plantList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }

  .pagination button {
    padding: 6px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .pagination button:hover {
    background-color: #e0e0e0;
  }

  .pagination button.activePage {
    background-color: #4caf50;
    color: white;
  }

  .selectedPlant {
    margin-top: 20px;
    padding: 15px;
    background-color: #e6f7e6;
    border-radius: 8px;
  }

  .selectedPlant h4 {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .preview {
    width: 100%;
    height: 200px;
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
  }

  .colorCustomization {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .colorCustomization label {
    font-size: 14px;
  }

  .colorCustomization input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .selectedPlant button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .selectedPlant button:hover {
    background-color: #45a049;
  }

  .selectedPlant button:last-child {
    background-color: #f44336;
  }

  .selectedPlant button:last-child:hover {
    background-color: #d32f2f;
  }
`;
