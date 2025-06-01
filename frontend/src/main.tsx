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
import { LayoutProvider } from "/@/lib/xingine-react/component/layout/context/LayoutContext.tsx";

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

/*void registerSW({
    onNeedRefresh() {
        console.log('New content available, please refresh.');
        // You can implement a UI here to ask the user to refresh
    },
    onOfflineReady() {
        console.log('App ready to work offline');
        // You can show a notification that the app is ready for offline use
    },
    onRegistered(registration) {
        console.log('Service worker has been registered:', registration);

        // Add a manual install button for testing
        if (window.matchMedia('(display-mode: browser)').matches) {
            console.log('App is running in browser and might be installable');

            // Create install button - initially hidden
            const installButton = document.createElement('button');
            installButton.innerText = 'Install App';
            installButton.style.position = 'fixed';
            installButton.style.bottom = '20px';
            installButton.style.right = '20px';
            installButton.style.zIndex = '9999';
            installButton.style.padding = '10px 15px';
            installButton.style.backgroundColor = '#2E5BFF';
            installButton.style.color = 'white';
            installButton.style.border = 'none';
            installButton.style.borderRadius = '5px';
            installButton.style.cursor = 'pointer';
            installButton.style.display = 'none'; // Initially hidden

            // Add button to DOM
            document.body.appendChild(installButton);

            // Handle installation manually
            let deferredPrompt: BeforeInstallPromptEvent | null = null;

            window.addEventListener('beforeinstallprompt', (e: Event) => {
                // Prevent Chrome from automatically showing the prompt
                e.preventDefault();

                // Stash the event so it can be triggered later
                deferredPrompt = e as BeforeInstallPromptEvent;
                console.log('Install prompt available! 🎉');

                // Only show button when prompt is available
                installButton.style.display = 'block';
            });

            installButton.addEventListener('click', async () => {
                if (!deferredPrompt) {
                    console.log('No installation prompt available');
                    alert('This app is either already installed or cannot be installed on this device/browser.');
                    return;
                }

                // Show the install prompt
                deferredPrompt.prompt();

                try {
                    // Wait for the user to respond to the prompt
                    const choiceResult = await deferredPrompt.userChoice;

                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }

                    // Clear the saved prompt since it can't be used again
                    deferredPrompt = null;

                    // Hide the install button
                    installButton.style.display = 'none';
                } catch (error) {
                    console.error('Error with installation: ', error);
                }
            });
        }
    },
    onRegisterError(error) {
        console.error('Service worker registration failed:', error);
    },
});*/

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
      <LayoutProvider>
        <RouterProvider router={router} />
        <InstallAppButton />
      </LayoutProvider>
    </QueryClientProvider>
  </StrictMode>,
);
