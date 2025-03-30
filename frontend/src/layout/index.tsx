import { Layout as AntdLayout } from 'antd';
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Main } from '/@/layout/components/Main';
import { Nav } from '/@/layout/components/Nav';

export function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  if (location.pathname === '/') {
    return <Navigate replace to="/login" />;
  }

  return (
    <AntdLayout className="h-full">
      <Nav onCollapse={handleCollapse} />
      <AntdLayout.Content className="overflow-auto scrollbar-hide">
        <Main collapsed={collapsed} />
      </AntdLayout.Content>
    </AntdLayout>
  );
}
