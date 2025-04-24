import { Layout as AntdLayout, Menu, Input, Avatar } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = AntdLayout;

export function PublicSpacePage() {
  return (
    <AntdLayout className="min-h-screen">
      {/* Header */}
      <Header className="flex items-center justify-between bg-white shadow-md px-6 z-50">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">Initiation</div>

          {/* Menu Items */}
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={[
              {
                key: "home",
                icon: <HomeOutlined />,
                label: "Home",
              },
              {
                key: "about",
                icon: <InfoCircleOutlined />,
                label: "About",
              },
              {
                key: "contact",
                icon: <MailOutlined />,
                label: "Contact",
              },
            ]}
            className="border-none"
          />
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

      {/* Main Layout */}
      <AntdLayout>
        {/* Body Content */}
        <Content className="p-8 bg-gray-50 flex-1">
          <h1 className="text-2xl font-semibold mb-4">
            Welcome to the Public Space
          </h1>
          <p className="text-gray-700">
            This is the main content area. Use this space to display important
            information, announcements, or public-facing features of your app.
          </p>
        </Content>
      </AntdLayout>

      {/* Footer */}
      <Footer className="bg-white text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Initiation — All rights reserved. |{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Contact Us
        </a>{" "}
        |{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>
      </Footer>
    </AntdLayout>
  );
}
