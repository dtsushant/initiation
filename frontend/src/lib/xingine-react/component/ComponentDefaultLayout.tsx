import { Layout } from "antd";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { getBreadcrumbs } from "/@/lib/xingine-react/component/utils/Component.utils.ts";
import React from "react";

const { Header, Content, Footer } = Layout;

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <Layout>
      <Header>Header</Header>
      {/*<Breadcrumb style={{ margin: '16px' }}>
                {breadcrumbs.map((crumb) => (
                    <Breadcrumb.Item key={crumb.path}>{crumb.title}</Breadcrumb.Item>
                ))}
            </Breadcrumb>*/}
      <Content style={{ margin: "24px 16px 0" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>Dynamic App Footer</Footer>
    </Layout>
  );
};
