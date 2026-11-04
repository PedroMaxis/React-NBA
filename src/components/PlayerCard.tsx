import { useState } from "react";
import { alturaMetros, pesoKg } from "@/lib/formato";
import { iniciais } from "@/lib/texto";
import type { Atleta } from "@/lib/tipos";

const PlayerCard = ({ atleta }: { atleta: Atleta }) => {
  const [semFoto, setSemFoto] = useState(!atleta.foto);
  const detalhes = [alturaMetros(atleta.altura), pesoKg(atleta.peso)].filter(Boolean).join(" · ");
  return (
    <li className="overflow-hidden rounded-2xl border border-white/10 bg-court-800">
      <div className="relative flex h-44 items-end justify-center bg-gradient-to-b from-white/5 to-transparent">
        {semFoto ? (
          <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 font-display text-3xl text-slate-300">
            {iniciais(atleta.nome)}
          </span>
        ) : (
          <img
            src={atleta.foto}
            alt={atleta.nome}
            loading="lazy"
            decoding="async"
            onError={() => setSemFoto(true)}
            className="h-full w-full object-contain object-bottom"
          />
        )}
        {atleta.camisa && (
          <span aria-hidden="true" className="absolute left-3 top-1 font-display text-5xl leading-none text-white/20">
            {atleta.camisa}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate font-semibold leading-tight">{atleta.nome}</h3>
        <p className="text-xs text-slate-400">
          {[atleta.camisa && `#${atleta.camisa}`, atleta.posicao, atleta.idade && `${atleta.idade} anos`].filter(Boolean).join(" · ")}
        </p>
        {detalhes && <p className="mt-1 text-xs text-slate-500">{detalhes}</p>}
      </div>
    </li>
  );
};

export default PlayerCard;
