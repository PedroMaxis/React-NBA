import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./Pages/LandingPage";
import { Info } from "./Pages/Info";
import { Jogadores } from "./Pages/Jogadores";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
 
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/LadingPage" element={<LandingPage />}></Route>
          <Route path="/" element={<Login />}></Route>
           <Route path="/register" element={<Register />}></Route>
          <Route path="/info/:nome" element={<Info />}></Route> 
          <Route path="/jogadores/:nome" element={<Jogadores />}></Route> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;