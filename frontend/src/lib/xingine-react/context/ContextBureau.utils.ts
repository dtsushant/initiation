import { RouteObject } from "react-router-dom";
import { LayoutRenderer } from "/@/lib/xingine-react/component/layout";
import { getModuleRegistryService } from "/@/lib/xingine-react/xingine-react.registry.ts";
import { ModuleProperties } from "@xingine";
import { XingineConfig } from "/@/lib/xingine-react/configuration/Configuration";
import React from "react";

export function mapDynamicRoutes(
  data: ModuleProperties[],
  config: XingineConfig, // You can strongly type this if available
): RouteObject[] {
  const routeGroups = data
    .map((module) => {
      const components = module.uiComponent || [];

      const groupedByLayout: Record<string, RouteObject[]> = {};

      components.forEach((comp: any) => {
        if (!comp?.path || !comp?.component) return;

        const element = getModuleRegistryService()?.get(
          comp.component,
          comp.meta?.properties,
        );

        if (!element) return;

        const layout = comp.layout || "default";
        if (!groupedByLayout[layout]) groupedByLayout[layout] = [];

        groupedByLayout[layout].push({
          path: comp.path,
          element,
        });
      });

      return groupedByLayout;
    })
    .filter(Boolean);

  // Merge grouped routes by layout
  const layoutRoutesMap: Record<string, RouteObject[]> = {};

  routeGroups.forEach((group) => {
    for (const layout in group) {
      if (!layoutRoutesMap[layout]) layoutRoutesMap[layout] = [];
      layoutRoutesMap[layout].push(...group[layout]);
    }
  });

  // Map final route objects
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
  console.log("the routest", routes);
  return routes;
}
