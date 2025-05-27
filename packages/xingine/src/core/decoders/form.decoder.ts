import {
  array,
  boolean,
  constant,
  Decoder,
  lazy,
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
  CheckboxOption,
  CheckboxTypeProperties,
  DateTypeProperties,
  FieldMeta,
  InputTypeProperties,
  LookupTypeProperties,
  NestedCheckboxOption,
  NestedCheckboxTypeProperties,
  NumberTypeProperties,
  ObjectFieldProperties,
  ObjectListFieldProperties,
  PasswordTypeProperties,
  SelectTypeProperties,
  SwitchTypeProperties,
  TextareaTypeProperties,
  TreeSelectTypeProperties,
} from "@xingine/core/component/form-meta-map";
import {
  FormDispatchProperties,
  FormMeta,
} from "@xingine/core/component/component-meta-map";
import { dynamicShapeDecoder } from "@xingine/core/decoders/shared.decoder";

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

const checkboxOptionDecoder: Decoder<CheckboxOption> = object({
  label: string,
  value: string,
  checked: optional(boolean),
  disabled: optional(boolean),
});

const nestedCheckBoxOptionDecoder: Decoder<NestedCheckboxOption> = lazy(() =>
  object({
    label: string,
    value: string,
    checked: optional(boolean),
    disabled: optional(boolean),
    children: optional(array(nestedCheckBoxOptionDecoder)),
  }),
);
export const nestedCheckboxOptionListDecoder: Decoder<NestedCheckboxOption[]> =
  array(nestedCheckBoxOptionDecoder);
export const nestedCheckboxTypeDecoder: Decoder<NestedCheckboxTypeProperties> =
  object({
    options: optional(nestedCheckboxOptionListDecoder),
    fetchAction: optional(string),
  });

export const checkboxOptionListDecoder: Decoder<CheckboxOption[]> = array(
  checkboxOptionDecoder,
);
export const checkboxTypeDecoder: Decoder<CheckboxTypeProperties> = object({
  options: optional(checkboxOptionListDecoder),
  fetchAction: optional(string),
  value: optional(array(string)),
  disabled: optional(boolean),
  label: optional(string),
  checked: optional(boolean),
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

export const resultMapEntryDecoder = object({
  label: string,
  value: string,
});

export const lookupTypePropertiesDecoder: Decoder<LookupTypeProperties> =
  object({
    fetchAction: string,
    multiple: optional(boolean),
    placeholder: optional(string),
    disabled: optional(boolean),
    allowSearch: optional(boolean),
    allowAddNew: optional(boolean),
    searchField: optional(string),
    debounce: optional(number),
    createAction: optional(string),
    resultMap: optional(array(resultMapEntryDecoder)),
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
    case "lookup":
      return lookupTypePropertiesDecoder.verify(input);
    case "switch":
      return switchTypeDecoder.verify(input);
    case "checkbox":
      return checkboxTypeDecoder.verify(input);
    case "nestedcheckbox":
      return nestedCheckboxTypeDecoder.verify(input);
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
  fields: array(fieldMetaDecoder()),
});

export const objectListTypeDecoder: Decoder<ObjectListFieldProperties> = object(
  {
    itemFields: array(fieldMetaDecoder()).transform((f) => f ?? []),
  },
);

/*export function jsonSchemaToDecoder(schema: unknown): Decoder<unknown> {
  if (schema.enum) {
    const enumDecoders = schema.enum.map((val: string | number | boolean) =>
        constant(val)
    );
    return oneOf(enumDecoders);
  }

  switch (schema.type) {
    case 'string':
      return string;
    case 'number':
      return number;
    case 'boolean':
      return boolean;
    case 'array':
      return array(jsonSchemaToDecoder(schema.items));
    case 'object':
      const props = schema.properties ?? {};
      const required = new Set(schema.required ?? []);
      const shape: Record<string, Decoder<unknown>> = {};

      for (const [key, propSchema] of Object.entries(props)) {
        const decoder = jsonSchemaToDecoder(propSchema);
        shape[key] = required.has(key) ? decoder : optional(decoder);
      }

      return object(shape);
    default:
      return object({}); // fallback
  }
}*/

const formDispatchPropertiesDecoderBase = object({
  formSubmissionResponse: dynamicShapeDecoder,
  onSuccessRedirectTo: optional(
    object({
      component: string,
      payloadNamePath: optional(record(string, string)),
    }),
  ),
});

function formDispatchPropertiesDecoder(): Decoder<FormDispatchProperties> {
  console.log("decoding the dispatch");
  return formDispatchPropertiesDecoderBase.transform((formDispatchProperty) => {
    console.log("the property", formDispatchProperty);
    return formDispatchProperty as FormDispatchProperties;
  });
}

/*export const formDispatchPropertiesDecoder: Decoder<FormDispatchProperties> = object({
  formSubmissionResponse: jsonSchemaToDecoder(),
  onSuccessRedirectTo: optional(object({
    component: string,
    payloadNamePath: optional(record(string)),
  })),
}) as FormDispatchProperties;*/
/*export const formDispatchPropertiesDecoder: Decoder<FormDispatchProperties> =
  object({
    formSubmissionResponse:unknown,
    onSuccessRedirectTo: optional(
      object({
        component: string,
        payloadNamePath:optional(record(string,string))
      }),
    ),
  });*/
export const formMetaDecoder: Decoder<FormMeta> = object({
  fields: array(fieldMetaDecoder()).transform((f) => f ?? []),
  action: string,
  dispatch: optional(
    formDispatchPropertiesDecoder().transform((f) => {
      return f;
    }),
  ),
});
