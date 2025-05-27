import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { CollapsedProvider } from '/@/context/CollapsedContext';

const { Content } = Layout;

export const Main: React.FC<MainProps> = ({ collapsed }) => {
  return (
    <Layout className="min-h-screen">
      <CollapsedProvider value={{ isCollapsed: collapsed }}>
        <Content className="p-6">
          <Outlet />
        </Content>
      </CollapsedProvider>
    </Layout>
  );
};
Main.displayName = 'Main';
