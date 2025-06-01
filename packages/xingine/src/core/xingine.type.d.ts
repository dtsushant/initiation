import {
  ComponentMeta,
  ComponentMetaMap,
  DetailDispatchProperties,
  FormDispatchProperties,
  TabDispatchProperties,
  TableDispatchProperties,
} from "@xingine/core/component/component-meta-map";

export interface Panel {
  presidium: string;
  assembly: string;
  doctrine: string;
}

export interface LayoutMandate {
  structure: Panel;
  clearanceRequired?: string[];
}

export type UIComponent = {
  component: string;
  path: string;
  icon?: string;
  layout: LayoutMandate;
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
  name: string;
  description?: string;
  layoutMandate: LayoutMandate;
  clearance: Permission[];
}

export type Provisioneer = Partial<ProvisioneerProperties> & { name: string };

export type ComponentDispatchByComponent<T extends keyof ComponentMetaMap> =
  T extends "FormRenderer"
    ? FormDispatchProperties
    : T extends "TableRenderer"
      ? TableDispatchProperties
      : T extends "TabRenderer"
        ? TabDispatchProperties
        : T extends "DetailRenderer"
          ? DetailDispatchProperties
          : never;

export type ComponentDispatchMap = {
  [K in keyof ComponentMetaMap]: ComponentDispatchByComponent<K>;
};

export interface CommissarProperties<
  TReq = unknown,
  TOperative extends keyof ComponentMetaMap = keyof ComponentMetaMap,
> {
  component: string;
  operative: TOperative;
  meta?: ComponentMetaMap[TOperative];
  directive: new () => TReq;
  dispatch?: ComponentDispatchMap[TOperative];
  preAction?: string;
  postAction?: string;
}
