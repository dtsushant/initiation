import React, { useState } from "react";
import { Menu } from "antd";
import { useXingineContext } from "xingine-react";
import { IconMeta } from "xingine";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";

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
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { panelControl } = useXingineContext();
  const { collapsed } = panelControl;

  const defaultMenuItems = meta.menuItems?.map((item) => ({
    ...item,
    icon: item.icon && <IconRenderer {...item.icon} />,
  }));

  return (
    <Menu mode="inline" inlineCollapsed={collapsed} items={defaultMenuItems} />
  );
};
