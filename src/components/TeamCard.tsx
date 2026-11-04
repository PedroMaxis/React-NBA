import { Link } from "react-router-dom";
import { ordinal } from "@/lib/formato";
import type { TimeComDados } from "@/lib/times";
import FavoriteButton from "./FavoriteButton";
import TeamLogo from "./TeamLogo";
import { Trophy } from "./icons";

interface Props {
  dados: TimeComDados;
  favorito: boolean;
  onFavoritar: () => void;
}

const TeamCard = ({ dados: { time, classificacao, titulos }, favorito, onFavoritar }: Props) => (
  <li className="group relative">
    <Link
      to={`/times/${time.slug}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-court-800 transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/40"
    >
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${time.cor}, ${time.cor}99 55%, ${time.corAlt}44)` }}
      >
        <span aria-hidden="true" className="absolute -right-2 -top-6 font-display text-[9rem] leading-none text-white/10">
          {time.abreviacao}
        </span>
        <TeamLogo
          abreviacao={time.abreviacao}
          nome={time.nome}
          cor={time.cor}
          className="relative h-24 w-24 drop-shadow-xl transition-transform duration-200 group-hover:scale-110"
        />
      </div>
      <div className="space-y-2 p-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{time.nome}</h3>
          <p className="text-sm text-slate-400">
            {classificacao
              ? `${classificacao.vitorias}-${classificacao.derrotas} · ${ordinal(classificacao.posicao)} no ${classificacao.conferencia}`
              : time.cidade}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-hardwood">
          <Trophy className="h-4 w-4" />
          <b className="tabular-nums">{titulos}</b> {titulos === 1 ? "título" : "títulos"}
        </p>
      </div>
    </Link>
    <FavoriteButton ativo={favorito} nome={time.nome} onClick={onFavoritar} className="absolute right-2 top-2 bg-black/30" />
  </li>
);

export default TeamCard;
