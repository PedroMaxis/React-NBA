import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import { AboutUs } from "./Pages/AboutUs";
import { Projetos } from "./Pages/Projects";
 
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="sobremim" element={<AboutUs />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="contato" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;