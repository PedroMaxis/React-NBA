/**
 * Títulos da NBA por franquia (inclui os conquistados em cidades/nomes anteriores),
 * indexados pela abreviação usada pela ESPN. Atualizado até o fim da temporada 2025-26.
 */
export const TITULOS_ATE = "temporada 2025-26";

export const titulosPorTime: Record<string, number[]> = {
  ATL: [1958],
  BKN: [],
  BOS: [1957, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1968, 1969, 1974, 1976, 1981, 1984, 1986, 2008, 2024],
  CHA: [],
  CHI: [1991, 1992, 1993, 1996, 1997, 1998],
  CLE: [2016],
  DAL: [2011],
  DEN: [2023],
  DET: [1989, 1990, 2004],
  GS: [1947, 1956, 1975, 2015, 2017, 2018, 2022],
  HOU: [1994, 1995],
  IND: [],
  LAC: [],
  LAL: [1949, 1950, 1952, 1953, 1954, 1972, 1980, 1982, 1985, 1987, 1988, 2000, 2001, 2002, 2009, 2010, 2020],
  MEM: [],
  MIA: [2006, 2012, 2013],
  MIL: [1971, 2021],
  MIN: [],
  NO: [],
  NY: [1970, 1973, 2026],
  OKC: [1979, 2025],
  ORL: [],
  PHI: [1955, 1967, 1983],
  PHX: [],
  POR: [1977],
  SA: [1999, 2003, 2005, 2007, 2014],
  SAC: [1951],
  TOR: [2019],
  UTAH: [],
  WSH: [1978],
};

export const titulosDe = (abreviacao: string): number[] => titulosPorTime[abreviacao] ?? [];
