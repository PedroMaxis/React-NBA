import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DaySelector from "@/components/DaySelector";
import EstadoErro, { AvisoObsoleto } from "@/components/EstadoErro";
import GameCard from "@/components/GameCard";
import { ListaSkeleton } from "@/components/Skeleton";
import { buscarJogos } from "@/lib/api";
import { capitalizar, diaNBA, diaValido, rotuloDia } from "@/lib/datas";
import { useDados } from "@/lib/useDados";

const Jogos = () => {
  const [params, setParams] = useSearchParams();
  const hoje = diaNBA();
  const pedido = params.get("data");
  const dia = diaValido(pedido) ? pedido : hoje;

  const { resultado, carregando, erro, recarregar } = useDados((sinal) => buscarJogos(dia, sinal), dia, dia === hoje ? 20_000 : undefined);

  const mudarDia = (novo: string) => setParams(novo === hoje ? {} : { data: novo }, { replace: true });

  const jogos = useMemo(() => resultado?.dados ?? [], [resultado]);
  const aoVivo = jogos.filter((j) => j.estado === "ao-vivo");
  const demais = jogos.filter((j) => j.estado !== "ao-vivo");

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-court-800 via-court-900 to-court-950 p-6 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-hardwood/20 blur-3xl" />
        <p className="text-sm font-medium uppercase tracking-widest text-hardwood">Temporada 2026-27</p>
        <h1 className="mt-1 font-display text-5xl leading-none sm:text-7xl">
          {dia === hoje ? "Jogos de hoje" : "Jogos do dia"}
        </h1>
        <p className="mt-2 text-slate-300">
          {capitalizar(rotuloDia(dia, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))}
        </p>
        <p className="mt-3 text-sm text-slate-400" aria-live="polite">
          {carregando && !resultado
            ? "Carregando jogos…"
            : `${jogos.length} ${jogos.length === 1 ? "jogo" : "jogos"}${aoVivo.length ? ` · ${aoVivo.length} ao vivo agora` : ""}`}
          {resultado && !resultado.obsoleto && dia === hoje && (
            <span className="ml-2 text-slate-500">
              · atualizado às {resultado.atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </p>
        <div className="mt-6">
          <DaySelector dia={dia} onChange={mudarDia} />
        </div>
      </section>

      {resultado?.obsoleto && <AvisoObsoleto desde={resultado.atualizadoEm} />}
      {carregando && !resultado && <ListaSkeleton itens={6} className="h-44" />}
      {erro && !resultado && <EstadoErro mensagem={erro} onTentar={recarregar} />}

      {resultado && jogos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <h2 className="text-lg font-semibold">Sem jogos neste dia</h2>
          <p className="mt-1 text-sm text-slate-400">Use as setas para ver os dias anteriores ou seguintes.</p>
        </div>
      )}

      {aoVivo.length > 0 && (
        <section aria-labelledby="ao-vivo">
          <h2 id="ao-vivo" className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-300">
            Ao vivo
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {aoVivo.map((j) => (
              <GameCard key={j.id} jogo={j} />
            ))}
          </div>
        </section>
      )}

      {demais.length > 0 && (
        <section aria-labelledby="todos">
          <h2 id="todos" className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {aoVivo.length ? "Demais jogos" : "Todos os jogos"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {demais.map((j) => (
              <GameCard key={j.id} jogo={j} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Jogos;
