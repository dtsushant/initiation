import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import React, { useMemo } from "react";
import { store } from "/@/initiation/store";
import { Provider } from "react-redux";
import { Sample } from "/@/initiation/components/auth/Sample.tsx";
import { useXingineContext } from "xingine-react";

export function App() {
  const { routes, moduleProperties } = useXingineContext();

  const router = useMemo(() => {
    if (routes.length === 0) return null;
    const routeObjec: RouteObject = {
      path: "/sample",
      index: true,
      element: <Sample />,
    };

    routes.push(routeObjec);
    return createBrowserRouter(routes);
  }, [routes]);

  return (
    <Provider store={store}>
      {router && <RouterProvider router={router} />}
    </Provider>
  );
}
