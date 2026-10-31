import { Star } from "./icons";

interface Props {
  ativo: boolean;
  nome: string;
  onClick: () => void;
  className?: string;
}

const FavoriteButton = ({ ativo, nome, onClick, className = "" }: Props) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={ativo}
    aria-label={ativo ? `Remover ${nome} dos favoritos` : `Adicionar ${nome} aos favoritos`}
    title={ativo ? "Remover dos favoritos" : "Favoritar"}
    className={`rounded-full p-2 transition-colors hover:bg-white/15 ${ativo ? "text-hardwood" : "text-white/70"} ${className}`}
  >
    <Star filled={ativo} className="h-5 w-5" />
  </button>
);

export default FavoriteButton;
