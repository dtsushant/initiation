import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { useXingineContext } from "xingine-react";
import { store } from "/@/initiation/store";
import { Provider } from "react-redux";

export function App() {
  const { routes, moduleProperties } = useXingineContext();

  return (
    <Provider store={store}>
      {routes.length > 0 && (
        <RouterProvider router={createBrowserRouter(routes)} />
      )}
    </Provider>
  );
}
