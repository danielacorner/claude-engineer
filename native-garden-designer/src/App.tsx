import { GardenScene } from "./components/GardenScene";
import BottomToolbar from "./components/BottomToolbar";
import TopLeftMenu from "./components/TopLeftMenu";
// import PlantSelector from "./components/PlantSelector/PlantSelector";
import styled from "styled-components";
import { CursorHandler } from "./components/CursorHandler";

function App() {
  return (
    <AppStylesProvider className="App">
      <GardenScene />
      <BottomToolbar />
      <TopLeftMenu />
      <CursorHandler />
      {/* <PlantSelector /> */}
      {/* <SelectionRectangle /> */}
    </AppStylesProvider>
  );
}

export default App;
const AppStylesProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [x: string]: any;
}) => {
  return <AppStyles {...props}>{children}</AppStyles>;
};
const AppStyles = styled.div``;
