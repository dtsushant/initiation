import React, { useEffect, useMemo, useState } from "react";
import {
  ActionContext,
  ConditionalMeta,
  EventBindings,
  extrapolate,
  LayoutComponentDetail,
  runAction,
  SerializableAction,
  SiderMeta,
  StyleMeta,
  WrapperMeta,
} from "xingine";
import {
  bindMultipleEvents,
  ConditionalRenderer,
  DangerousRenderer,
  getAllComponentMap,
  getDefaultInternalComponents,
  RenderComponent,
  toCSSClassName,
  toCSSProperties,
  useXingineContext,
} from "xingine-react";
import { SiderRenderer } from "/@/initiation/components/SiderRenderer.tsx";

export const SiderComponent: React.FC<LayoutComponentDetail> = (meta) => {
  console.info("the meta here is", meta);
  return (
    <>
      {/*<CleanSider />*/}
      <RenderComponent {...meta} />
    </>
  );
};

export const NotCleanSider: React.FC<LayoutComponentDetail> = (meta) => {
  const { panelControl, menuItems } = useXingineContext();
  const {
    collapsed,
    darkMode,
    setCollapsed,
    setDarkMode,
    setHeaderActionContext,
    headerActionContext,
  } = panelControl;

  const sAction: SerializableAction = {
    action: "setState",
    args: { key: "user", value: "Alice" },
  };

  const gAction: SerializableAction = {
    action: "getState",
    args: { key: "user", value: "Alice" },
  };

  console.info("the meta", meta);
  return (
    <>
      {/*<ConditionalRenderer {...conditionalLogo}/>*/}
      {/*<SiderRenderer {...siderRenderer}/>*/}
      <RenderComponent {...meta} />
      {/*<CleanSider />*/}
    </>
  );
};

export const CleanSider = () => {
  const { panelControl, menuItems } = useXingineContext();

  const {
    collapsed,
    darkMode,
    setCollapsed,
    setDarkMode,
    setHeaderActionContext,
    headerActionContext,
  } = panelControl;
  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-200 mt-16 ${collapsed ? "w-20 overflow-hidden" : "w-52"} ${
        darkMode
          ? "bg-gray-800 border-r border-gray-700"
          : "bg-white border-r border-gray-200"
      }`}
    >
      <TailwindSidebarComponent
        renderer={{}}
        panelControl={panelControl}
        menuItems={menuItems}
      />
    </aside>
  );
};
interface TailwindSidebarComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: any;
  menuItems: any[];
}
export const TailwindSidebarComponent: React.FC<
  TailwindSidebarComponentProps
> = ({ renderer, panelControl, menuItems }) => {
  const { darkMode, collapsed } = panelControl;
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Default menu items if not provided
  const defaultMenuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      path: "/dashboard",
    },
    {
      key: "users",
      label: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      children: [
        { key: "user-list", label: "User List", path: "/users/list" },
        { key: "user-create", label: "Create User", path: "/users/create" },
        { key: "user-analytics", label: "Analytics", path: "/users/analytics" },
      ],
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      path: "/analytics",
    },
    {
      key: "settings",
      label: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      path: "/settings",
    },
  ];

  const renderMenuItems = (items: any[]) => {
    return items.map((item) => (
      <div key={item.key} className="mb-1">
        <button
          onClick={() => (item.children ? toggleMenu(item.key) : undefined)}
          className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm rounded-lg transition-colors ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {!collapsed && item.children && (
            <svg
              className={`w-4 h-4 transition-transform ${
                expandedMenus[item.key] ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>

        {/* Submenu */}
        {!collapsed && item.children && expandedMenus[item.key] && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child: any) => (
              <a
                key={child.key}
                href={child.path}
                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`h-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* Logo/Brand */}
      {!collapsed && (
        <div className="mb-8 px-4">
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Xingine
          </h2>
        </div>
      )}

      {/* Menu Items */}
      <nav className="space-y-1">
        {renderMenuItems(menuItems.length > 0 ? menuItems : defaultMenuItems)}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={panelControl.toggleSidebar}
          className={`w-full flex items-center justify-center px-4 py-2 text-sm rounded-lg transition-colors ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          {!collapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </div>
  );
};
