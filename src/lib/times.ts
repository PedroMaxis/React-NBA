import { titulosDe } from "@/data/titulos";
import { semAcento } from "./texto";
import type { Classificacao, Conferencia, Time } from "./tipos";

export type OrdemTimes = "nome" | "vitorias" | "titulos";
export type FiltroConferencia = Conferencia | "Todas";

export interface TimeComDados {
  time: Time;
  classificacao?: Classificacao;
  titulos: number;
}

export const juntarDados = (times: readonly Time[], classificacao: readonly Classificacao[]): TimeComDados[] => {
  const porId = new Map(classificacao.map((c) => [c.timeId, c]));
  return times.map((time) => ({ time, classificacao: porId.get(time.id), titulos: titulosDe(time.abreviacao).length }));
};

interface Filtros {
  busca?: string;
  conferencia?: FiltroConferencia;
  somenteFavoritos?: boolean;
  favoritos?: ReadonlySet<string>;
  ordem?: OrdemTimes;
}

/** Busca, filtro de conferência, favoritos e ordenação, sem alterar a lista original */
export const listarTimes = (lista: readonly TimeComDados[], f: Filtros = {}): TimeComDados[] => {
  const termo = semAcento((f.busca ?? "").trim());
  return lista
    .filter(({ time, classificacao }) => {
      if (f.conferencia && f.conferencia !== "Todas" && classificacao?.conferencia !== f.conferencia) return false;
      if (f.somenteFavoritos && !f.favoritos?.has(time.slug)) return false;
      return !termo || semAcento(`${time.nome} ${time.cidade} ${time.abreviacao}`).includes(termo);
    })
    .sort((a, b) => {
      if (f.ordem === "vitorias") {
        const dif = (b.classificacao?.vitorias ?? -1) - (a.classificacao?.vitorias ?? -1);
        if (dif) return dif;
        const pct = parseFloat(b.classificacao?.pct ?? "0") - parseFloat(a.classificacao?.pct ?? "0");
        return pct || a.time.nome.localeCompare(b.time.nome);
      }
      if (f.ordem === "titulos") return b.titulos - a.titulos || a.time.nome.localeCompare(b.time.nome);
      return a.time.nome.localeCompare(b.time.nome);
    });
};

export const titulosPorDecada = (titulos: readonly number[]): { decada: number; total: number }[] => {
  const mapa = new Map<number, number>();
  for (const ano of titulos) {
    const decada = Math.floor(ano / 10) * 10;
    mapa.set(decada, (mapa.get(decada) ?? 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) => a[0] - b[0]).map(([decada, total]) => ({ decada, total }));
};

/** Classificação de uma conferência, ordenada pela posição (seed) */
export const daConferencia = (lista: readonly Classificacao[], conferencia: Conferencia): Classificacao[] =>
  lista.filter((c) => c.conferencia === conferencia).sort((a, b) => a.posicao - b.posicao);

/** Cor do texto (clara/escura) que contrasta com um fundo hexadecimal */
export const textoSobre = (hex: string): "#ffffff" | "#0b1224" => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminancia = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminancia > 0.45 ? "#0b1224" : "#ffffff";
};
