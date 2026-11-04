export const ordinal = (n: number): string => `${n}º`;

/** "W3" / "L2" (ESPN) -> "3 vitórias" / "2 derrotas" */
export const traduzirSequencia = (seq: string): string => {
  const m = /^([WL])(\d+)$/i.exec(seq.trim());
  if (!m) return seq;
  const n = Number(m[2]);
  return m[1].toUpperCase() === "W" ? `${n} ${n === 1 ? "vitória" : "vitórias"}` : `${n} ${n === 1 ? "derrota" : "derrotas"}`;
};

/** Sequência curta em português: W3 -> V3, L2 -> D2 */
export const sequenciaCurta = (seq: string): string => seq.replace(/^W/i, "V").replace(/^L/i, "D");

/** "6' 5\"" -> "1,96 m" ; "184 lbs" -> "83 kg" */
export const alturaMetros = (altura?: string): string | undefined => {
  const m = altura ? /(\d+)'\s*(\d+)/.exec(altura) : null;
  if (!m) return altura;
  const metros = (Number(m[1]) * 12 + Number(m[2])) * 0.0254;
  return `${metros.toFixed(2).replace(".", ",")} m`;
};

export const pesoKg = (peso?: string): string | undefined => {
  const m = peso ? /(\d+)\s*lbs?/i.exec(peso) : null;
  return m ? `${Math.round(Number(m[1]) * 0.45359237)} kg` : peso;
};
