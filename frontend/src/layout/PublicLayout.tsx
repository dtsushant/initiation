import {
  Avatar,
  Input,
  Layout,
  Layout as AntdLayout,
  Menu,
  Skeleton,
} from "antd";
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
    <AntdLayout className="h-screen flex flex-col">
      <PublicHeader registeredComponents={registeredComponents} />
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Content className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <CollapsedProvider value={{ isCollapsed: false }}>
            <Outlet />
          </CollapsedProvider>
        </Content>
      </div>
      <PublicFooter />
    </AntdLayout>
  );
};
