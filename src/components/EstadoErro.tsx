interface Props {
  mensagem?: string;
  onTentar: () => void;
}

const EstadoErro = ({ mensagem, onTentar }: Props) => (
  <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
    <h2 className="text-lg font-semibold">Não foi possível carregar os dados</h2>
    <p className="mt-1 text-sm text-slate-300">
      A API pública da ESPN não respondeu. Verifique sua conexão e tente de novo.
    </p>
    {mensagem && <p className="mt-1 text-xs text-slate-500">{mensagem}</p>}
    <button
      type="button"
      onClick={onTentar}
      className="mt-4 rounded-lg bg-hardwood px-4 py-2 text-sm font-semibold text-court-950 transition hover:brightness-110"
    >
      Tentar novamente
    </button>
  </div>
);

export const AvisoObsoleto = ({ desde }: { desde: Date }) => (
  <p role="status" className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
    Sem conexão com a API: mostrando os dados salvos às{" "}
    {desde.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.
  </p>
);

export default EstadoErro;
