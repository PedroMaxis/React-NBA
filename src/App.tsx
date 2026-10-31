import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import Jogos from "@/pages/Jogos";
import Classificacao from "@/pages/Classificacao";
import Times from "@/pages/Times";
import TimePage from "@/pages/TimePage";
import Sobre from "@/pages/Sobre";
import NotFound from "@/pages/NotFound";
import { slugify } from "@/lib/texto";

/** URLs da versão antiga (/info/Boston Celtics e /jogadores/Boston Celtics) continuam funcionando */
const LegacyRedirect = () => {
  const { nome } = useParams();
  return nome ? <Navigate to={`/times/${slugify(nome)}`} replace /> : <NotFound />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Jogos />} />
        <Route path="classificacao" element={<Classificacao />} />
        <Route path="times" element={<Times />} />
        <Route path="times/:slug" element={<TimePage />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="info/:nome" element={<LegacyRedirect />} />
        <Route path="jogadores/:nome" element={<LegacyRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
