import React, { createContext, useState, useContext } from "react";

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
}

export const LayoutContext = createContext<LayoutProperty | null>(null);

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
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const layoutValue: LayoutProperty = {
    collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal: defaultPartySeal,
  };

  return (
    <LayoutContext.Provider value={layoutValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutProperty => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
