import React from "react";
import { RouteObject } from "react-router-dom";
import ModuleProperties from "xingine";
import { XingineConfig } from "/@/lib/xingine-react/configuration/Configuration";
import { getModuleRegistryService } from "/@/lib/xingine-react/xingine-react.registry.ts";
import { LayoutRenderer } from "/@/lib/xingine-react/component/layout";
import { ModuleHome } from "/@/lib/xingine-react/component/layout/panel/ModuleHome.tsx";

export function mapDynamicRoutes(
  data: ModuleProperties[],
  config: XingineConfig,
): RouteObject[] {
  const layoutRoutesMap: Record<string, RouteObject[]> = {};

  layoutRoutesMap["default"] = [];

  for (const module of data) {
    const components = module.uiComponent || [];

    layoutRoutesMap["default"].push({
      path: module.name,
      element: React.createElement(ModuleHome, module),
    });

    for (const comp of components) {
      if (!comp?.path || !comp?.component) continue;

      const element = getModuleRegistryService()?.get(
        comp.component,
        comp.meta?.properties,
      );
      if (!element) continue;

      const layoutKey = comp.layout || "default";

      if (!layoutRoutesMap[layoutKey]) layoutRoutesMap[layoutKey] = [];

      layoutRoutesMap[layoutKey].push({
        path: comp.path,
        element,
      });
    }
  }

  const routes: RouteObject[] = Object.entries(layoutRoutesMap).map(
    ([layoutName, children]) => {
      const Layout: React.FC =
        layoutName === "default"
          ? LayoutRenderer
          : (config.layout?.[layoutName] as React.FC) || LayoutRenderer;

      return {
        path: "/",
        element: React.createElement(Layout),
        children,
      };
    },
  );
  console.log("the routes", routes);
  return routes;
}
