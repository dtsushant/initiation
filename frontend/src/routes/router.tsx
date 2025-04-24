import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { PublicRoute } from "../components/auth/PublicRoute";
import { Layout } from "../layout";
import { LoginPage } from "../pages/auth";
import { NotFoundPage } from "../pages/not-found";
import { UnauthorizedPage } from "../pages/unauthorized";
import { routes } from ".";
import { PublicSpacePage } from "/@/pages/public/PublicSpacePage.tsx";

export function Router() {
  return (
    <Routes>
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
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
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
    </Routes>
  );
}
