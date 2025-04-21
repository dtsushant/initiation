import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "/@/components/app/App.tsx";
import "react-toastify/dist/ReactToastify.css";
import "/@/styles/global.css";
import "/@/styles/antd.css";
import { bootstrapApp } from "/@/bootstrap.ts";

(async () => {
  console.log("here here here");
  await bootstrapApp();

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
})();
