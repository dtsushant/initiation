import {
  ModuleProperties,
  ModulePropertyOptions,
  Permission,
  UIComponent,
} from "./xingine.type";
import {
  array,
  boolean,
  constant,
  Decoder,
  dict,
  object,
  oneOf,
  optional,
  string,
  unknown,
} from "decoders";
import {
  ColumnMeta,
  ComponentMetaMap,
  DetailMeta,
  FieldInputType,
  FieldMeta,
  FormMeta,
  TableMeta,
  TabMeta,
} from "@xingine/core/component/component-meta-map";

const fieldInputTypeDecoder: Decoder<FieldInputType> = oneOf([
  "text",
  "input",
  "password",
  "number",
  "select",
  "date",
  "textarea",
]);
const fieldMetaDecoder: Decoder<FieldMeta> = object({
  name: string,
  label: string,
  inputType: fieldInputTypeDecoder,
  required: optional(boolean),
  options: optional(array(object({ label: string, value: string }))),
});

const formMetaDecoder: Decoder<FormMeta> = object({
  fields: array(fieldMetaDecoder),
});

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

const detailMetaDecoder: Decoder<DetailMeta> = object({
  fields: array(fieldMetaDecoder),
});

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

const uiComponentDecoderBase = object({
  component: string,
  path: string,
  icon: optional(string),
  roles: optional(array(string)),
  permissions: optional(array(string)),
  meta: optional(unknown),
});

export function uiComponentDecoder(): Decoder<UIComponent> {
  return uiComponentDecoderBase.transform((baseComponent) => {
    if (baseComponent.meta) {
      const strictMeta = decodeMetaByComponent(
        baseComponent.component,
        baseComponent.meta,
      );
      return { ...baseComponent, meta: strictMeta } as UIComponent;
    }
    return baseComponent as UIComponent;
  });
}

const permissionDecoder: Decoder<Permission> = object({
  name: string,
  description: string,
});

// ModulePropertyOptions decoder
const modulePropertyOptionsDecoder: Decoder<ModulePropertyOptions> = object({
  description: optional(string),
  uiComponent: optional(array(uiComponentDecoder())),
  permissions: array(permissionDecoder),
});

export const modulePropertyOptionsListDecoder: Decoder<
  ModulePropertyOptions[]
> = array(modulePropertyOptionsDecoder);

export const modulePropertiesDecoder: Decoder<ModuleProperties> = object({
  name: string,
  uiComponent: optional(array(uiComponentDecoder())),
  permissions: array(permissionDecoder),
  description: optional(string),
});

export const modulePropertiesListDecoder: Decoder<ModuleProperties[]> = array(
  modulePropertiesDecoder,
);
