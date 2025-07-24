import React, { useState } from "react";
import { Menu, MenuProps } from "antd";
import { useSharedState } from "xingine-react";
import { IconMeta } from "xingine";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";
import { useLocation, useNavigate } from "react-router-dom";

export interface MenuItems {
  key: string;
  label: string;
  icon?: IconMeta;
  path?: string;
  children?: MenuItems[];
}
export interface MenuMeta {
  menuItems?: MenuItems[];
  loadFromHeader?: boolean;
}

export const MenuRenderer: React.FC<MenuMeta> = (meta) => {
  const collapsed = useSharedState<boolean>("collapsed");
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Detects current path

  const defaultMenuItems = (menus: MenuItems[]): MenuProps["items"] =>
    menus.map(({ key, label, icon, path, children }) => ({
      key: path || key, // Ensure path is the click key
      label,
      icon: icon ? <IconRenderer {...icon} /> : undefined,
      children: children ? defaultMenuItems(children) : undefined,
    }));

  const handleClick = ({ key }: { key: string }) => {
    navigate(key); // key = path
  };

  console.info(
    "the default menu items",
    meta.menuItems,
    defaultMenuItems(meta.menuItems!),
  );
  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      inlineCollapsed={collapsed}
      items={defaultMenuItems(meta.menuItems!)}
      onClick={handleClick}
    />
  );
};
