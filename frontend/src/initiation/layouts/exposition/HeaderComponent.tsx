import React, { useEffect, useMemo, useState } from "react";
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
import {
  ButtonMeta,
  ConditionalMeta,
  extrapolate,
  LayoutComponentDetail,
  SvgMeta,
  WrapperMeta,
} from "xingine";
import {
  bindMultipleEvents,
  getDefaultInternalComponents,
  IconRenderer,
  InputRenderer,
  SvgRenderer,
  toCSSClassName,
  useXingineContext,
  WrapperRenderer,
} from "xingine-react";
import {
  ButtonRenderer,
  ConditionalRenderer,
  InputWithIcon,
  MyCustomRenderer,
  RenderComponent,
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

export const HeaderComponent: React.FC<LayoutComponentDetail> = (meta) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);

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

  const scope = useMemo(
    () => ({
      handleSearch,
      handleHomeClick,
      handleToggleCollapsed,
      handleDarkMode,
      collapsed,
      darkMode,
      hasHeader,
      userDropdownOpen,
      setUserDropdownOpen: () => {
        setUserDropdownOpen((prev) => !prev);
      },
    }),
    [userDropdownOpen, darkMode, collapsed],
  );

  useEffect(() => {
    setHeaderActionContext((prev) => ({
      ...prev,
      ...scope,
    }));
  }, [scope]);

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

  const conditional: ConditionalMeta = {
    condition: {
      field: "headerActionContext.darkMode",
      operator: "eq",
      value: true,
    },
    trueComponent: {
      meta: {
        component: "SvgRenderer",
        properties: svgMeta,
      },
    },
    falseComponent: {
      meta: {
        component: "IconRenderer",
        properties: {
          name: "UserOutlined",
        },
      },
    },
  };

  const wrapperMeta: WrapperMeta = {
    component: "WrapperRenderer",
    meta: {
      children: [
        {
          component: "SvgRenderer",
          meta: {
            component: "SvgRenderer",
            properties: svgMeta,
          },
        },
      ],
    },
  };
  const wm: WrapperMeta = {
    content: "This is a wrapper renderer",
    children: [
      {
        meta: {
          component: "SvgRenderer",
          properties: svgMeta,
        },
      },
    ],
  };

  const lcd: LayoutComponentDetail = {
    meta: {
      component: "WrapperRenderer",
      properties: wm,
    },
  };
  const button: ButtonMeta = {
    name: "userProfile",
    style: {
      className:
        "flex items-center space-x-2 p-2 rounded-md transition-colors #{darkMode ? 'bg-gray-700':'bg-gray-100'}",
    },
    event: {
      onClick: "headerActionContext.setUserDropdownOpen",
    },
    content: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    U
                                                  </div>
                                                  <svg
                                                    class="w-4 h-4 transition-transform #{userDropdownOpen ? 'rotate-180' : ''}"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width='2'
                                                      d="M19 9l-7 7-7-7"
                                                    />
                                                  </svg>`,
  };
  /*console.info("the lcd", JSON.stringify(meta,null,2))
  console.info("the lcd that renders", JSON.stringify(lcd,null,2))*/
  /*
  console.info("the wrapperMeta", JSON.stringify(wrapperMeta,null,2))
*/

  return (
    <>
      {/*{meta.children
        ?.filter((child) => !!child.meta)
        .map((child, index) => {
          //  const Comp = compMap[child.meta!.component];

          return <RenderComponent {...child} key={index} />;
        })}*/}
      {/*
      <RenderComponent {...lcd} />
*/}
      <RenderComponent {...meta} />
      {/*<ButtonRenderer {...button}/>*/}

      {/*
      <div>{extrapolate("h-16 px-4 flex items-center #{headerActionContext.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} justify-between",panelControl)}</div>
*/}

      {/*
      <MyCustomRenderer className="h-16 px-4 flex items-center justify-between #{darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}" content="This is a custom renderer" />
*/}
      {/*<ConditionalRenderer {...conditional}/>*/}

      {/*<WrapperRenderer {...meta.properties}/>*/}
      {/* <WrapperRenderer {...wm}/>*/}
      {/*<WrapperRenderer {...{
        content:"This is a wrapper renderer",
        children:[{
            component:"SvgRenderer",
            meta:{
                component:"SvgRenderer",
                properties:svgMeta
            }
        }]
      }} />*/}

      {/*<div>{extrapolate(" this is extrapolated string darkMode her is #{userDropdownOpen} te value",headerActionContext)}</div>*/}
      {/*<Button onClick={scope.setUserDropdownOpen}>Click me</Button>
      <ConditionalRenderer {...conditional}/>*/}
      {/*{userDropdownOpen && <div>this is shown or hidden</div>}*/}

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
    </>
  );
};

export default HeaderComponent;
