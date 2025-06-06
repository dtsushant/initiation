import React, { createContext, useState, useContext, useEffect } from "react";
import { ModuleProperties, modulePropertiesListDecoder } from "@xingine";
import { RouteObject } from "react-router-dom";
import {
  get,
  registerModule,
} from "/src/lib/xingine-react/xingine-react.service.ts";
import { getModuleRegistryService } from "/src/lib/xingine-react/xingine-react.registry.ts";
import { LayoutRenderer } from "/src/lib/xingine-react/component/layout";
import { XingineConfig } from "/src/lib/xingine-react/configuration/Configuration";
import { mapDynamicRoutes } from "/@/lib/xingine-react/context/ContextBureau.utils.ts";

export interface ColorPalette {
  [key: string]: string;
}

export interface PartySeal {
  emblemUrl: string;
  motto: string;
  colorPalette: ColorPalette;
  issuedBy: string;
}

export interface PanelControlBureau {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuVisible: boolean;
  setMobileMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  partySeal: PartySeal;
  layoutLoading: boolean;
}

export interface UIMandate {
  panelControl: PanelControlBureau;
  moduleProperties?: ModuleProperties[];
  routes: RouteObject[];
}

export const XingineContext = createContext<UIMandate | null>(null);

const defaultColorPalette: ColorPalette = {
  primary: "#6f42c1",
  secondary: "#fd7e14",
  background: "#f8f9fa",
  surface: "#ffffff",
  accent: "#17a2b8",
};

const defaultPartySeal: PartySeal = {
  emblemUrl: "/assets/default-emblem.svg",
  motto: "Unity, Integrity, Progress",
  colorPalette: defaultColorPalette,
  issuedBy: "Commissar Authority",
};

export const ContextBureau: React.FC<{
  children: React.ReactNode;
  config: XingineConfig;
}> = ({ children, config }) => {
  const [moduleProperties, setModuleProperties] = useState<
    ModuleProperties[] | undefined
  >(undefined);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [layoutError, setLayoutError] = useState<Error | null>(null);
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Fetch component definitions (and potentially derive partySeal)
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setIsLoadingLayout(true);
        setLayoutError(null); // Clear previous errors

        const data = await get<ModuleProperties[]>(
          modulePropertiesListDecoder,
          "modules",
        );
        setModuleProperties(data);
        if (!getModuleRegistryService() && data) {
          registerModule(config, data!);
        }

        const routePaths = data!.flatMap((module) =>
          module.uiComponent?.map((comp) => ({
            path: comp.path,
            element: getModuleRegistryService()?.get(
              comp.component,
              comp.meta?.properties,
            ),
          })),
        );
        //const r = routePaths.filter((rp) => rp !== undefined);
        //setRoutes([{ path: "/", element: <LayoutRenderer />, children: r }]);
        setRoutes(mapDynamicRoutes(data, config));
      } catch (err) {
        console.error("Failed to fetch module properties for layout:", err);
        setLayoutError(
          err instanceof Error
            ? err
            : new Error("An unknown error occurred during layout data fetch."),
        );
      } finally {
        setIsLoadingLayout(false);
      }
    };

    fetchModuleData();
  }, []); // Run only once on mount

  const panelControlBureau: PanelControlBureau = {
    collapsed: collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal: defaultPartySeal,
    layoutLoading: isLoadingLayout,
  };

  const mandate: UIMandate = {
    panelControl: panelControlBureau,
    moduleProperties: moduleProperties,
    routes: routes,
  };

  if (isLoadingLayout) {
    return <div>Loading layout...</div>; // Or a more sophisticated spinner
  }

  if (layoutError) {
    return <div>Error loading layout: {layoutError.message}</div>; // Display error
  }

  return (
    <XingineContext.Provider value={mandate}>
      {children}
    </XingineContext.Provider>
  );
};

export const useXingineContext = (): UIMandate => {
  const context = useContext(XingineContext);
  if (!context) {
    throw new Error("useXingineContext must be used within a XingineContext");
  }
  return context;
};
