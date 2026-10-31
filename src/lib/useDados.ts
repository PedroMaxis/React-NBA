import { useCallback, useEffect, useRef, useState } from "react";
import type { Resultado } from "./tipos";

interface Estado<T> {
  resultado: Resultado<T> | null;
  carregando: boolean;
  erro: string | null;
}

/**
 * Carrega dados assíncronos com estados de carregamento/erro, cancelamento ao trocar de tela
 * e atualização automática opcional (só enquanto a aba está visível).
 */
export const useDados = <T>(
  buscar: ((sinal: AbortSignal) => Promise<Resultado<T>>) | null,
  chave: string,
  intervaloMs?: number
) => {
  const [estado, setEstado] = useState<Estado<T>>({ resultado: null, carregando: buscar !== null, erro: null });
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  const carregar = useCallback(async (sinal: AbortSignal, silencioso: boolean) => {
    const fn = buscarRef.current;
    if (!fn) return;
    if (!silencioso) setEstado((e) => ({ ...e, carregando: true, erro: null }));
    try {
      const resultado = await fn(sinal);
      if (!sinal.aborted) setEstado({ resultado, carregando: false, erro: null });
    } catch (e) {
      if (sinal.aborted) return;
      setEstado((atual) => ({
        resultado: silencioso ? atual.resultado : null,
        carregando: false,
        erro: e instanceof Error ? e.message : "Erro desconhecido",
      }));
    }
  }, []);

  useEffect(() => {
    if (!buscarRef.current) return;
    const controle = new AbortController();
    setEstado((e) => ({ ...e, resultado: null, carregando: true, erro: null }));
    void carregar(controle.signal, false);

    let timer: number | undefined;
    if (intervaloMs) {
      timer = window.setInterval(() => {
        if (!document.hidden) void carregar(controle.signal, true);
      }, intervaloMs);
    }
    return () => {
      controle.abort();
      if (timer) window.clearInterval(timer);
    };
  }, [chave, intervaloMs, carregar]);

  const recarregar = useCallback(() => {
    const controle = new AbortController();
    void carregar(controle.signal, false);
  }, [carregar]);

  return { ...estado, recarregar };
};
