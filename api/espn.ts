/**
 * Proxy da API pública da ESPN (função serverless da Vercel).
 *
 * O navegador não consegue chamar a ESPN diretamente de forma confiável (o CDN deles responde ao CORS de forma
 * inconsistente). Aqui repassamos só os endpoints que o app usa e adicionamos cache de borda.
 * Rota pública: /api/espn/<caminho> (reescrita no vercel.json para /api/espn?path=<caminho>).
 */

const PERMITIDOS = [
  /^site\/v2\/sports\/basketball\/nba\/scoreboard$/,
  /^site\/v2\/sports\/basketball\/nba\/teams$/,
  /^site\/v2\/sports\/basketball\/nba\/teams\/\d{1,3}\/(roster|schedule)$/,
  /^v2\/sports\/basketball\/nba\/standings$/,
];

const ORIGEM = "https://site.api.espn.com/apis/";
// identifica o app (o CDN da ESPN bloqueia alguns User-Agents de robôs, como o do Chrome headless)
const USER_AGENT = "Mozilla/5.0 (compatible; NBALog/2.0; +https://github.com/PedroMaxis/React-NBA)";

const json = (corpo: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", ...extra },
  });

export async function GET(request: Request): Promise<Response> {
  const entrada = new URL(request.url);
  const caminho = (entrada.searchParams.get("path") ?? "").replace(/^\/+|\/+$/g, "");
  if (!PERMITIDOS.some((regra) => regra.test(caminho))) return json({ erro: "Caminho não permitido" }, 404);

  // só repassamos o parâmetro de data (AAAAMMDD)
  const destino = new URL(ORIGEM + caminho);
  const data = entrada.searchParams.get("dates");
  if (data !== null) {
    if (!/^\d{8}$/.test(data)) return json({ erro: "Data inválida" }, 400);
    destino.searchParams.set("dates", data);
  }

  try {
    const resposta = await fetch(destino, { headers: { accept: "application/json", "user-agent": USER_AGENT } });
    const corpo = await resposta.text();
    return new Response(corpo, {
      status: resposta.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        // placares mudam rápido: cache curto na borda, servindo o antigo enquanto revalida
        "cache-control": "public, s-maxage=10, stale-while-revalidate=60",
      },
    });
  } catch {
    return json({ erro: "ESPN indisponível" }, 502);
  }
}
