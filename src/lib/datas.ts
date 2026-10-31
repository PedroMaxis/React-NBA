/* A ESPN agrupa os jogos por dia no fuso de Nova York (ET). Usamos o mesmo fuso para escolher o "dia". */

const FUSO_NBA = "America/New_York";

/** "2026-10-31" na data de Nova York */
export const diaNBA = (data: Date = new Date()): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: FUSO_NBA, year: "numeric", month: "2-digit", day: "2-digit" }).format(data);

export const paraParametroESPN = (dia: string): string => dia.replace(/-/g, "");

export const diaValido = (dia: string | null | undefined): dia is string =>
  !!dia && /^\d{4}-\d{2}-\d{2}$/.test(dia) && !Number.isNaN(new Date(`${dia}T12:00:00Z`).getTime());

export const somarDias = (dia: string, quantidade: number): string => {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + quantidade);
  return d.toISOString().slice(0, 10);
};

/** Data do "dia NBA" formatada em português, sem sofrer com fuso (usa meio-dia UTC) */
export const rotuloDia = (dia: string, opcoes: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...opcoes }).format(new Date(`${dia}T12:00:00Z`));

export const horaLocal = (data: Date): string =>
  new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(data);

export const capitalizar = (texto: string): string => texto.charAt(0).toUpperCase() + texto.slice(1);

export const dataCurta = (data: Date): string =>
  capitalizar(
    new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).format(data).replace(".", "")
  );
