import { slugify } from "./texto";
import type {
  Atleta,
  Classificacao,
  Conferencia,
  Elenco,
  EstadoJogo,
  Jogo,
  LadoJogo,
  Time,
} from "./tipos";

/* Normalizadores: transformam as respostas (não oficiais) da API pública da ESPN no formato do app. */

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown, padrao = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : padrao);
const num = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseFloat(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
};
const cor = (hex: unknown, padrao: string): string => {
  const h = str(hex).replace("#", "");
  return /^[0-9a-f]{6}$/i.test(h) ? `#${h.toLowerCase()}` : padrao;
};

export const logoUrl = (abreviacao: string, escuro = true): string =>
  `https://a.espncdn.com/i/teamlogos/nba/500${escuro ? "-dark" : ""}/${abreviacao.toLowerCase()}.png`;

/* ------------------------------------------------------------------ times */

export const normalizarTimes = (json: unknown): Time[] => {
  const lista = arr(obj(arr(obj(arr(obj(json).sports)[0]).leagues)[0]).teams);
  return lista
    .map((item) => obj(obj(item).team))
    .filter((t) => str(t.id) && str(t.displayName))
    .map<Time>((t) => ({
      id: str(t.id),
      slug: slugify(str(t.displayName)),
      nome: str(t.displayName),
      abreviacao: str(t.abbreviation),
      cidade: str(t.location),
      cor: cor(t.color, "#334155"),
      corAlt: cor(t.alternateColor, "#94a3b8"),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
};

/* ------------------------------------------------------------------ jogos */

const ESTADO_PADRAO: Record<string, EstadoJogo> = { pre: "agendado", in: "ao-vivo", post: "encerrado" };

const traduzirDetalhe = (estado: EstadoJogo, status: Obj): string => {
  const tipo = obj(status.type);
  const nome = str(tipo.name);
  const detalhe = str(tipo.detail) || str(tipo.shortDetail);
  if (estado === "adiado") return nome === "STATUS_CANCELED" ? "Cancelado" : "Adiado";
  if (estado === "encerrado") {
    const ot = /\/(\d?)OT/i.exec(detalhe);
    if (ot) return ot[1] ? `Encerrado · ${ot[1]} prorrogações` : "Encerrado · prorrogação";
    return "Encerrado";
  }
  if (estado === "ao-vivo") {
    if (nome === "STATUS_HALFTIME" || /half/i.test(detalhe)) return "Intervalo";
    if (nome === "STATUS_END_PERIOD") return `Fim do ${num(status.period) ?? ""}º período`.trim();
    const periodo = num(status.period) ?? 0;
    const relogio = str(status.displayClock);
    const rotulo = periodo > 4 ? `${periodo - 4}ºOT` : `Q${periodo}`;
    return relogio ? `${rotulo} ${relogio}` : rotulo;
  }
  return "";
};

const normalizarLado = (c: Obj): LadoJogo => {
  const time = obj(c.team);
  const placar = obj(c.score);
  const valor = typeof c.score === "object" ? num(placar.value ?? placar.displayValue) : num(c.score);
  const recordes = arr(c.records).map(obj);
  const geral = recordes.find((r) => /overall|total/i.test(str(r.name) + str(r.type))) ?? recordes[0];
  return {
    timeId: str(time.id),
    abreviacao: str(time.abbreviation),
    nome: str(time.displayName) || str(time.name),
    cor: cor(time.color, "#334155"),
    placar: valor ?? null,
    vencedor: c.winner === true,
    recorde: geral ? str(geral.summary) || undefined : undefined,
  };
};

export const normalizarEvento = (evento: unknown): Jogo | null => {
  const e = obj(evento);
  const comp = obj(arr(e.competitions)[0]);
  const lados = arr(comp.competitors).map(obj);
  const casa = lados.find((l) => l.homeAway === "home");
  const fora = lados.find((l) => l.homeAway === "away");
  const inicio = new Date(str(e.date));
  if (!casa || !fora || Number.isNaN(inicio.getTime())) return null;

  const status = obj(e.status ?? comp.status);
  const tipo = obj(status.type);
  const nomeStatus = str(tipo.name);
  let estado: EstadoJogo = ESTADO_PADRAO[str(tipo.state)] ?? "agendado";
  if (/POSTPONED|CANCELED|SUSPENDED/i.test(nomeStatus)) estado = "adiado";

  const local = obj(comp.venue);
  const cidade = obj(local.address);
  return {
    id: str(e.id),
    inicio,
    estado,
    detalhe: traduzirDetalhe(estado, status),
    casa: normalizarLado(casa),
    fora: normalizarLado(fora),
    local: str(local.fullName) ? [str(local.fullName), str(cidade.city)].filter(Boolean).join(" · ") : undefined,
    transmissao: arr(comp.broadcasts)
      .flatMap((b) => arr(obj(b).names).map((n) => str(n)))
      .filter(Boolean),
    nota: str(obj(arr(comp.notes)[0]).headline) || undefined,
  };
};

export const normalizarJogos = (json: unknown): Jogo[] =>
  arr(obj(json).events)
    .map(normalizarEvento)
    .filter((j): j is Jogo => j !== null)
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

/* ------------------------------------------------------------------ classificação */

export const normalizarClassificacao = (json: unknown): Classificacao[] => {
  const saida: Classificacao[] = [];
  for (const filho of arr(obj(json).children)) {
    const f = obj(filho);
    const conferencia: Conferencia = /east/i.test(str(f.name)) ? "Leste" : "Oeste";
    for (const entrada of arr(obj(f.standings).entries)) {
      const en = obj(entrada);
      const stats = new Map(arr(en.stats).map((s) => [str(obj(s).name), obj(s)]));
      const v = (nome: string) => str(stats.get(nome)?.displayValue);
      saida.push({
        timeId: str(obj(en.team).id),
        conferencia,
        posicao: num(v("playoffSeed")) ?? 99,
        vitorias: num(v("wins")) ?? 0,
        derrotas: num(v("losses")) ?? 0,
        pct: v("winPercent") || ".000",
        gb: v("gamesBehind") || "-",
        sequencia: v("streak") || "-",
        casa: v("Home") || "-",
        fora: v("Road") || "-",
        ultimos10: v("Last Ten Games") || "-",
        pontosPro: num(v("avgPointsFor")) ?? 0,
        pontosContra: num(v("avgPointsAgainst")) ?? 0,
        saldo: v("differential") || "0.0",
      });
    }
  }
  return saida;
};

/* ------------------------------------------------------------------ elenco e calendário */

export const normalizarElenco = (json: unknown): Elenco => {
  const j = obj(json);
  const atletas = arr(j.athletes)
    .map(obj)
    .filter((a) => str(a.id) && (str(a.fullName) || str(a.displayName)))
    .map<Atleta>((a) => ({
      id: str(a.id),
      nome: str(a.fullName) || str(a.displayName),
      camisa: str(a.jersey) || undefined,
      posicao: str(obj(a.position).abbreviation) || undefined,
      idade: num(a.age),
      altura: str(a.displayHeight) || undefined,
      peso: str(a.displayWeight) || undefined,
      experiencia: num(obj(a.experience).years),
      foto: str(obj(a.headshot).href) || undefined,
    }))
    .sort((a, b) => (num(a.camisa) ?? 999) - (num(b.camisa) ?? 999));
  const tecnico = obj(arr(j.coach)[0]);
  const nomeTecnico = [str(tecnico.firstName), str(tecnico.lastName)].filter(Boolean).join(" ");
  return { atletas, tecnico: nomeTecnico || undefined };
};

export const normalizarCalendario = (json: unknown): Jogo[] =>
  arr(obj(json).events)
    .map(normalizarEvento)
    .filter((j): j is Jogo => j !== null)
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
