import { useState } from "react";
import { logoUrl } from "@/lib/espn";
import { textoSobre } from "@/lib/times";

interface Props {
  abreviacao: string;
  nome: string;
  cor: string;
  className?: string;
}

/** Logo oficial do time; se a imagem não carregar, mostra um monograma nas cores do time */
const TeamLogo = ({ abreviacao, nome, cor, className = "h-10 w-10" }: Props) => {
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <span
        role="img"
        aria-label={`Logo do ${nome}`}
        className={`inline-flex shrink-0 items-center justify-center rounded-full font-display text-sm tracking-wide ${className}`}
        style={{ backgroundColor: cor, color: textoSobre(cor) }}
      >
        {abreviacao}
      </span>
    );
  }
  return (
    <img
      src={logoUrl(abreviacao)}
      alt={`Logo do ${nome}`}
      loading="lazy"
      decoding="async"
      onError={() => setFalhou(true)}
      className={`shrink-0 object-contain ${className}`}
    />
  );
};

export default TeamLogo;
