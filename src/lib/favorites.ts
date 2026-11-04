import { useCallback, useEffect, useState } from "react";

const CHAVE = "nba-log:favoritos";

const ler = (): string[] => {
  try {
    const dados: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(dados) ? dados.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/** Times favoritos, salvos no navegador */
export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Set<string>>(() => new Set(ler()));

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify([...favoritos]));
    } catch {
      /* armazenamento indisponível: continua só em memória */
    }
  }, [favoritos]);

  const alternar = useCallback((slug: string) => {
    setFavoritos((atual) => {
      const novo = new Set(atual);
      if (!novo.delete(slug)) novo.add(slug);
      return novo;
    });
  }, []);

  return { favoritos, alternar };
};
