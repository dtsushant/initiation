import {
  BaseFilterCondition,
  GroupCondition,
  SearchCondition,
  SearchQuery,
} from "@xingine/core/expressions/operators";

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function extractRouteParams(path: string): string[] {
  const matches = path.match(/:([a-zA-Z0-9_.]+)/g);
  return matches?.map((param) => param.slice(1)) ?? [];
}
export function resolveDynamicPath(
  template: string,
  params: unknown,
  conditionalNamedPath?: Record<string, string>,
): string {
  return template.replace(/:([a-zA-Z0-9_.]+)/g, (_, key) => {
    let keyToResolve = key;
    if (conditionalNamedPath) {
      keyToResolve = conditionalNamedPath[key];
    }
    const value = resolvePath(params, keyToResolve);
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

export function isBaseCondition(val: unknown): val is BaseFilterCondition {
  return (
    typeof val === "object" &&
    val !== null &&
    "field" in val &&
    "operator" in val &&
    "value" in val
  );
}

export function isGroupCondition(val: unknown): val is GroupCondition {
  return (
    typeof val === "object" && val !== null && ("and" in val || "or" in val)
  );
}

export function buildMikroOrmWhereFromNestedCondition(
  query: SearchQuery,
): Record<string, unknown> {
  return transformConditionGroup(query);
}

function transformConditionGroup(
  group: GroupCondition,
): Record<string, unknown> {
  const conditions: Record<string, unknown> = {};

  if (group.and && group.and.length > 0) {
    conditions.$and = group.and.map(transformCondition);
  }

  if (group.or && group.or.length > 0) {
    conditions.$or = group.or.map(transformCondition);
  }

  return conditions;
}

function transformCondition(cond: SearchCondition): Record<string, unknown> {
  if (isBaseCondition(cond)) {
    const { field, operator, value } = cond;
    const wildcardValue =
      typeof value === "string" && (operator === "like" || operator === "ilike")
        ? `%${value}%`
        : value;
    switch (operator) {
      case "eq":
        return { [field]: value };
      case "ne":
        return { [field]: { $ne: value } };
      case "like":
        return { [field]: { $like: wildcardValue } };
      case "ilike":
        return { [field]: { $ilike: wildcardValue } };
      case "in":
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };
      case "nin":
        return { [field]: { $nin: Array.isArray(value) ? value : [value] } };
      case "gt":
        return { [field]: { $gt: value } };
      case "gte":
        return { [field]: { $gte: value } };
      case "lt":
        return { [field]: { $lt: value } };
      case "lte":
        return { [field]: { $lte: value } };
      default:
        return {};
    }
  }

  if (isGroupCondition(cond)) {
    return transformConditionGroup(cond);
  }

  throw new Error("Invalid SearchCondition: must be base or group");
}
