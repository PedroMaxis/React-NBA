import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import EstadoErro, { AvisoObsoleto } from "@/components/EstadoErro";
import FavoriteButton from "@/components/FavoriteButton";
import GameCard from "@/components/GameCard";
import PlayerCard from "@/components/PlayerCard";
import Skeleton, { ListaSkeleton } from "@/components/Skeleton";
import TeamLogo from "@/components/TeamLogo";
import { Trophy } from "@/components/icons";
import { TITULOS_ATE, titulosDe } from "@/data/titulos";
import { buscarCalendario, buscarClassificacao, buscarElenco, buscarTimes } from "@/lib/api";
import { dataCurta } from "@/lib/datas";
import { useFavoritos } from "@/lib/favorites";
import { ordinal, traduzirSequencia } from "@/lib/formato";
import { slugify } from "@/lib/texto";
import { textoSobre, titulosPorDecada } from "@/lib/times";
import type { Jogo, Time } from "@/lib/tipos";
import { useDados } from "@/lib/useDados";
import NotFound from "./NotFound";

const Resultado = ({ jogo, time }: { jogo: Jogo; time: Time }) => {
  const casa = jogo.casa.timeId === time.id;
  const eu = casa ? jogo.casa : jogo.fora;
  const rival = casa ? jogo.fora : jogo.casa;
  const venceu = eu.vencedor;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-court-800/60 px-3 py-2.5 text-sm">
      <span className="w-20 shrink-0 text-xs text-slate-400">{dataCurta(jogo.inicio)}</span>
      <span className="w-5 shrink-0 text-center text-xs text-slate-500">{casa ? "vs" : "@"}</span>
      <TeamLogo abreviacao={rival.abreviacao} nome={rival.nome} cor={rival.cor} className="h-7 w-7" />
      <Link to={`/times/${slugify(rival.nome)}`} className="min-w-0 flex-1 truncate hover:underline">
        {rival.nome}
      </Link>
      <span className={`shrink-0 font-semibold tabular-nums ${venceu ? "text-emerald-400" : "text-red-400"}`}>
        {venceu ? "V" : "D"} {eu.placar}–{rival.placar}
      </span>
    </li>
  );
};

const TimePage = () => {
  const { slug } = useParams();
  const times = useDados(buscarTimes, "times");
  const time = useMemo(() => times.resultado?.dados.find((t) => t.slug === slugify(slug ?? "")), [times.resultado, slug]);
  const id = time?.id;

  const tabela = useDados(buscarClassificacao, "classificacao");
  const elenco = useDados(id ? (s) => buscarElenco(id, s) : null, `elenco-${id}`);
  const calendario = useDados(id ? (s) => buscarCalendario(id, s) : null, `calendario-${id}`, 60_000);
  const { favoritos, alternar } = useFavoritos();

  if (times.carregando && !times.resultado) return <Skeleton className="h-64" />;
  if (times.erro && !times.resultado) return <EstadoErro mensagem={times.erro} onTentar={times.recarregar} />;
  if (!time) return <NotFound />;

  const campanha = tabela.resultado?.dados.find((c) => c.timeId === time.id);
  const jogos = calendario.resultado?.dados ?? [];
  const aoVivoOuProximo = jogos.find((j) => j.estado === "ao-vivo") ?? jogos.find((j) => j.estado === "agendado");
  const proximos = jogos.filter((j) => j.estado === "agendado" && j !== aoVivoOuProximo).slice(0, 4);
  const recentes = jogos.filter((j) => j.estado === "encerrado").slice(-5).reverse();

  const titulos = titulosDe(time.abreviacao);
  const decadas = titulosPorDecada(titulos);
  const maxDecada = Math.max(1, ...decadas.map((d) => d.total));
  const texto = textoSobre(time.cor);

  return (
    <div className="space-y-10">
      <section
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10"
        style={{ background: `linear-gradient(120deg, ${time.cor} 0%, ${time.cor}dd 45%, #0b1224 100%)`, color: texto }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-2 font-display text-[16rem] leading-none opacity-10">
          {time.abreviacao}
        </span>
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <TeamLogo abreviacao={time.abreviacao} nome={time.nome} cor={time.cor} className="h-28 w-28 drop-shadow-2xl sm:h-36 sm:w-36" />
          <div className="flex-1">
            <p className="text-sm uppercase tracking-widest opacity-80">
              {time.cidade}
              {campanha ? ` · Conferência ${campanha.conferencia}` : ""}
            </p>
            <h1 className="font-display text-5xl leading-none sm:text-7xl">{time.nome}</h1>
            {campanha && (
              <p className="mt-3 text-lg">
                <b className="tabular-nums">
                  {campanha.vitorias}-{campanha.derrotas}
                </b>{" "}
                · {ordinal(campanha.posicao)} no {campanha.conferencia}
                {campanha.sequencia !== "-" && <span className="opacity-80"> · {traduzirSequencia(campanha.sequencia)} seguidas</span>}
              </p>
            )}
            <p className="mt-1 flex items-center gap-2 text-sm opacity-90">
              <Trophy className="h-4 w-4" /> {titulos.length} {titulos.length === 1 ? "título" : "títulos"} da NBA
            </p>
          </div>
          <FavoriteButton
            ativo={favoritos.has(time.slug)}
            nome={time.nome}
            onClick={() => alternar(time.slug)}
            className="self-start bg-black/25 !text-white"
          />
        </div>
      </section>

      {calendario.resultado?.obsoleto && <AvisoObsoleto desde={calendario.resultado.atualizadoEm} />}

      <section aria-labelledby="jogos-do-time" className="space-y-4">
        <h2 id="jogos-do-time" className="font-display text-3xl">
          {aoVivoOuProximo?.estado === "ao-vivo" ? "Jogo ao vivo" : "Próximo jogo"}
        </h2>
        {calendario.carregando && !calendario.resultado && <Skeleton className="h-44" />}
        {calendario.erro && !calendario.resultado && <EstadoErro mensagem={calendario.erro} onTentar={calendario.recarregar} />}
        {calendario.resultado && !aoVivoOuProximo && <p className="text-slate-400">Nenhum jogo agendado no momento.</p>}
        {aoVivoOuProximo && (
          <div className="max-w-xl">
            <GameCard jogo={aoVivoOuProximo} />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {proximos.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Em seguida</h3>
              <ul className="space-y-2">
                {proximos.map((j) => {
                  const casa = j.casa.timeId === time.id;
                  const rival = casa ? j.fora : j.casa;
                  return (
                    <li key={j.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-court-800/60 px-3 py-2.5 text-sm">
                      <span className="w-20 shrink-0 text-xs text-slate-400">{dataCurta(j.inicio)}</span>
                      <span className="w-5 shrink-0 text-center text-xs text-slate-500">{casa ? "vs" : "@"}</span>
                      <TeamLogo abreviacao={rival.abreviacao} nome={rival.nome} cor={rival.cor} className="h-7 w-7" />
                      <Link to={`/times/${slugify(rival.nome)}`} className="min-w-0 flex-1 truncate hover:underline">
                        {rival.nome}
                      </Link>
                      <span className="shrink-0 text-xs text-hardwood">{j.inicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {recentes.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Últimos resultados</h3>
              <ul className="space-y-2">
                {recentes.map((j) => (
                  <Resultado key={j.id} jogo={j} time={time} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="elenco" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 id="elenco" className="font-display text-3xl">Elenco</h2>
          {elenco.resultado?.dados.tecnico && (
            <p className="text-sm text-slate-400">
              Técnico: <b className="text-slate-200">{elenco.resultado.dados.tecnico}</b>
            </p>
          )}
        </div>
        {elenco.carregando && !elenco.resultado && <ListaSkeleton itens={8} className="h-60" />}
        {elenco.erro && !elenco.resultado && <EstadoErro mensagem={elenco.erro} onTentar={elenco.recarregar} />}
        {elenco.resultado && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {elenco.resultado.dados.atletas.map((a) => (
              <PlayerCard key={a.id} atleta={a} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titulos" className="space-y-4">
        <h2 id="titulos" className="font-display text-3xl">Títulos</h2>
        {titulos.length === 0 ? (
          <p className="text-slate-400">O {time.nome} ainda não conquistou o título da NBA.</p>
        ) : (
          <div className="grid gap-6 rounded-2xl border border-white/10 bg-court-800/60 p-5 lg:grid-cols-2">
            <ul className="flex flex-wrap content-start gap-2" aria-label="Anos dos títulos">
              {titulos.map((ano) => (
                <li key={ano} className="rounded-lg border border-hardwood/40 bg-hardwood/10 px-3 py-1.5 font-display text-xl tracking-wide text-hardwood">
                  {ano}
                </li>
              ))}
            </ul>
            <div className="space-y-2" aria-label="Títulos por década">
              {decadas.map((d) => (
                <div key={d.decada} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-slate-400">{d.decada}s</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${(d.total / maxDecada) * 100}%`, backgroundColor: time.corAlt }} />
                  </div>
                  <span className="w-5 text-right tabular-nums">{d.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-slate-500">
          Contagem até a {TITULOS_ATE}; inclui títulos conquistados pela franquia em cidades ou nomes anteriores.
        </p>
      </section>
    </div>
  );
};

export default TimePage;
