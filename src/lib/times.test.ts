import { describe, expect, it } from "vitest";
import { titulosPorTime } from "@/data/titulos";
import { iniciais, semAcento, slugify } from "./texto";
import { daConferencia, juntarDados, listarTimes, textoSobre, titulosPorDecada } from "./times";
import { capitalizar, diaNBA, diaValido, rotuloDia, somarDias } from "./datas";
import { alturaMetros, pesoKg, sequenciaCurta, traduzirSequencia } from "./formato";
import type { Classificacao, Time } from "./tipos";

const time = (id: string, nome: string, abreviacao: string, cidade: string): Time => ({
  id,
  slug: slugify(nome),
  nome,
  abreviacao,
  cidade,
  cor: "#000000",
  corAlt: "#ffffff",
});
const TIMES = [
  time("1", "Los Angeles Lakers", "LAL", "Los Angeles"),
  time("2", "Boston Celtics", "BOS", "Boston"),
  time("3", "New York Knicks", "NY", "New York"),
];
const classif = (timeId: string, conferencia: "Leste" | "Oeste", posicao: number, v: number, d: number): Classificacao => ({
  timeId, conferencia, posicao, vitorias: v, derrotas: d, pct: (v / (v + d)).toFixed(3).replace(/^0/, ""),
  gb: "-", sequencia: "W1", casa: "-", fora: "-", ultimos10: "-", pontosPro: 0, pontosContra: 0, saldo: "0",
});
const DADOS = juntarDados(TIMES, [classif("1", "Oeste", 1, 5, 0), classif("2", "Leste", 2, 3, 2), classif("3", "Leste", 1, 4, 1)]);

describe("textos", () => {
  it("slugify e semAcento", () => {
    expect(slugify("Los Angeles Lakers")).toBe("los-angeles-lakers");
    expect(slugify("LA Clippers")).toBe("la-clippers");
    expect(semAcento("São Paulo")).toBe("sao paulo");
    expect(iniciais("Michael Jordan")).toBe("MJ");
  });
});

describe("listarTimes", () => {
  it("ordena por nome, vitórias e títulos", () => {
    expect(listarTimes(DADOS, { ordem: "nome" }).map((d) => d.time.abreviacao)).toEqual(["BOS", "LAL", "NY"]);
    expect(listarTimes(DADOS, { ordem: "vitorias" }).map((d) => d.time.abreviacao)).toEqual(["LAL", "NY", "BOS"]);
    expect(listarTimes(DADOS, { ordem: "titulos" }).map((d) => d.time.abreviacao)).toEqual(["BOS", "LAL", "NY"]);
  });
  it("filtra por conferência, busca (sem acento) e favoritos", () => {
    expect(listarTimes(DADOS, { conferencia: "Leste" }).map((d) => d.time.abreviacao).sort()).toEqual(["BOS", "NY"]);
    expect(listarTimes(DADOS, { busca: "ANGELES" }).map((d) => d.time.abreviacao)).toEqual(["LAL"]);
    expect(listarTimes(DADOS, { busca: "xyz" })).toEqual([]);
    expect(listarTimes(DADOS, { somenteFavoritos: true, favoritos: new Set(["boston-celtics"]) }).map((d) => d.time.abreviacao)).toEqual(["BOS"]);
  });
  it("não altera a lista original", () => {
    const antes = DADOS.map((d) => d.time.id);
    listarTimes(DADOS, { ordem: "nome" });
    expect(DADOS.map((d) => d.time.id)).toEqual(antes);
  });
  it("daConferencia ordena pela posição", () => {
    const leste = daConferencia([classif("2", "Leste", 2, 3, 2), classif("3", "Leste", 1, 4, 1), classif("1", "Oeste", 1, 5, 0)], "Leste");
    expect(leste.map((l) => l.timeId)).toEqual(["3", "2"]);
  });
});

describe("títulos", () => {
  it("30 times, anos em ordem crescente e sem repetição", () => {
    expect(Object.keys(titulosPorTime)).toHaveLength(30);
    for (const anos of Object.values(titulosPorTime)) {
      expect([...anos].sort((a, b) => a - b)).toEqual(anos);
      expect(new Set(anos).size).toBe(anos.length);
    }
  });
  it("total de campeões confere com os anos de disputa", () => {
    // 1947 a 2026 = 80 finais; 1 (Baltimore Bullets, 1948) é de uma franquia extinta fora desta lista
    const total = Object.values(titulosPorTime).reduce((n, anos) => n + anos.length, 0);
    expect(total).toBe(79);
  });
  it("cada ano aparece em no máximo um time", () => {
    const todos = Object.values(titulosPorTime).flat();
    expect(new Set(todos).size).toBe(todos.length);
  });
  it("agrupa por década", () => {
    expect(titulosPorDecada([1991, 1992, 1996, 2006])).toEqual([{ decada: 1990, total: 3 }, { decada: 2000, total: 1 }]);
  });
});

describe("datas (dia no fuso de Nova York)", () => {
  it("diaNBA usa o fuso de Nova York, não o do navegador", () => {
    // 03:00 UTC do dia 1 ainda é noite do dia anterior em Nova York
    expect(diaNBA(new Date("2026-11-01T03:00:00Z"))).toBe("2026-10-31");
    expect(diaNBA(new Date("2026-11-01T15:00:00Z"))).toBe("2026-11-01");
  });
  it("somarDias atravessa mês e ano", () => {
    expect(somarDias("2026-10-31", 1)).toBe("2026-11-01");
    expect(somarDias("2026-01-01", -1)).toBe("2025-12-31");
  });
  it("valida e formata", () => {
    expect(diaValido("2026-10-31")).toBe(true);
    expect(diaValido("31/10/2026")).toBe(false);
    expect(diaValido("2026-13-45")).toBe(false);
    expect(diaValido(null)).toBe(false);
    expect(rotuloDia("2026-10-31", { weekday: "long" })).toBe("sábado");
    expect(capitalizar("sábado, 31 de outubro")).toBe("Sábado, 31 de outubro");
  });
});

describe("formatação", () => {
  it("sequência, altura e peso", () => {
    expect(traduzirSequencia("W3")).toBe("3 vitórias");
    expect(traduzirSequencia("L1")).toBe("1 derrota");
    expect(sequenciaCurta("L5")).toBe("D5");
    expect(alturaMetros("6' 5\"")).toBe("1,96 m");
    expect(pesoKg("184 lbs")).toBe("83 kg");
  });
  it("textoSobre escolhe texto legível", () => {
    expect(textoSobre("#ffffff")).toBe("#0b1224");
    expect(textoSobre("#000000")).toBe("#ffffff");
    expect(textoSobre("#552583")).toBe("#ffffff");
  });
});
