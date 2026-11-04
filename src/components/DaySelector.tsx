import { diaNBA, rotuloDia, somarDias } from "@/lib/datas";
import { Arrow } from "./icons";

interface Props {
  dia: string;
  onChange: (dia: string) => void;
}

const DaySelector = ({ dia, onChange }: Props) => {
  const hoje = diaNBA();
  const dias = Array.from({ length: 7 }, (_, i) => somarDias(dia, i - 3));
  const base = "flex min-w-14 flex-col items-center rounded-xl px-2 py-2 text-xs transition-colors";

  return (
    <div className="flex items-center gap-1 sm:gap-2" role="group" aria-label="Escolher dia">
      <button
        type="button"
        onClick={() => onChange(somarDias(dia, -1))}
        aria-label="Dia anterior"
        className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
      >
        <Arrow dir="left" className="h-5 w-5" />
      </button>

      <div className="flex flex-1 justify-between gap-1 overflow-x-auto sm:justify-center">
        {dias.map((d) => {
          const ativo = d === dia;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onChange(d)}
              aria-pressed={ativo}
              aria-label={rotuloDia(d, { weekday: "long", day: "numeric", month: "long" })}
              className={`${base} ${ativo ? "bg-hardwood text-court-950" : "text-slate-300 hover:bg-white/10"}`}
            >
              <span className="uppercase tracking-wide opacity-80">{rotuloDia(d, { weekday: "short" }).replace(".", "")}</span>
              <span className="font-display text-2xl leading-none">{rotuloDia(d, { day: "numeric" })}</span>
              <span className={`mt-0.5 h-1 w-1 rounded-full ${d === hoje ? (ativo ? "bg-court-950" : "bg-hardwood") : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange(somarDias(dia, 1))}
        aria-label="Próximo dia"
        className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
      >
        <Arrow dir="right" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onChange(hoje)}
        disabled={dia === hoje}
        className="ml-1 hidden rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-40 sm:block"
      >
        Hoje
      </button>
    </div>
  );
};

export default DaySelector;
