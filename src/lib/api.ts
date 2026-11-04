import { diaNBA, paraParametroESPN } from "./datas";
import {
  normalizarCalendario,
  normalizarClassificacao,
  normalizarElenco,
  normalizarJogos,
  normalizarTimes,
} from "./espn";
import type { Classificacao, Elenco, Jogo, Resultado, Time } from "./tipos";

// Chamamos o proxy do próprio site (/api/espn: evita problemas de CORS) e, se ele falhar, a ESPN direto.
const PROXY = "/api/espn";
const DIRETO = "https://site.api.espn.com/apis";
const SITE = "/site/v2/sports/basketball/nba";
const V2 = "/v2/sports/basketball/nba";
const PREFIXO = "nba-log:cache:";

const memoria = new Map<string, { t: number; dados: unknown }>();

interface Salvo {
  t: number;
  dados: unknown;
}

const lerDisco = (chave: string): Salvo | null => {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto ? (JSON.parse(bruto) as Salvo) : null;
  } catch {
    return null;
  }
};

const gravarDisco = (chave: string, valor: Salvo) => {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    /* sem espaço: segue só com a memória */
  }
};

/**
 * Busca um JSON com cache: dentro do `ttl` reaproveita a memória; se a rede falhar,
 * devolve a última cópia salva marcada como `obsoleto` em vez de quebrar a tela.
 */
const baixar = async (caminho: string, sinal?: AbortSignal): Promise<unknown> => {
  let ultimoErro: unknown;
  for (const base of [PROXY, DIRETO]) {
    try {
      const resposta = await fetch(base + caminho, { signal: sinal });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return (await resposta.json()) as unknown;
    } catch (erro) {
      if (sinal?.aborted) throw erro;
      ultimoErro = erro;
    }
  }
  throw ultimoErro;
};

const buscar = async <T>(url: string, ttlMs: number, normalizar: (json: unknown) => T, sinal?: AbortSignal): Promise<Resultado<T>> => {
  const agora = Date.now();
  const cache = memoria.get(url);
  if (cache && agora - cache.t < ttlMs) {
    return { dados: normalizar(cache.dados), atualizadoEm: new Date(cache.t), obsoleto: false };
  }
  try {
    const json = await baixar(url, sinal);
    const dados = normalizar(json);
    memoria.set(url, { t: agora, dados: json });
    gravarDisco(url, { t: agora, dados: json });
    return { dados, atualizadoEm: new Date(agora), obsoleto: false };
  } catch (erro) {
    if (sinal?.aborted) throw erro;
    const salvo = cache ?? lerDisco(url);
    if (salvo) return { dados: normalizar(salvo.dados), atualizadoEm: new Date(salvo.t), obsoleto: true };
    throw erro;
  }
};

const MIN = 60_000;
const HORA = 60 * MIN;

export const buscarTimes = (sinal?: AbortSignal): Promise<Resultado<Time[]>> =>
  buscar(`${SITE}/teams`, 24 * HORA, normalizarTimes, sinal);

export const buscarClassificacao = (sinal?: AbortSignal): Promise<Resultado<Classificacao[]>> =>
  buscar(`${V2}/standings`, 5 * MIN, normalizarClassificacao, sinal);

/** `dia` no formato AAAA-MM-DD (dia NBA). Dias passados mudam pouco; o dia de hoje atualiza a cada 20 s. */
export const buscarJogos = (dia: string, sinal?: AbortSignal): Promise<Resultado<Jogo[]>> =>
  buscar(`${SITE}/scoreboard?dates=${paraParametroESPN(dia)}`, dia === diaNBA() ? 15_000 : 10 * MIN, normalizarJogos, sinal);

export const buscarElenco = (timeId: string, sinal?: AbortSignal): Promise<Resultado<Elenco>> =>
  buscar(`${SITE}/teams/${timeId}/roster`, 6 * HORA, normalizarElenco, sinal);

export const buscarCalendario = (timeId: string, sinal?: AbortSignal): Promise<Resultado<Jogo[]>> =>
  buscar(`${SITE}/teams/${timeId}/schedule`, 2 * MIN, normalizarCalendario, sinal);
