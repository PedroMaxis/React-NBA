import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const BolaIcone = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#f0a04b" />
    <g fill="none" stroke="#1b1208" strokeWidth="3">
      <circle cx="32" cy="32" r="30" />
      <path d="M2 32h60M32 2v60" />
      <path d="M10 10c12 10 12 34 0 44M54 10c-12 10-12 34 0 44" />
    </g>
  </svg>
);

const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
      isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-hardwood focus:px-3 focus:py-2 focus:text-court-950"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-court-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4">
          <Link to="/" className="flex items-center gap-2">
            <BolaIcone className="h-7 w-7" />
            <span className="font-display text-3xl leading-none tracking-wide">NBA Log</span>
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-0.5 overflow-x-auto sm:gap-1">
            <NavLink to="/" end className={link}>
              Jogos
            </NavLink>
            <NavLink to="/classificacao" className={link}>
              Classificação
            </NavLink>
            <NavLink to="/times" className={link}>
              Times
            </NavLink>
            <NavLink to="/sobre" className={link}>
              Sobre
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>
          Dados e imagens da API pública da ESPN. Projeto de estudo, sem vínculo com a NBA, com os times ou com a ESPN.{" "}
          <Link to="/sobre" className="underline hover:text-white">
            Saiba mais
          </Link>
          .
        </p>
      </footer>
    </div>
  );
};

export default Layout;
