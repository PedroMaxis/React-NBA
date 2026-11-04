export type Conferencia = "Leste" | "Oeste";
export type EstadoJogo = "agendado" | "ao-vivo" | "encerrado" | "adiado";

export interface Time {
  id: string;
  slug: string;
  nome: string;
  abreviacao: string;
  cidade: string;
  /** cores em hexadecimal com '#' */
  cor: string;
  corAlt: string;
}

export interface Classificacao {
  timeId: string;
  conferencia: Conferencia;
  posicao: number;
  vitorias: number;
  derrotas: number;
  pct: string;
  gb: string;
  sequencia: string;
  casa: string;
  fora: string;
  ultimos10: string;
  pontosPro: number;
  pontosContra: number;
  saldo: string;
}

export interface LadoJogo {
  timeId: string;
  abreviacao: string;
  nome: string;
  cor: string;
  placar: number | null;
  vencedor: boolean;
  recorde?: string;
}

export interface Jogo {
  id: string;
  inicio: Date;
  estado: EstadoJogo;
  /** texto pronto para exibir: "Q3 5:23", "Encerrado", "Intervalo"... */
  detalhe: string;
  casa: LadoJogo;
  fora: LadoJogo;
  local?: string;
  transmissao: string[];
  nota?: string;
}

export interface Atleta {
  id: string;
  nome: string;
  camisa?: string;
  posicao?: string;
  idade?: number;
  altura?: string;
  peso?: string;
  experiencia?: number;
  foto?: string;
}

export interface Elenco {
  atletas: Atleta[];
  tecnico?: string;
}

export interface Resultado<T> {
  dados: T;
  atualizadoEm: Date;
  /** true quando a API falhou e estamos mostrando a última cópia salva */
  obsoleto: boolean;
}
