import React from "react";
import { LayoutComponentDetail } from "xingine";
import { Outlet } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";

export const ContentComponent: React.FC<LayoutComponentDetail> = (meta) => {
  return (
    <Content className="p-6">
      <Outlet />
    </Content>
  );
};
