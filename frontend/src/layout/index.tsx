import { Layout as AntdLayout } from "antd";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Main } from "/@/layout/components/Main";
import { Nav } from "/@/layout/components/Nav";

export function Layout() {
  const location = useLocation();

  /*if (location.pathname === "/") {
    return <Navigate replace to="/login" />;
  }*/

  return (
    <AntdLayout className="h-full">
      <Nav />
      <AntdLayout.Content className="overflow-auto scrollbar-hide">
        <Main />
      </AntdLayout.Content>
    </AntdLayout>
  );
}
