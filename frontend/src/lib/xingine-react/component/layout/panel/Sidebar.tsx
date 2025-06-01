import React from "react";
import { Menu, Button } from "antd";
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
import { useLayoutContext } from "../context/LayoutContext";

const Sidebar: React.FC = () => {
  const { collapsed, setCollapsed, darkMode } = useLayoutContext();

  const toggleCollapse = () => setCollapsed((prev: boolean) => !prev);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "2", icon: <FileTextOutlined />, label: "Reports" },
    { key: "3", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "4", icon: <TeamOutlined />, label: "Users" },
    { key: "5", icon: <SettingOutlined />, label: "Settings" },
    { key: "6", icon: <LockOutlined />, label: "Security" },
  ];
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
    <aside
      className={`h-full w-full flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } ${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg relative`}
    >
      <div
        className={`
      absolute top-4 z-50 
      -right-4 md:-right-5
      transform translate-y-0
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
        className="flex-1 pt-12"
        inlineCollapsed={collapsed}
      />
    </aside>
  );
};

export default Sidebar;
