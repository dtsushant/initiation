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

export function safeSluggedRoute(route: string): string {
  return route.replace(/:([a-zA-Z0-9_.]+)/g, (_, key) => {
    return ":" + key.replace(/\./g, "_"); // → ":user_username"
  });
}

export function nestParamsSluggedParams(
  flat: Record<string, string | undefined>,
  separator = "_",
): Record<string, unknown> {
  const nested: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split(separator);
    let current = nested;

    for (let i = 0; i < keys.length - 1; i++) {
      const part = keys[i];
      if (!(part in current)) current[part] = {};
      current = current[part] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
  }

  return nested;
}
