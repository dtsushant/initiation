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
  either,
  number,
  object,
  oneOf,
  optional,
  record,
  string,
  unknown,
} from "decoders";
import {
  ButtonTypeProperties,
  ButtonView,
  CheckboxTypeProperties,
  ColumnMeta,
  ComponentMeta,
  DateTypeProperties,
  DetailMeta,
  FieldMeta,
  FormMeta,
  InputTypeProperties,
  NumberTypeProperties,
  ObjectFieldProperties,
  ObjectListFieldProperties,
  PasswordTypeProperties,
  SelectTypeProperties,
  SwitchTypeProperties,
  TableMeta,
  TabMeta,
  TextareaTypeProperties,
  TreeSelectTypeProperties,
} from "@xingine/core/component/component-meta-map";

export const inputTypeDecoder: Decoder<InputTypeProperties> = object({
  placeholder: optional(string),
  maxLength: optional(number),
  minLength: optional(number),
  disabled: optional(boolean),
  email: optional(boolean),
});

export const passwordTypeDecoder: Decoder<PasswordTypeProperties> = object({
  placeholder: optional(string),
  minLength: optional(number),
  hasStrengthMeter: optional(boolean),
  disabled: optional(boolean),
});

export const numberTypeDecoder: Decoder<NumberTypeProperties> = object({
  min: optional(number),
  max: optional(number),
  step: optional(number),
  precision: optional(number),
  disabled: optional(boolean),
});

export const selectTypeDecoder: Decoder<SelectTypeProperties> = object({
  options: array(object({ label: string, value: string })),
  multiple: optional(boolean),
  disabled: optional(boolean),
  placeholder: optional(string),
});

export const treeSelectTypeDecoder: Decoder<TreeSelectTypeProperties> = object({
  treeData: array(
    object({
      title: string,
      value: string,
      children: optional(array(object({ title: string, value: string }))),
    }),
  ),
  multiple: optional(boolean),
  disabled: optional(boolean),
  placeholder: optional(string),
});

export const switchTypeDecoder: Decoder<SwitchTypeProperties> = object({
  checkedChildren: optional(string),
  unCheckedChildren: optional(string),
  defaultChecked: optional(boolean),
  disabled: optional(boolean),
});

export const checkboxTypeDecoder: Decoder<CheckboxTypeProperties> = object({
  label: optional(string),
  checked: optional(boolean),
  disabled: optional(boolean),
});

export const dateTypeDecoder: Decoder<DateTypeProperties> = object({
  format: optional(string),
  showTime: optional(boolean),
  disabled: optional(boolean),
});

export const textareaTypeDecoder: Decoder<TextareaTypeProperties> = object({
  rows: optional(number),
  maxLength: optional(number),
  placeholder: optional(string),
  disabled: optional(boolean),
});

const buttonViewDecoder: Decoder<ButtonView> = oneOf([
  "primary",
  "default",
  "dashed",
  "link",
  "text",
]);

export const buttonTypeDecoder: Decoder<ButtonTypeProperties> = object({
  text: string,
  type: optional(buttonViewDecoder),
  disabled: optional(boolean),
  onClickAction: optional(string),
});

export function decodeFieldInputPropertiesByInputType(
  inputType: string,
  input?: unknown,
): object | undefined {
  if (!input) return undefined;
  switch (inputType) {
    case "input":
      return inputTypeDecoder.verify(input);
    case "password":
      return passwordTypeDecoder.verify(input);
    case "number":
      return numberTypeDecoder.verify(input);
    case "select":
      return selectTypeDecoder.verify(input);
    case "treeselect":
      return treeSelectTypeDecoder.verify(input);
    case "switch":
      return switchTypeDecoder.verify(input);
    case "checkbox":
      return checkboxTypeDecoder.verify(input);
    case "date":
      return dateTypeDecoder.verify(input);
    case "textarea":
      return textareaTypeDecoder.verify(input);
    case "button":
      return buttonTypeDecoder.verify(input);
    case "object":
      return objectTypeDecoder.verify(input);
    case "object[]":
      return objectListTypeDecoder.verify(input);
    default:
      throw new Error(
        `Unknown component type '${inputType}' for meta decoding`,
      );
  }
}
const fieldMetaDecoderBase = object({
  name: string,
  label: string,
  inputType: string,
  required: optional(boolean),
  value: optional(string),
  properties: optional(unknown),
});

function fieldMetaDecoder(): Decoder<FieldMeta> {
  return fieldMetaDecoderBase.transform((baseFieldMeta) => {
    const strictMeta = decodeFieldInputPropertiesByInputType(
      baseFieldMeta.inputType,
      baseFieldMeta.properties,
    );
    return { ...baseFieldMeta, properties: strictMeta } as FieldMeta;
  });
}

export const objectTypeDecoder: Decoder<ObjectFieldProperties> = object({
  fields: array(fieldMetaDecoder()).transform((f) => f ?? []),
});

export const objectListTypeDecoder: Decoder<ObjectListFieldProperties> = object(
  {
    itemFields: array(fieldMetaDecoder()).transform((f) => f ?? []),
  },
);

const formMetaDecoder: Decoder<FormMeta> = object({
  fields: array(fieldMetaDecoder()).transform((f) => f ?? []),
  action: string,
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
  fields: array(fieldMetaDecoder()),
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

export const dynamicShapeDecoder = record(
  either(
    string,
    either(array(string), either(record(string), array(record(string)))),
  ),
);
