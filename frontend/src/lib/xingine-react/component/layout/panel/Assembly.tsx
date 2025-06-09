import { Breadcrumb, Tabs } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import { Content } from "antd/lib/layout/layout";

const Assembly = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  return (
    <section className="p-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        {pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          return <Breadcrumb.Item key={url}>{_}</Breadcrumb.Item>;
        })}
      </Breadcrumb>

      <Content className="p-6">
        <Outlet />
      </Content>
    </section>
  );
};

export default Assembly;
