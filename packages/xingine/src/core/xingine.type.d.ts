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

export interface ProvisioneerProperties {
  name?: string;
  description?: string;
  clearance?: Permission[];
}

export interface CommissarProperties<TReq = unknown, TRes = unknown> {
  component: string;
  operative: keyof ComponentMetaMap;
  meta?: ComponentMetaMap[keyof ComponentMetaMap];
  directive: new () => TReq;
  dispatch?: new () => TRes;
  preAction?: string;
  postAction?: string;
}
