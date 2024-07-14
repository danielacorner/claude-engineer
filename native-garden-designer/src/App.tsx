import { GardenScene } from "./components/GardenScene";
import BottomToolbar from "./components/BottomToolbar";
import TopLeftMenu from "./components/TopLeftMenu";
import PlantSelector from "./components/PlantSelector/PlantSelector";
import SelectionRectangle from "./components/SelectionRectangle";

function App() {
  return (
    <div className="App">
      <GardenScene />
      <BottomToolbar />
      <TopLeftMenu />
      <PlantSelector />
      <SelectionRectangle />
    </div>
  );
}

export default App;
