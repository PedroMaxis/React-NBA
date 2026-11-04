import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./espn";

const chamar = (url: string) => GET(new Request(`https://nba-log.test${url}`));

afterEach(() => vi.unstubAllGlobals());

describe("proxy /api/espn", () => {
  it("repassa o placar com a data e adiciona cache e CORS", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"events":[]}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await chamar("/api/espn?path=site/v2/sports/basketball/nba/scoreboard&dates=20261031");
    expect(r.status).toBe(200);
    expect(await r.text()).toBe('{"events":[]}');
    expect(r.headers.get("cache-control")).toContain("s-maxage");
    expect(r.headers.get("access-control-allow-origin")).toBe("*");
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20261031"
    );
  });

  it("aceita os endpoints usados pelo app", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response("{}"))));
    for (const p of [
      "site/v2/sports/basketball/nba/teams",
      "site/v2/sports/basketball/nba/teams/13/roster",
      "site/v2/sports/basketball/nba/teams/13/schedule",
      "v2/sports/basketball/nba/standings",
    ]) {
      expect((await chamar(`/api/espn?path=${p}`)).status, p).toBe(200);
    }
  });

  it("não é um proxy aberto: bloqueia outros caminhos e hosts", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const p of ["", "../../etc/passwd", "site/v2/sports/football/nfl/scoreboard", "http://evil.com/x", "site/v2/sports/basketball/nba/teams/13/roster/../../../x"]) {
      expect((await chamar(`/api/espn?path=${encodeURIComponent(p)}`)).status, p).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("valida o parâmetro de data", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const r = await chamar("/api/espn?path=site/v2/sports/basketball/nba/scoreboard&dates=hoje");
    expect(r.status).toBe(400);
  });

  it("devolve 502 quando a ESPN está fora do ar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("rede")));
    const r = await chamar("/api/espn?path=v2/sports/basketball/nba/standings");
    expect(r.status).toBe(502);
  });
});
