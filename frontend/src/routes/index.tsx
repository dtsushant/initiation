import React from "react";
import { DashboardOutlined } from "@ant-design/icons";
import { DashboardPage } from "../pages/dashboard";

import { getModuleRegistryService } from "/@/lib/xingine-react/xingine-react.registry.ts";
import { getAntdIcon } from "/@/utils/helper..ts";

const baseRoutes: RouteConfig[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
  },
];

export const routes = (): RouteConfig[] => {
  const allowedRoutes: RouteConfig[] = [];
  Object.entries(getModuleRegistryService()?.getAll()?.component ?? {}).forEach(
    ([key, value]) => {
      allowedRoutes.push({
        label: key,
        path: value.path,
        icon: <DashboardOutlined />,
        element: getModuleRegistryService()!.get(key, value.props),
      });
      // key = component name (string)
      // value = { name: string, path: string, fc: React.FC<unknown> }
    },
  );

  /*const allowedRoutes: RouteConfig[] = allowedModules.map((module) => {

    return {
      label: module.uiComponent!.component,
      path: module.uiComponent!.path,
      icon: getAntdIcon(module.uiComponent?.icon),
      element: getModuleRegistryService()!.get(module.uiComponent!.component),
    }
  });*/
  return [...baseRoutes, ...allowedRoutes];
};
