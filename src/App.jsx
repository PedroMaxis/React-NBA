import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import { Info } from "./Pages/Info";

 
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/info/:nome" element={<Info />}></Route> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;