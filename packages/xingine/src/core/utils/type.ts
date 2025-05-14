export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function extractRouteParams(path: string): string[] {
  const matches = path.match(/:([a-zA-Z0-9_.]+)/g);
  return matches?.map((param) => param.slice(1)) ?? [];
}
export function resolveDynamicPath(template: string, params: unknown): string {
  return template.replace(/:([a-zA-Z0-9_.]+)/g, (_, key) => {
    const value = resolvePath(params, key);
    if (value === undefined) {
      console.warn(`Missing route param: ${key}`);
      return `:${key}`;
    }
    return encodeURIComponent(String(value));
  });
}

export function resolvePath(input: unknown, path: string): unknown {
  if (input === null || (typeof input !== "object" && !Array.isArray(input))) {
    return undefined;
  }

  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;

    if (Array.isArray(acc)) {
      const index = Number(key);
      return isNaN(index) ? undefined : acc[index];
    }

    if (typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }

    return undefined;
  }, input);
}
