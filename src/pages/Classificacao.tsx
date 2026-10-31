import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EstadoErro, { AvisoObsoleto } from "@/components/EstadoErro";
import Skeleton from "@/components/Skeleton";
import TeamLogo from "@/components/TeamLogo";
import { buscarClassificacao, buscarTimes } from "@/lib/api";
import { sequenciaCurta } from "@/lib/formato";
import { daConferencia } from "@/lib/times";
import type { Conferencia } from "@/lib/tipos";
import { useDados } from "@/lib/useDados";

const Classificacao = () => {
  const [conferencia, setConferencia] = useState<Conferencia>("Leste");
  const times = useDados(buscarTimes, "times");
  const tabela = useDados(buscarClassificacao, "classificacao", 120_000);

  const porId = useMemo(() => new Map((times.resultado?.dados ?? []).map((t) => [t.id, t])), [times.resultado]);
  const linhas = useMemo(() => daConferencia(tabela.resultado?.dados ?? [], conferencia), [tabela.resultado, conferencia]);
  const carregando = (tabela.carregando && !tabela.resultado) || (times.carregando && !times.resultado);
  const erro = (tabela.erro && !tabela.resultado) || (times.erro && !times.resultado);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-5xl sm:text-6xl">Classificação</h1>
        <p className="mt-1 text-slate-400">Temporada 2026-27 · atualizada automaticamente</p>
      </header>

      <div role="tablist" aria-label="Conferência" className="inline-flex rounded-xl border border-white/10 bg-court-800 p-1">
        {(["Leste", "Oeste"] as const).map((c) => (
          <button
            key={c}
            role="tab"
            type="button"
            aria-selected={conferencia === c}
            onClick={() => setConferencia(c)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
              conferencia === c ? "bg-hardwood text-court-950" : "text-slate-300 hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {tabela.resultado?.obsoleto && <AvisoObsoleto desde={tabela.resultado.atualizadoEm} />}
      {carregando && <Skeleton className="h-96" />}
      {erro && (
        <EstadoErro
          mensagem={tabela.erro ?? times.erro ?? undefined}
          onTentar={() => {
            tabela.recarregar();
            times.recarregar();
          }}
        />
      )}

      {linhas.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-court-800/70">
          <table className="w-full min-w-[34rem] text-sm">
            <caption className="sr-only">Classificação da conferência {conferencia}</caption>
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                <th scope="col" className="w-10 py-3 pl-4 text-left">#</th>
                <th scope="col" className="py-3 text-left">Time</th>
                <th scope="col" className="px-2 py-3 text-right">V</th>
                <th scope="col" className="px-2 py-3 text-right">D</th>
                <th scope="col" className="px-2 py-3 text-right">%</th>
                <th scope="col" className="px-2 py-3 text-right">GB</th>
                <th scope="col" className="hidden px-2 py-3 text-right sm:table-cell">Casa</th>
                <th scope="col" className="hidden px-2 py-3 text-right sm:table-cell">Fora</th>
                <th scope="col" className="px-2 py-3 text-right">Últ. 10</th>
                <th scope="col" className="py-3 pl-2 pr-4 text-right">Seq.</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => {
                const time = porId.get(l.timeId);
                const zona = l.posicao <= 6 ? "border-l-emerald-400" : l.posicao <= 10 ? "border-l-amber-400" : "border-l-transparent";
                return (
                  <tr key={l.timeId} className={`border-b border-white/5 border-l-4 transition-colors hover:bg-white/5 ${zona} ${l.posicao === 6 || l.posicao === 10 ? "border-b-white/20" : ""}`}>
                    <td className="py-2.5 pl-3 font-display text-xl text-slate-400">{l.posicao}</td>
                    <th scope="row" className="py-2.5 text-left font-medium">
                      {time ? (
                        <Link to={`/times/${time.slug}`} className="flex items-center gap-3 hover:underline">
                          <TeamLogo abreviacao={time.abreviacao} nome={time.nome} cor={time.cor} className="h-8 w-8" />
                          <span className="truncate">{time.nome}</span>
                        </Link>
                      ) : (
                        l.timeId
                      )}
                    </th>
                    <td className="px-2 text-right tabular-nums">{l.vitorias}</td>
                    <td className="px-2 text-right tabular-nums">{l.derrotas}</td>
                    <td className="px-2 text-right tabular-nums text-slate-300">{l.pct}</td>
                    <td className="px-2 text-right tabular-nums text-slate-300">{l.gb}</td>
                    <td className="hidden px-2 text-right tabular-nums text-slate-300 sm:table-cell">{l.casa}</td>
                    <td className="hidden px-2 text-right tabular-nums text-slate-300 sm:table-cell">{l.fora}</td>
                    <td className="px-2 text-right tabular-nums text-slate-300">{l.ultimos10}</td>
                    <td className={`py-2.5 pl-2 pr-4 text-right font-medium tabular-nums ${l.sequencia.startsWith("W") ? "text-emerald-400" : l.sequencia.startsWith("L") ? "text-red-400" : ""}`}>
                      {sequenciaCurta(l.sequencia)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
        <li className="flex items-center gap-2"><span className="h-3 w-1 rounded bg-emerald-400" /> 1º–6º: vaga direta nos playoffs</li>
        <li className="flex items-center gap-2"><span className="h-3 w-1 rounded bg-amber-400" /> 7º–10º: play-in</li>
        <li>V vitórias · D derrotas · GB jogos atrás do líder</li>
      </ul>
    </div>
  );
};

export default Classificacao;
