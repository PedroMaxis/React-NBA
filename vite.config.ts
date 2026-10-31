import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

function proxyEspn() {
  return {
    "/api/espn": {
      target: "https://site.api.espn.com",
      changeOrigin: true,
      // mesmo User-Agent da função da Vercel (o CDN da ESPN bloqueia o do Chrome headless)
      headers: { "user-agent": "Mozilla/5.0 (compatible; NBALog/2.0; +https://github.com/PedroMax/React-NBA)" },
      rewrite: (caminho: string) => caminho.replace(/^\/api\/espn\//, "/apis/"),
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Em desenvolvimento, /api/espn faz o papel da função serverless (api/espn.ts) que roda na Vercel
  server: { proxy: proxyEspn() },
  preview: { proxy: proxyEspn() },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "api/**/*.test.ts"],
  },
});
