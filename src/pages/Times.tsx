import { useMemo, useState } from "react";
import EstadoErro from "@/components/EstadoErro";
import { ListaSkeleton } from "@/components/Skeleton";
import TeamCard from "@/components/TeamCard";
import { Search } from "@/components/icons";
import { buscarClassificacao, buscarTimes } from "@/lib/api";
import { useFavoritos } from "@/lib/favorites";
import { juntarDados, listarTimes, type FiltroConferencia, type OrdemTimes } from "@/lib/times";
import { useDados } from "@/lib/useDados";

const FILTROS: FiltroConferencia[] = ["Todas", "Leste", "Oeste"];

const Times = () => {
  const times = useDados(buscarTimes, "times");
  const tabela = useDados(buscarClassificacao, "classificacao");
  const { favoritos, alternar } = useFavoritos();

  const [busca, setBusca] = useState("");
  const [conferencia, setConferencia] = useState<FiltroConferencia>("Todas");
  const [ordem, setOrdem] = useState<OrdemTimes>("nome");
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);

  const todos = useMemo(
    () => juntarDados(times.resultado?.dados ?? [], tabela.resultado?.dados ?? []),
    [times.resultado, tabela.resultado]
  );
  const lista = useMemo(
    () => listarTimes(todos, { busca, conferencia, ordem, somenteFavoritos, favoritos }),
    [todos, busca, conferencia, ordem, somenteFavoritos, favoritos]
  );

  const campo = "rounded-xl border border-white/10 bg-court-800 px-3 py-2 text-sm";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-5xl sm:text-6xl">Times</h1>
        <p className="mt-1 text-slate-400">Os 30 times da NBA, com campanha da temporada e títulos.</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar time ou cidade"
            aria-label="Buscar time"
            className={`${campo} w-full pl-9`}
          />
        </div>
        <div role="group" aria-label="Conferência" className="inline-flex rounded-xl border border-white/10 bg-court-800 p-1">
          {FILTROS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={conferencia === c}
              onClick={() => setConferencia(c)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                conferencia === c ? "bg-white/15 font-medium" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Ordenar
          <select value={ordem} onChange={(e) => setOrdem(e.target.value as OrdemTimes)} className={campo}>
            <option value="nome">Nome (A–Z)</option>
            <option value="vitorias">Vitórias na temporada</option>
            <option value="titulos">Títulos</option>
          </select>
        </label>
        <button
          type="button"
          aria-pressed={somenteFavoritos}
          onClick={() => setSomenteFavoritos((v) => !v)}
          className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
            somenteFavoritos ? "border-hardwood bg-hardwood/15 text-hardwood" : "border-white/10 bg-court-800 text-slate-300 hover:bg-white/10"
          }`}
        >
          ★ Favoritos ({favoritos.size})
        </button>
      </div>

      {times.carregando && !times.resultado && <ListaSkeleton itens={9} className="h-64" />}
      {times.erro && !times.resultado && <EstadoErro mensagem={times.erro} onTentar={times.recarregar} />}

      {times.resultado && (
        <>
          <p className="text-sm text-slate-400" aria-live="polite">
            {lista.length} {lista.length === 1 ? "time" : "times"}
          </p>
          {lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">
              Nenhum time encontrado com esses filtros.
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lista.map((d) => (
                <TeamCard key={d.time.id} dados={d} favorito={favoritos.has(d.time.slug)} onFavoritar={() => alternar(d.time.slug)} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Times;
