import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useMemo } from "react";
import { useXingineContext } from "xingine-react";
import { store } from "/@/initiation/store";
import { Provider } from "react-redux";

export function App() {
  const { routes, moduleProperties } = useXingineContext();

  const router = useMemo(() => {
    if (routes.length === 0) return null;
    return createBrowserRouter(routes);
  }, [routes]);

  return (
    <Provider store={store}>
      {router && <RouterProvider router={router} />}
    </Provider>
  );
}
