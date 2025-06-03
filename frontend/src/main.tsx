/*
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "/@/components/app/App.tsx";
import "react-toastify/dist/ReactToastify.css";
import "/@/styles/global.css";
import "/@/styles/antd.css";
import { bootstrapApp } from "/@/bootstrap.ts";

(async () => {
  await bootstrapApp();

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
})();
*/

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import virtual module for PWA registration
import { registerSW } from "virtual:pwa-register";

// Import contexts
/*import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";*/

// Import routes
/*import { routes } from "./routes";*/
/*import { ToastProvider } from "./contexts/ToastContext";*/
import { LayoutRenderer } from "/@/lib/xingine-react/component/layout";
import { ThemeProvider } from "antd-style";
import { Workbox } from "workbox-window";
import InstallAppButton from "/@/InstallAppButton.tsx";
import "./index.css";
import { ContextBureau } from "/@/lib/xingine-react/component/layout/context/ContextBureau.tsx";
import { App } from "/@/App.tsx";

// Create router
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LayoutRenderer />,
  },
];
const router = createBrowserRouter(routes);

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContextBureau>
        <App />
        <InstallAppButton />
      </ContextBureau>
    </QueryClientProvider>
  </StrictMode>,
);
