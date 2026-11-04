import { describe, expect, it } from "vitest";
import calendario from "./__fixtures__/calendario.json";
import classificacao from "./__fixtures__/classificacao.json";
import elenco from "./__fixtures__/elenco.json";
import agendado from "./__fixtures__/placar-agendado.json";
import final from "./__fixtures__/placar-final.json";
import times from "./__fixtures__/times.json";
import {
  logoUrl,
  normalizarCalendario,
  normalizarClassificacao,
  normalizarElenco,
  normalizarEvento,
  normalizarJogos,
  normalizarTimes,
} from "./espn";

describe("normalizarTimes", () => {
  const lista = normalizarTimes(times);
  it("lê id, nome, abreviação e cores (com #) e ordena por nome", () => {
    expect(lista.map((t) => t.abreviacao)).toEqual(["GS", "LAL", "NY"]);
    const lakers = lista.find((t) => t.abreviacao === "LAL")!;
    expect(lakers).toMatchObject({ id: "13", slug: "los-angeles-lakers", cidade: "Los Angeles", cor: "#552583", corAlt: "#fdb927" });
  });
  it("não quebra com resposta vazia ou inválida", () => {
    expect(normalizarTimes({})).toEqual([]);
    expect(normalizarTimes(null)).toEqual([]);
  });
});

describe("logoUrl", () => {
  it("monta a URL do logo pela abreviação (minúscula)", () => {
    expect(logoUrl("LAL")).toBe("https://a.espncdn.com/i/teamlogos/nba/500-dark/lal.png");
    expect(logoUrl("NY", false)).toBe("https://a.espncdn.com/i/teamlogos/nba/500/ny.png");
  });
});

describe("normalizarJogos", () => {
  it("jogo encerrado: placar, vencedor, estado e nota das Finais", () => {
    const [jogo] = normalizarJogos(final);
    expect(jogo.estado).toBe("encerrado");
    expect(jogo.detalhe).toBe("Encerrado");
    expect(jogo.nota).toMatch(/NBA Finals/);
    const vencedores = [jogo.casa, jogo.fora].filter((l) => l.vencedor);
    expect(vencedores).toHaveLength(1);
    expect(vencedores[0].abreviacao).toBe("NY");
    expect(jogo.casa.placar).toBe(90);
    expect(jogo.fora.placar).toBe(94);
  });

  it("jogo agendado: sem placar e com horário válido", () => {
    const [jogo] = normalizarJogos(agendado);
    expect(jogo.estado).toBe("agendado");
    expect(jogo.detalhe).toBe("");
    expect(jogo.inicio).toBeInstanceOf(Date);
    expect(Number.isNaN(jogo.inicio.getTime())).toBe(false);
    expect(jogo.casa.abreviacao).not.toBe(jogo.fora.abreviacao);
  });

  it("jogo ao vivo mostra período e relógio; intervalo e prorrogação em português", () => {
    const base = structuredClone(agendado.events[0]) as Record<string, unknown>;
    const comStatus = (state: string, extra: Record<string, unknown>) => ({
      ...base,
      status: { period: 3, displayClock: "5:23", type: { state, completed: false, name: "STATUS_IN_PROGRESS", detail: "5:23 - 3rd Quarter", ...extra } },
    });
    expect(normalizarEvento(comStatus("in", {}))?.detalhe).toBe("Q3 5:23");
    expect(normalizarEvento(comStatus("in", {}))?.estado).toBe("ao-vivo");
    expect(normalizarEvento(comStatus("in", { name: "STATUS_HALFTIME", detail: "Halftime" }))?.detalhe).toBe("Intervalo");
    const ot = { ...comStatus("in", {}), status: { period: 6, displayClock: "2:10", type: { state: "in", name: "STATUS_IN_PROGRESS", detail: "2:10 - 2nd OT" } } };
    expect(normalizarEvento(ot)?.detalhe).toBe("2ºOT 2:10");
    expect(normalizarEvento(comStatus("post", { detail: "Final/OT", name: "STATUS_FINAL" }))?.detalhe).toBe("Encerrado · prorrogação");
    expect(normalizarEvento(comStatus("post", { detail: "Final/2OT", name: "STATUS_FINAL" }))?.detalhe).toBe("Encerrado · 2 prorrogações");
    expect(normalizarEvento(comStatus("pre", { name: "STATUS_POSTPONED" }))?.estado).toBe("adiado");
  });

  it("ignora eventos incompletos sem quebrar", () => {
    expect(normalizarEvento({})).toBeNull();
    expect(normalizarJogos({ events: [{}, null, 3] })).toEqual([]);
  });
});

describe("normalizarClassificacao", () => {
  const linhas = normalizarClassificacao(classificacao);
  it("separa Leste e Oeste e lê campanha e posição", () => {
    expect(new Set(linhas.map((l) => l.conferencia))).toEqual(new Set(["Leste", "Oeste"]));
    const l = linhas[0];
    expect(l.vitorias + l.derrotas).toBeGreaterThanOrEqual(0);
    expect(l.posicao).toBeGreaterThan(0);
    expect(l.pct).toMatch(/^\.?\d/);
    expect(l.timeId).toBeTruthy();
  });
});

describe("normalizarElenco", () => {
  const e = normalizarElenco(elenco);
  it("lê atletas com número, posição, idade e foto, ordenados pela camisa", () => {
    expect(e.atletas.length).toBe(3);
    const numeros = e.atletas.map((a) => Number(a.camisa ?? 999));
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    expect(e.atletas[0].foto).toMatch(/^https:\/\//);
    expect(e.tecnico).toBeTruthy();
  });
});

describe("normalizarCalendario", () => {
  const jogos = normalizarCalendario(calendario);
  it("aceita o placar no formato objeto usado pelo calendário do time", () => {
    const final = jogos.find((j) => j.estado === "encerrado")!;
    expect(typeof final.casa.placar).toBe("number");
    expect(typeof final.fora.placar).toBe("number");
    expect([final.casa, final.fora].some((l) => l.vencedor)).toBe(true);
  });
  it("vem em ordem cronológica e tem jogo futuro", () => {
    const datas = jogos.map((j) => j.inicio.getTime());
    expect(datas).toEqual([...datas].sort((a, b) => a - b));
    expect(jogos.some((j) => j.estado === "agendado")).toBe(true);
  });
});
