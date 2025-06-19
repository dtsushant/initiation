import { ConfigEnv, defineConfig, UserConfig } from "vite";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import checker from "vite-plugin-checker";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PWA = VitePWA({
  injectRegister: "auto",
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.png"],
  manifest: {
    name: "Initiation",
    short_name: "Init",
    description: "Take an initiative to build your dream",
    icons: [
      {
        src: "android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
    theme_color: "#2E5BFF",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html}", "**/*.{svg,png,jpg,gif,webp,ico}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  devOptions: {
    enabled: true,
    type: "module",
    navigateFallback: "index.html",
    suppressWarnings: true,
    disableRuntimeConfig: false,
  },
});
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
    plugins: [react(), checker({ typescript: true }), viteCompression(), PWA],
    resolve: {
      alias: [
        /*{
          find: "xingine-react",
          replacement: resolve(__dirname, "./.yalc/xingine-react/dist/"),
        },*/ // added with yalc add xingine-react --pure
        //   { find: "xingine", replacement: resolve(__dirname, "./.yalc/xingine/dist/") }, // added with yalc add xingine-react --pure
        { find: "/@", replacement: resolve(__dirname, "./src") },
        {
          find: "@shared",
          replacement: resolve(__dirname, "../packages/shared/src"),
        },
        {
          find: "@rule-ui",
          replacement: resolve(__dirname, "../packages/rule-ui/src"),
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
