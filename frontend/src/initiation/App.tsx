import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import React, { useMemo } from "react";
import { store } from "/@/initiation/store";
import { Provider } from "react-redux";
import { Sample } from "/@/initiation/components/auth/Sample.tsx";
import { ActionProvider, useXingineContext } from "xingine-react";

export function App() {
  return (
    <Provider store={store}>
      <AppWithRouter />
    </Provider>
  );
}

function AppWithRouter() {
  const { routes } = useXingineContext();

  const router = useMemo(() => {
    if (routes.length === 0) return null;
    return createBrowserRouter(routes);
  }, [routes]);

  return router ? <RouterProvider router={router} /> : <div>Loading...</div>;
}
