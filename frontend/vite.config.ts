import { ConfigEnv, defineConfig, UserConfig } from "vite";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import checker from "vite-plugin-checker";
import viteCompression from "vite-plugin-compression";
import tailwindcss from "tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '/@', replacement: resolve(__dirname, './src') },
      { find: '@shared', replacement: resolve(__dirname, '../packages/shared/src') },
      { find: '@rule-ui', replacement: resolve(__dirname, '../packages/rule-ui/src') }
    ],
  },
  server: {
    port: 3001,
    open: true,
    '/foo': 'http://localhost:4567',
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
  },
});*/
/*react();
checker({ typescript: true });
viteCompression();*/
export default ({ mode }: ConfigEnv) => {
  const { VITE_APP_NODE_ENV, VITE_APP_TITLE } = dotenv.parse(
    fs.readFileSync(`.env.${mode}`),
  );

  console.log(
    "\x1B[33m%s\x1B[0m",
    `🏭--NODE (VITE_APP_NODE_ENV): ${VITE_APP_NODE_ENV}`,
  );
  console.log(
    "\x1B[36m%s\x1B[0m",
    `🏠--APP (VITE_APP_TITLE): ${VITE_APP_TITLE}`,
  );

  return defineConfig({
    plugins: [react(), checker({ typescript: true }), viteCompression()],
    resolve: {
      alias: [
        { find: "/@", replacement: resolve(__dirname, "./src") },
        {
          find: "@shared",
          replacement: resolve(__dirname, "../packages/shared/src"),
        },
        {
          find: "@rule-ui",
          replacement: resolve(__dirname, "../packages/rule-ui/src"),
        },
        {
          find: "@xingine",
          replacement: resolve(__dirname, "../packages/xingine/src"),
        },
      ],
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq, req) => {
              console.log(
                `[vite-proxy] ${req.method} ${req.url} → ${proxyReq.path}`,
              );
            });

            proxy.on("error", (err, req, res) => {
              console.error("[vite-proxy] Proxy error:", err.message);
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ error: "Backend unavailable (proxy error)" }),
              );
            });
          },
        },
      },
    },
  });
};
