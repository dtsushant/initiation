import React, { createContext, useState, useContext, useEffect } from "react";
import { get } from "/@/services/initiation.service.ts";
import { ModuleProperties, modulePropertiesListDecoder } from "@xingine"; // Assuming correct paths

export interface ColorPalette {
  [key: string]: string;
}

export interface PartySeal {
  emblemUrl: string;
  motto: string;
  colorPalette: ColorPalette;
  issuedBy: string;
}

export interface LayoutProperty {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuVisible: boolean;
  setMobileMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  partySeal: PartySeal;
  layoutLoading: boolean;
}

export const XingineContext = createContext<LayoutProperty | null>(null);

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

export const ContextBureau: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [moduleProperties, setModuleProperties] = useState<
    ModuleProperties[] | null
  >(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [layoutError, setLayoutError] = useState<Error | null>(null);

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
        console.log("the retrievedData", data);
        setModuleProperties(data);
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

  const layoutValue: LayoutProperty = {
    collapsed: collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal: defaultPartySeal,
    layoutLoading: isLoadingLayout,
  };

  // You might want to render a loading state here if the layout depends on `componentDefinitions`
  if (isLoadingLayout) {
    return <div>Loading layout...</div>; // Or a more sophisticated spinner
  }

  if (layoutError) {
    return <div>Error loading layout: {layoutError.message}</div>; // Display error
  }

  return (
    <XingineContext.Provider value={layoutValue}>
      {children}
    </XingineContext.Provider>
  );
};

export const useXingineContext = (): LayoutProperty => {
  const context = useContext(XingineContext);
  if (!context) {
    throw new Error("useXingineContext must be used within a XingineContext");
  }
  return context;
};
