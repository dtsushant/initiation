import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Workbox } from "workbox-window";
import InstallAppButton from "/@/InstallAppButton.tsx";
import "./index.css";
import { ContextBureau } from "/src/lib/xingine-react/context/ContextBureau.tsx";
import { App } from "/src/initiation/App.tsx";
import { layoutMap } from "/@/initiation/constants/Layout.map.ts";
import { componentMap } from "/@/initiation/constants/Component.map.ts";

// Create query client for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Register service worker with vite-plugin-pwa
if ("serviceWorker" in navigator && "PushManager" in window) {
  window.addEventListener("load", () => {
    import("workbox-window")
      .then(({ Workbox }) => {
        const wb = new Workbox("/sw.js");

        wb.addEventListener("waiting", () => {
          const shouldReload = window.confirm(
            "A new version is available. Reload to update?",
          );
          if (shouldReload) wb.messageSW({ type: "SKIP_WAITING" });
        });

        wb.register();
      })
      .catch(console.error);
  });
}

const config = { component: componentMap, layout: layoutMap };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContextBureau config={config}>
        <App />
        <InstallAppButton />
      </ContextBureau>
    </QueryClientProvider>
  </StrictMode>,
);
