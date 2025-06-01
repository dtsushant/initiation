import React, { lazy, Suspense, useState } from "react";
import { LayoutMandate } from "@xingine";
import "./index.css";
import Sidebar from "/@/lib/xingine-react/component/layout/panel/Sidebar.tsx";
import {
  LayoutProvider,
  useLayoutContext,
} from "/@/lib/xingine-react/component/layout/context/LayoutContext.tsx";
import { Layout as AntdLayout } from "antd";
import { Nav } from "/@/layout/components/Nav.tsx";
import { Main } from "/@/layout/components/Main.tsx";

export const LayoutRenderer: React.FC<LayoutMandate> = (mandate) => {
  const { structure } = mandate;
  const {
    collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal,
  } = useLayoutContext();

  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuVisible((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const Header = lazy(() => import(`./panel/Presidium.tsx`));
  const Body = lazy(() => import(`./panel/Assembly.tsx`));
  const Footer = lazy(() => import(`./panel/Doctrine.tsx`));

  console.log("the mobile menu", mobileMenuVisible);
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <div
        className={`layout-root flex h-screen w-full ${darkMode ? "dark" : ""}`}
      >
        <div className="order-1 md:order-none">
          <Sidebar />
        </div>
        <div
          className={`
  flex flex-col flex-1
  // On mobile, no margin. On desktop, apply margin for sidebar.
  md:${collapsed ? "ml-16" : "ml-64"}
  transition-all duration-300
`}
        >
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <Body />
          </main>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};
