import React, { useEffect, useMemo, useState } from "react";
import { SiderMeta } from "xingine";
import {
  bindMultipleEvents,
  DangerousRenderer,
  getAllComponentMap,
  toCSSClassName,
  toCSSProperties,
  useXingineContext,
} from "xingine-react";

export const SiderRenderer: React.FC<SiderMeta> = (meta) => {
  const {
    children,
    style,
    content,
    event,

    ...props
  } = meta;
  const compMap = getAllComponentMap(); //getDefaultInternalComponents();
  const [hasSider, setHasSider] = useState(true);

  const scope = useMemo(
    () => ({
      hasSider,
      setHasSider,
    }),
    [],
  );

  const { panelControl } = useXingineContext();
  const { setHeaderActionContext } = panelControl;

  useEffect(() => {
    setHeaderActionContext((prev) => ({
      ...prev,
      ...scope,
    }));
  }, []);

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

  console.log("rendering the sider here", meta);

  return (
    <>
      <aside
        style={toCSSProperties(style?.style)}
        className={toCSSClassName(style?.className)}
        {...bindMultipleEvents(event)}
        {...props}
      >
        {content && <DangerousRenderer content={content} />}

        {children
          ?.filter((child) => !!child.meta)
          .map((child, index) => {
            const Comp = compMap[child.meta!.component];
            if (!Comp) {
              console.warn(
                `layout Component ${child.meta!.component} not found`,
              );
              return null;
            }
            return <Comp {...child.meta!.properties} key={index} />;
          })}

        <nav className="space-y-1">{renderMenuItems(defaultMenuItems)}</nav>
      </aside>
    </>
  );
};
