import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import {Camisas} from "./Pages/Camisas"

 
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/info" element={<Camisas />}></Route>
          
      </Routes>
    </BrowserRouter>
  );
};

export default App;