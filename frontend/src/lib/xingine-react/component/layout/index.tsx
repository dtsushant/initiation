import React, { lazy, Suspense, useState } from "react";
import { LayoutMandate } from "@xingine";
import "./index.css";
import Sidebar from "/@/lib/xingine-react/component/layout/panel/Sidebar.tsx";

import { Grid, Layout as AntdLayout } from "antd";
import { useXingineContext } from "/src/lib/xingine-react/context/ContextBureau.tsx";
import { Navigate, RouteObject } from "react-router-dom";

export const LayoutRenderer: React.FC<LayoutMandate> = () => {
  const { panelControl, moduleProperties } = useXingineContext();

  const {
    collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal,
  } = panelControl;

  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuVisible((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const Header = lazy(() => import(`./panel/Presidium.tsx`));
  const Body = lazy(() => import(`./panel/Assembly.tsx`));
  const Footer = lazy(() => import(`./panel/Doctrine.tsx`));

  const { useBreakpoint } = Grid;

  const screens = useBreakpoint();
  const isMobile = !screens.md; // Below md breakpoint

  const expandedWidth = isMobile ? 240 : 250;
  const collapsedWidth = 112;
  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <div
        className={`relative h-screen overflow-hidden ${darkMode ? "dark" : ""}`}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[${sidebarWidth}px]  ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-gray-300"
              : "bg-white border-gray-200 text-gray-600"
          }
                   p-4 z-40 transition-all duration-300`}
        >
          <Sidebar />
        </div>

        <div
          className="absolute top-0 bottom-0 right-0 flex flex-col"
          style={{ left: `${sidebarWidth}px` }}
        >
          <div
            className={`
          ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-gray-300"
              : "bg-white border-gray-200 text-gray-600"
          }
          order-last md:order-first 
          h-16
          max-h-screen 
          overflow-y-auto md:overflow-visible 
          px-4 sm:px-8 md:px-4 
          py-2
          w-full 
          z-30 
          flex items-center justify-between flex-wrap
          shadow
          ${isMobile ? "order-last" : "md:order-first"} 
          ${isMobile ? "fixed bottom-0 left-0 right-0" : "md:relative md:top-auto"} 
        `}
          >
            <Header />
          </div>

          <div
            className={`flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4
          ${!isMobile ? "mt-16" : ""} 
          ${isMobile ? "pb-16" : ""}  
        `}
          >
            <Body />
          </div>

          <div
            className={`fixed ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-300"
                : "bg-white border-gray-200 text-gray-600"
            } bottom-0 right-0  p-4 z-10 overflow-auto hidden lg:flex`}
            style={{ left: `${sidebarWidth}px` }}
          >
            <Footer />
          </div>
        </div>
      </div>
    </Suspense>
  );
};
