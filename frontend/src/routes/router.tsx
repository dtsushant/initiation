import React, { Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { PublicRoute } from "../components/auth/PublicRoute";
import { Layout } from "../layout";
import { LoginPage } from "../pages/auth";
import { NotFoundPage } from "../pages/not-found";
import { UnauthorizedPage } from "../pages/unauthorized";
import { routes } from ".";
import { PublicSpacePage } from "/@/pages/public/PublicSpacePage.tsx";
import { useStore } from "/@/store/store.hook.ts";
import { AppState } from "/@/components/app/App.slice.ts";
import { UIComponent } from "@xingine";
import {
  lazyLoadComponent,
  safeSluggedRoute,
} from "/@/lib/xingine-react/component/utils/Component.utils.ts";
import { AccessGuard } from "/@/lib/xingine-react/component/ComponentAccessGuard.tsx";
import { DefaultLayout } from "/@/lib/xingine-react/component/ComponentDefaultLayout.tsx";
import { PublicLayout } from "/@/layout/PublicLayout.tsx";
import { DashboardPage } from "/@/pages/dashboard";
import { getModuleRegistryService } from "/@/lib/xingine-react/xingine-react.registry.ts";

export function Router() {
  const {
    app: { allowedModule },
  } = useStore<{
    app: AppState;
  }>((state) => ({
    app: state.app,
  }));

  const comps: UIComponent[] = [];
  const populatedComps = () => {
    if (allowedModule) {
      allowedModule.forEach((modules) => {
        if (modules.uiComponent !== undefined) {
          comps.push(...modules.uiComponent);
        }
      });
    }
  };
  populatedComps();
  console.log("the allowedModule", allowedModule);

  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/browse" element={<PublicSpacePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<PublicLayout registeredComponents={comps} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        {comps.length > 0 &&
          comps.map((mod) => {
            const Component = getModuleRegistryService()?.get(
              mod.component,
              mod.meta?.properties,
            ); //lazyLoadComponent(mod.component);
            console.log("the normalizedPath", mod.path);
            return (
              <Route
                key={mod.component}
                path={safeSluggedRoute(mod.path)}
                element={
                  <AccessGuard roles={mod.roles} permissions={mod.permissions}>
                    <Suspense fallback={<div>Loading...</div>}>
                      {/*<Component {...mod.meta} />*/}
                      {Component}
                    </Suspense>
                  </AccessGuard>
                }
              />
            );
          })}
        {/* Add more public pages here */}
      </Route>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        {routes().flatMap((route) => {
          const baseRoute = (
            <Route key={route.path} path={route.path} element={route.element} />
          );

          const slugRoute = route.hasSlug ? (
            <Route
              key={`${route.path}-slug`}
              path={`${route.path}/:slug`}
              element={route.element}
            />
          ) : null;

          return [baseRoute, slugRoute].filter(Boolean);
        })}
        {routes().flatMap((route) =>
          (route.children || []).map((child) => (
            <Route key={child.path} path={child.path} element={child.element} />
          )),
        )}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      {/*{comps.length > 0 &&
        comps.map((mod) => {
          const Component = lazyLoadComponent(mod.component);

          return (
            <Route
              key={mod.path}
              path={mod.path}
              element={
                <AccessGuard roles={mod.roles} permissions={mod.permissions}>
                  <DefaultLayout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Component meta={mod.meta} />
                    </Suspense>
                  </DefaultLayout>
                </AccessGuard>
              }
            />
          );
        })}*/}
    </Routes>
  );
}
