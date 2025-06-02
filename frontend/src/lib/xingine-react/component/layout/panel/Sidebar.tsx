import React from "react";
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

const { useBreakpoint } = Grid;

const Sidebar: React.FC = () => {
  const { collapsed, setCollapsed, darkMode, mobileMenuVisible } =
    useXingineContext();

  const toggleCollapse = () => setCollapsed((prev: boolean) => !prev);
  const screens = useBreakpoint();
  const isMobile = !screens.md; // Below md breakpoint
  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "2", icon: <FileTextOutlined />, label: "Reports" },
    { key: "3", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "4", icon: <TeamOutlined />, label: "Users" },
    { key: "5", icon: <SettingOutlined />, label: "Settings" },
    { key: "6", icon: <LockOutlined />, label: "Security" },
  ];

  const expandedWidth = isMobile ? 240 : 258;
  const collapsedWidth = isMobile ? 40 : 90;
  /* className={`
    bg-white dark:bg-gray-900
    w-full md:w-64
    h-14 md:h-auto
    z-30
    flex-shrink-0
    shadow md:shadow-none
    px-4 py-2
  `}*/
  return (
    /*<aside
          className={`
  fixed top-0 left-0 h-full z-40
  md:block ${collapsed ? 'md:w-20' : 'md:w-64'} // Show on MD, control width
  bg-white dark:bg-gray-900
  transition-all duration-300
`}
      >*/
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
        inlineCollapsed={collapsed}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
