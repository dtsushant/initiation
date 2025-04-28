import React, { lazy } from "react";

export function lazyLoadComponent<TProps = object>(componentName: string) {
  console.log("the componentName", componentName);
  return lazy(
    () =>
      import(`../group/${componentName}`) as Promise<{
        default: React.ComponentType<TProps>;
      }>,
  );
}

export function getBreadcrumbs(
  path: string,
): { title: string; path: string }[] {
  const parts = path.split("/").filter(Boolean);

  return parts.map((part, index) => ({
    title: part.charAt(0).toUpperCase() + part.slice(1),
    path: "/" + parts.slice(0, index + 1).join("/"),
  }));
}
