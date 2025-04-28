import { ComponentMetaMap } from "@xingine/core/component/component-meta-map";

export type UIComponent<
  T extends keyof ComponentMetaMap = keyof ComponentMetaMap,
> = {
  component: T;
  path: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  meta?: ComponentMetaMap[T];
};

export interface Comrade {
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface ModulePropertyOptions {
  uiComponent?: UIComponent[];
  permissions: Permission[];
  description?: string;
}

export interface ModuleProperties extends ModulePropertyOptions {
  name: string;
}
