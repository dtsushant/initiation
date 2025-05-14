import React, { lazy } from "react";

export function lazyLoadComponent<TProps = object>(componentName: string) {
  return lazy(() =>
    // import(`/src/lib/xingine-react/component/group/${componentName}.tsx`).then((module) => {
    import(`../group/${componentName}.tsx`).then((module) => {
      if (!module.default) {
        throw new Error(
          `Dynamic import failed: ${componentName} has no default export`,
        );
      }
      return { default: module.default };
    }),
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

export function normalizePath(path: string): string {
  let count = 1;
  return path.replace(/:([^/]+)/g, () => `:slug${count++}`);
}
