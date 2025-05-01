import { Avatar, Input, Layout as AntdLayout, Menu } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";
import { UIComponent } from "@xingine";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = AntdLayout;

export const PublicHeader: React.FC<UIComponent[unknown]> = ({
  registeredComponents,
}) => {
  const menuItems = useMemo(
    () =>
      registeredComponents.map((comp) => ({
        key: comp.path,
        icon: <HomeOutlined />,
        label: comp.component,
        path: comp.path,
      })),
    [],
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClick = (path) => {
    const { key } = path;
    if (pathname !== key) {
      navigate(key);
    }
  };

  return (
    <Header className="flex items-center justify-between bg-white shadow-md px-6 z-50">
      <div className="flex items-center gap-6 min-w-0 flex-1">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">Initiation</div>

        {/* Menu Items */}
        <div className="flex-1 min-w-0">
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={[...menuItems]}
            className="border-none"
            onClick={handleClick}
          />
        </div>
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="w-64"
        />
        <Avatar size="large" icon={<UserOutlined />} />
      </div>
    </Header>
  );
};
