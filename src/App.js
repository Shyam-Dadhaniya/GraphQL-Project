import { Route, Routes } from "react-router-dom";
import "./App.css";
import Mission from "./components/Mission";
import Missions from "./components/Missions";
import Mutation from "./components/Mutation";
import Rocket from "./components/Rocket";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" index element={<Missions />} />
        <Route path="/:missionId" element={<Mission/>}/>
        <Route path="/rocket/:rocketId" element={<Rocket/>}/>
        <Route path="/mutation" element={<Mutation/>}/>
        <Route/>
      </Routes>
    </div>
  );
}
export default App;
