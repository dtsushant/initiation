import React, { lazy, Suspense, useState } from "react";
import { LayoutMandate } from "@xingine";
import "./index.css";
import Sidebar from "/@/lib/xingine-react/component/layout/panel/Sidebar.tsx";
import {
  LayoutProvider,
  useLayoutContext,
} from "/@/lib/xingine-react/component/layout/context/LayoutContext.tsx";

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
        className={`layout-root ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : ""}`}
      >
        <div className="order-1 md:order-none">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 relative">
          <Header />
          <main className="flex-1 overflow-auto px-4 pt-4 pb-14 md:pb-0 mt-14 md:mt-0">
            <Body />
          </main>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
};
