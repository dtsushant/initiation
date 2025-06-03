import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { useXingineContext } from "/@/lib/xingine-react/component/layout/context/ContextBureau.tsx";
import { routes } from "/@/main.tsx";

export function App() {
  const { routes, moduleProperties } = useXingineContext();
  console.log("the routes", routes);
  console.log("the mod props", moduleProperties);
  return (
    routes.length > 0 && <RouterProvider router={createBrowserRouter(routes)} />
  );
}
