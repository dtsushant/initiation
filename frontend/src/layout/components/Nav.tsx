import React, { useCallback, useEffect, useMemo } from "react";
import { Layout, Menu, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { UserProfile } from "./UserProfile";
import { ConfirmationModal } from "/@/components/common/modal/ConfirmationModal";
import { findParentRoute } from "/@/utils/helper.";
import { routes } from "/@/routes";
import logo from "/@/assets/initiationSmallLogo.svg";
import smallLogo from "/@/assets/initiationNewSmallLogo.svg";
import { CollapsedProvider } from "/@/context/CollapsedContext";
import { useStore } from "/@/store/store.hook.ts";
import { AppState, logout } from "/@/components/app/App.slice.ts";
import { store } from "/@/store";
import axios from "axios";
import {
  NavState,
  setConfirmationModalVisible,
  setIsDesktop,
  toggleCollapse,
} from "/@/layout/components/Nav.slice.ts";

export const Nav: React.FC<NavProps> = ({ routes: propRoutes }) => {
  const {
    app: { user },
    nav: { collapsed, isDesktop, confirmationModalVisible },
  } = useStore<{
    app: AppState;
    nav: NavState;
  }>((state) => ({
    app: state.app,
    nav: state.nav,
  }));
  useEffect(() => {
    const update = () => {
      store.dispatch(setIsDesktop(window.innerWidth >= 1024));
    };
    window.addEventListener("resize", update);
    update();

    return () => window.removeEventListener("resize", update);
  }, []);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function _logout() {
    delete axios.defaults.headers.Authorization;
    localStorage.removeItem("token");
    store.dispatch(logout());
    location.hash = "/";
  }

  const menuRoutes = propRoutes || routes;

  const setCollapsed = (val: boolean) => {
    return store.dispatch(toggleCollapse(val));
  };

  const activeMenuItem = useMemo(() => {
    if (menuRoutes.some((route) => route.path === pathname)) {
      return pathname;
    }

    const parentPath = findParentRoute(pathname);
    return parentPath || pathname;
  }, [pathname, menuRoutes]);

  // No role filtering - all routes are available to authenticated users
  const authorizedRoutes = menuRoutes;

  const handleClick = useCallback(
    ({ key }: { key: string }) => {
      if (pathname !== key) {
        navigate(key);
      }
    },
    [navigate, pathname],
  );

  const handleLogOut = () => {
    showConfirmationModal();
  };

  const onOk = () => {
    _logout();
    hideConfirmationModal();
  };

  const menus = authorizedRoutes.map(({ path, label, icon, children }) => ({
    key: path,
    label,
    icon,
    children: children?.map(({ path: childPath, label: childLabel }) => ({
      key: childPath,
      label: childLabel,
    })),
  }));

  useEffect(() => {
    setCollapsed(!isDesktop);
  }, [isDesktop]);

  const showConfirmationModal = () => {
    store.dispatch(setConfirmationModalVisible(true));
  };

  const hideConfirmationModal = () => {
    store.dispatch(setConfirmationModalVisible(false));
  };

  return (
    <CollapsedProvider value={{ isCollapsed: collapsed }}>
      <Layout.Sider
        className="min-h-screen bg-white shadow-lg z-50"
        width={280}
        theme="light"
        collapsed={collapsed}
        collapsedWidth={90}
        onCollapse={setCollapsed}
      >
        <div className="sticky top-0 z-[1] flex h-[70px] w-full select-none items-center bg-white">
          <div className="flex items-center justify-start w-full">
            <img
              src={collapsed ? smallLogo : logo}
              alt="Logo"
              height={30}
              width={collapsed ? 30 : 140}
              className={`h-12 ${collapsed ? "cursor-pointer mx-auto" : ""}`}
              onClick={collapsed ? () => setCollapsed(!collapsed) : undefined}
            />
          </div>

          {!collapsed && (
            <div className="absolute right-5 flex items-center">
              <MenuFoldOutlined
                className="text-xl cursor-pointer text-[#000000D9] hover:text-brightorange-6"
                onClick={() => setCollapsed(true)}
              />
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          forceSubMenuRender={false}
          selectedKeys={[activeMenuItem]}
          onClick={handleClick}
          items={menus}
          className="mt-4"
        />

        {/* User section */}
        <div className="absolute bottom-0 w-full px-6 py-4 flex flex-col items-center gap-2">
          <Divider className="w-full" />
          <div
            className={`w-full flex ${
              collapsed ? "flex-col items-center" : "justify-between"
            }`}
          >
            {user && (
              <UserProfile
                user={{
                  name: user.email,
                  // role removed from props
                }}
                collapsed={collapsed}
              />
            )}
            <LogoutOutlined
              className="text-[1.5rem] text-[#000000D9] cursor-pointer hover:text-brightorange-6"
              onClick={handleLogOut}
            />
          </div>
        </div>
        <ConfirmationModal
          isVisible={confirmationModalVisible}
          onClose={hideConfirmationModal}
          onOk={onOk}
        />
      </Layout.Sider>
    </CollapsedProvider>
  );
};
Nav.displayName = "Nav";
