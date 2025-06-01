import React, { lazy, Suspense, useState } from "react";
import { LayoutMandate } from "@xingine";
import "./index.css";
import {
  FileTextOutlined,
  HomeOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const LayoutRenderer: React.FC<LayoutMandate> = (mandate) => {
  const { structure } = mandate;
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);

  const [mobileMenuVisible, setMobileMenuVisible] = useState(
    () => window.innerWidth < 768,
  );

  const toggleCollapse = () => setCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuVisible((prev) => !prev);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "2", icon: <FileTextOutlined />, label: "Reports" },
    { key: "3", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "4", icon: <TeamOutlined />, label: "Users" },
    { key: "5", icon: <SettingOutlined />, label: "Settings" },
    { key: "6", icon: <LockOutlined />, label: "Security" },
  ];
  const Header = lazy(() => import(`./panel/Presidium.tsx`));
  const Body = lazy(() => import(`./panel/Assembly.tsx`));
  const Footer = lazy(() => import(`./panel/Doctrine.tsx`));

  console.log("the mobile menu", mobileMenuVisible);
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <div
        className={`layout-root ${collapsed ? "collapsed" : ""} ${darkMode ? "dark" : ""}`}
      >
        <aside
          className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileMenuVisible ? "mobile-visible" : ""} ${darkMode ? "dark" : ""}`}
        >
          <button className={`collapse-toggle `} onClick={toggleCollapse}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="menu">
            {menuItems.map((item, idx) => (
              <div key={idx} className="menu-item" title={item.label}>
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && <span className="menu-label">{item.label}</span>}
              </div>
            ))}
          </div>
        </aside>
        <div className="layout-content">
          <Suspense fallback={<div>Loading section...</div>}>
            <Header
              onToggleMenu={toggleMobileMenu}
              setDarkMode={setDarkMode}
              darkMode={darkMode}
            />
            <main className="layout-body">
              <Body />
            </main>
            <Footer />
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
};
