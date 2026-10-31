import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="py-20 text-center">
    <p className="font-display text-8xl text-hardwood">404</p>
    <h1 className="mt-2 text-2xl font-semibold">Página não encontrada</h1>
    <p className="mt-2 text-slate-400">O time ou a página que você procura não existe.</p>
    <div className="mt-6 flex justify-center gap-3">
      <Link to="/" className="rounded-lg bg-hardwood px-4 py-2 text-sm font-semibold text-court-950 hover:brightness-110">
        Ver jogos de hoje
      </Link>
      <Link to="/times" className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
        Todos os times
      </Link>
    </div>
  </div>
);

export default NotFound;
