import React, { useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Button,
  Input,
  Badge,
  Switch,
  Dropdown,
  Avatar,
  Grid,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { LayoutComponentDetail, SvgMeta, WrapperMeta } from "xingine";
import {
  bindMultipleEvents,
  getDefaultInternalComponents,
  IconRenderer,
  InputRenderer,
  RenderComponent,
  SvgRenderer,
  useXingineContext,
} from "xingine-react";
import {
  ButtonRenderer,
  InputWithIcon,
} from "/@/initiation/layouts/custom/Component.utils.tsx";
import {
  buttonMeta,
  buttonMeta2,
  buttonMeta3,
} from "/@/initiation/layouts/custom/example.ts";

const { Search } = Input;
const { useBreakpoint } = Grid;

// Serializable onClick actions
interface SerializableAction {
  type: "toggle" | "navigate" | "search" | "menu-action";
  target?: string;
  value?: any;
}

export interface HeaderComponentProps {
  renderer?: LayoutComponentDetail;
  menuItems?: LayoutComponentDetail[];
}

// Hook to detect very small screens (below 508px)
const useVerySmallScreen = () => {
  const [isVerySmall, setIsVerySmall] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmall(window.innerWidth < 508);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isVerySmall;
};

export const HeaderComponent: React.FC<WrapperMeta> = (meta) => {
  const { panelControl, menuItems } = useXingineContext();

  const {
    collapsed,
    darkMode,
    setCollapsed,
    setDarkMode,
    setHeaderActionContext,
    headerActionContext,
  } = panelControl;
  const isVerySmallScreen = useVerySmallScreen();

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => handleAction({ type: "menu-action", target: "profile" }),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => handleAction({ type: "menu-action", target: "settings" }),
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => handleAction({ type: "menu-action", target: "logout" }),
    },
  ];

  const handleAction = (action: SerializableAction) => {
    switch (action.type) {
      case "toggle":
        console.info("the side bar", collapsed);
        if (action.target === "sidebar") {
          setCollapsed(!collapsed);
        }
        break;
      case "navigate":
        if (action.target === "home") {
          // Navigate to home - could use router here
          console.log("Navigate to home");
        }
        break;
      case "search":
        console.log("Search:", action.value);
        break;
      case "menu-action":
        console.log("Menu action:", action.target);
        break;
    }
  };

  const handleSearch = (value: string) => {
    handleAction({ type: "search", value });
  };

  const handleHomeClick = () => {
    handleAction({ type: "navigate", target: "home" });
  };

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => {
      return !prev;
    });
  };
  const handleDarkMode = () => {
    setDarkMode((prev) => {
      return !prev;
    });
  };

  const scope = {
    handleSearch,
    handleHomeClick,
    handleToggleCollapsed,
    handleDarkMode,
  };

  useEffect(() => {
    setHeaderActionContext(scope);
  }, []);

  const svgMeta: SvgMeta = {
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  `,
    style: {
      className: "inline-block align-middle",
      style: { marginLeft: "0.5rem" },
    },
    title: "Hamburger menu",
    alt: "Menu icon",
  };

  return (
    <>
      {meta.children
        ?.filter((child) => !!child.meta)
        .map((child, index) => {
          //  const Comp = compMap[child.meta!.component];

          return <RenderComponent {...child} key={index} />;
        })}
      {/*<SvgRenderer {...svgMeta} />*/}
      {/*<IconRenderer {...{svg:svgMeta}}/>*/}
      {/*<IconRenderer {...{name:'SearchOutlined'}}/>*/}
      {/*<InputRenderer {...{name:'somename', placeholder:'MyPlaceholder',icon:{svg:svgMeta}}}/>*/}
      {/* <InputWithIcon />*/}
      {/*<button
                onClick={handleToggleCollapsed}
                className={`p-2 rounded-md hover:${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } transition-colors`}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>*/}
      {/*<div style={{
        padding: '0 16px',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
    }}>
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
    <Col>
        <Space>
            <Button
                type="text"
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={handleToggleCollapsed}
    />
    <Button
    type="text"
    icon={<HomeOutlined />}
    onClick={handleHomeClick}
    />
    </Space>
    </Col>
     Hide search on very small screens to save space
    {!isVerySmallScreen && (
        <Col flex="auto" style={{ maxWidth: 400, margin: '0 16px' }}>
        <Search
            placeholder="Search..."
        allowClear
        enterButton={<SearchOutlined />}
        onSearch={handleSearch}
        />
        </Col>
    )}
    <Col>
        <Space>
            <Badge count={5}>
    <Button type="text" icon={<BellOutlined />} />
    </Badge>
    <Switch
    checkedChildren={<BulbOutlined />}
    unCheckedChildren={<BulbOutlined />}
    checked={darkMode}
    onChange={setDarkMode}
    />
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
    <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
    </Dropdown>
    </Space>
    </Col>
    </Row>
    </div>*/}
    </>
  );
};

export default HeaderComponent;
