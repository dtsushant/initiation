import {
  ModuleProperties,
  ModulePropertyOptions,
  Permission,
  UIComponent,
} from "./xingine.type";
import {
  array,
  Decoder,
  either,
  object,
  optional,
  record,
  string,
  unknown,
} from "decoders";
import {
  ColumnMeta,
  ComponentMeta,
  TableMeta,
  TabMeta,
} from "@xingine/core/component/component-meta-map";
import { formMetaDecoder } from "@xingine/core/decoders/form.decoder";
import { detailMetaDecoder } from "@xingine/core/decoders/detail.decoder";

const columnMetaDecoder: Decoder<ColumnMeta> = object({
  field: string,
  headerName: string,
});

const tableMetaDecoder: Decoder<TableMeta> = object({
  columns: array(columnMetaDecoder),
  dataSourceUrl: string,
});

const tabMetaDecoder: Decoder<TabMeta> = object({
  tabs: array(
    object({
      label: string,
      component: string,
      meta: unknown,
    }),
  ),
}).transform(
  (tabMeta) =>
    ({
      tabs: tabMeta.tabs.map((tab) => ({
        label: tab.label,
        component: tab.component,
        meta: decodeMetaByComponent(tab.component, tab.meta),
      })),
    }) as TabMeta,
);

function decodeMetaByComponent(component: string, input: unknown): object {
  switch (component) {
    case "FormRenderer":
      return formMetaDecoder.verify(input);
    case "TableRenderer":
      return tableMetaDecoder.verify(input);
    case "TabRenderer":
      return tabMetaDecoder.verify(input);
    case "DetailRenderer":
      return detailMetaDecoder.verify(input);
    default:
      throw new Error(
        `Unknown component type '${component}' for meta decoding`,
      );
  }
}

const componentMetaDecoderBase = object({
  component: string,
  properties: unknown,
});

function componentMetaDecoder(): Decoder<ComponentMeta> {
  return componentMetaDecoderBase.transform((baseComponentMeta) => {
    const strictMeta = decodeMetaByComponent(
      baseComponentMeta.component,
      baseComponentMeta.properties,
    );
    return { ...baseComponentMeta, properties: strictMeta } as ComponentMeta;
  });
}

export const uiComponentDecoder: Decoder<UIComponent> = object({
  component: string,
  path: string,
  icon: optional(string),
  roles: optional(array(string)),
  permissions: optional(array(string)),
  meta: optional(componentMetaDecoder()),
});

const permissionDecoder: Decoder<Permission> = object({
  name: string,
  description: string,
});

// ModulePropertyOptions decoder
const modulePropertyOptionsDecoder: Decoder<ModulePropertyOptions> = object({
  description: optional(string),
  uiComponent: optional(array(uiComponentDecoder)),
  permissions: array(permissionDecoder),
});

export const modulePropertyOptionsListDecoder: Decoder<
  ModulePropertyOptions[]
> = array(modulePropertyOptionsDecoder);

export const modulePropertiesDecoder: Decoder<ModuleProperties> = object({
  name: string,
  uiComponent: optional(array(uiComponentDecoder)),
  permissions: array(permissionDecoder),
  description: optional(string),
});

export const modulePropertiesListDecoder: Decoder<ModuleProperties[]> = array(
  modulePropertiesDecoder,
);

export * from "./decoders/shared.decoder";
export * from "./decoders/form.decoder";
export * from "./decoders/detail.decoder";
