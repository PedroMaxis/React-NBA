import { Link } from "react-router-dom";
import { horaLocal } from "@/lib/datas";
import { slugify } from "@/lib/texto";
import type { Jogo, LadoJogo } from "@/lib/tipos";
import TeamLogo from "./TeamLogo";

const Linha = ({ lado, jogo }: { lado: LadoJogo; jogo: Jogo }) => {
  const aoVivo = jogo.estado === "ao-vivo";
  const encerrado = jogo.estado === "encerrado";
  const perdedor = encerrado && !lado.vencedor;
  return (
    <div className="flex items-center gap-3">
      <TeamLogo abreviacao={lado.abreviacao} nome={lado.nome} cor={lado.cor} className="h-11 w-11" />
      <div className="min-w-0 flex-1">
        <Link
          to={`/times/${slugify(lado.nome)}`}
          className={`block truncate font-semibold leading-tight hover:underline ${perdedor ? "text-slate-400" : ""}`}
        >
          {lado.nome}
        </Link>
        {lado.recorde && <span className="text-xs text-slate-400">{lado.recorde}</span>}
      </div>
      {jogo.estado !== "agendado" && jogo.estado !== "adiado" && (
        <span
          className={`font-display text-4xl leading-none tabular-nums ${
            perdedor ? "text-slate-500" : aoVivo || lado.vencedor ? "text-white" : ""
          }`}
        >
          {lado.placar ?? "–"}
        </span>
      )}
    </div>
  );
};

const Chip = ({ jogo }: { jogo: Jogo }) => {
  if (jogo.estado === "ao-vivo") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        AO VIVO · {jogo.detalhe}
      </span>
    );
  }
  if (jogo.estado === "encerrado") {
    return <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300">{jogo.detalhe}</span>;
  }
  if (jogo.estado === "adiado") {
    return <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-300">{jogo.detalhe}</span>;
  }
  return (
    <span className="rounded-full bg-hardwood/15 px-2.5 py-1 text-xs font-semibold text-hardwood">
      {horaLocal(jogo.inicio)}
    </span>
  );
};

const GameCard = ({ jogo }: { jogo: Jogo }) => (
  <article
    className={`rounded-2xl border bg-court-800/70 p-4 backdrop-blur transition hover:border-white/25 ${
      jogo.estado === "ao-vivo" ? "border-red-500/40 shadow-lg shadow-red-500/10" : "border-white/10"
    }`}
    aria-label={`${jogo.fora.nome} em ${jogo.casa.nome}`}
  >
    <header className="mb-4 flex items-center justify-between gap-2">
      <Chip jogo={jogo} />
      {jogo.nota && <span className="truncate text-xs text-slate-400">{jogo.nota}</span>}
    </header>
    <div className="space-y-3">
      <Linha lado={jogo.fora} jogo={jogo} />
      <Linha lado={jogo.casa} jogo={jogo} />
    </div>
    {(jogo.local || jogo.transmissao.length > 0) && (
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-xs text-slate-400">
        <span className="truncate">{jogo.local}</span>
        {jogo.transmissao.length > 0 && <span>{jogo.transmissao.slice(0, 3).join(" · ")}</span>}
      </footer>
    )}
  </article>
);

export default GameCard;
