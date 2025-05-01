import {
  ComponentMeta,
  ComponentMetaMap,
} from "@xingine/core/component/component-meta-map";

export type UIComponent = {
  component: string;
  path: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  meta?: ComponentMeta;
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
