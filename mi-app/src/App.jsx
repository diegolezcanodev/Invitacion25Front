import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";

function App() {
  return (
    <div className="min-h-screen font-montserrat flex justify-center">
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Inicio />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;