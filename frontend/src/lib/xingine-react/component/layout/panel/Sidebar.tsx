import React, { useCallback } from "react";
import { Layout, Menu, Button, Grid } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useXingineContext } from "/@/lib/xingine-react/component/layout/context/ContextBureau.tsx";
import { useLocation, useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;

const Sidebar: React.FC = () => {
  const { panelControl, moduleProperties, routes } = useXingineContext();
  const { collapsed, setCollapsed, darkMode, mobileMenuVisible } = panelControl;

  const toggleCollapse = () => setCollapsed((prev: boolean) => !prev);
  const screens = useBreakpoint();
  const isMobile = !screens.md; // Below md breakpoint
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuItems = moduleProperties!.flatMap((module, i) => {
    return module.uiComponent!.map((comp, j) => ({
      key: comp.path,
      icon: <LockOutlined />,
      label: comp.component,
    }));
  });

  const handleClick = useCallback(
    ({ key }: { key: string }) => {
      if (pathname !== key) {
        navigate(key);
      }
    },
    [navigate, pathname],
  );

  return (
    <Layout.Sider
      theme={darkMode ? "dark" : "light"}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="md"
      trigger={null} // We'll use our custom trigger button
      className={`
        top-0 left-0 h-full z-40
        transition-all duration-300
        bg-white dark:bg-gray-900
        
      `}
    >
      <div
        className={`
          absolute top-4 
          ${collapsed ? "right-[-20px]" : "right-[-16px]"}
           
          z-50
        `}
      >
        <Button
          shape="circle"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          className={`shadow-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
          }`}
        />
      </div>

      <Menu
        mode="inline"
        theme={darkMode ? "dark" : "light"}
        items={menuItems}
        className="flex-1"
        onClick={handleClick}
        inlineCollapsed={collapsed}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
