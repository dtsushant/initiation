import { Avatar, Input, Layout as AntdLayout, Menu, Skeleton } from "antd";
import {
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import React from "react";
import { CollapsedProvider } from "/@/context/CollapsedContext.tsx";
import { PublicHeader } from "/@/layout/public/PublicHeader.tsx";
import { PublicFooter } from "/@/layout/public/PublicFooter.tsx";
import { UIComponent } from "@xingine";

const { Header, Sider, Content, Footer } = AntdLayout;

export const PublicLayout: React.FC<UIComponent[unknown]> = ({
  registeredComponents,
}) => {
  return (
    <AntdLayout className="min-h-screen">
      {/* Header */}
      <PublicHeader registeredComponents={registeredComponents} />

      {/* Main Layout */}
      <AntdLayout>
        <CollapsedProvider value={{ isCollapsed: false }}>
          {/* Body Content */}
          <Content className="p-8 bg-gray-50 flex-1">
            <Outlet />
          </Content>
        </CollapsedProvider>
      </AntdLayout>

      <PublicFooter />
    </AntdLayout>
  );
};
