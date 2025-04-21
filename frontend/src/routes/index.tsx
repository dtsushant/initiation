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
  const allowedModules =
    getModuleRegistryService()?.getAll()?.modulePropertyOptions ?? [];
  const allowedRoutes: RouteConfig[] = allowedModules.map((module) => ({
    label: module.uiComponent!.component,
    path: module.uiComponent!.path,
    icon: getAntdIcon(module.uiComponent?.icon),
    element: getModuleRegistryService()!.get(module.uiComponent!.component),
  }));
  return [...baseRoutes, ...allowedRoutes];
};
