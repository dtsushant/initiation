import {
  ButtonTypeProperties,
  CheckboxTypeProperties,
  DateTypeProperties,
  FieldInputTypeProperties,
  FieldMeta,
  InputTypeProperties,
  NumberTypeProperties,
  PasswordTypeProperties,
  SelectTypeProperties,
  SwitchTypeProperties,
  TextareaTypeProperties,
  TreeSelectTypeProperties,
} from "@xingine/core/component/component-meta-map.ts";
import { Rule } from "antd/es/form";

export function generateRules(
  field: FieldMeta,
  properties?: Partial<
    FieldInputTypeProperties[keyof FieldInputTypeProperties]
  >,
): Rule[] {
  const rules: Rule[] = [];

  if (field.required) {
    rules.push({ required: true, message: `${field.label} is required` });
  }

  if (!properties) return rules;

  if ("email" in properties) {
    rules.push({
      type: "email",
      message: "Enter a valid email",
    });
  }

  // Input/Textarea specific
  if ("minLength" in properties && typeof properties.minLength === "number") {
    rules.push({
      min: properties.minLength,
      message: `${field.label} must be at least ${properties.minLength} characters`,
    });
  }

  if ("maxLength" in properties && typeof properties.maxLength === "number") {
    rules.push({
      max: properties.maxLength,
      message: `${field.label} must be at most ${properties.maxLength} characters`,
    });
  }

  // Number specific
  if ("min" in properties && typeof properties.min === "number") {
    rules.push({
      type: "number",
      min: properties.min,
      message: `${field.label} must be ≥ ${properties.min}`,
    });
  }

  if ("max" in properties && typeof properties.max === "number") {
    rules.push({
      type: "number",
      max: properties.max,
      message: `${field.label} must be ≤ ${properties.max}`,
    });
  }

  return rules;
}

export const resolveComponentProps = (
  type: keyof FieldInputTypeProperties,
  props?: FieldInputTypeProperties[keyof FieldInputTypeProperties] & {
    isSubmitting: boolean;
  },
):
  | FieldInputTypeProperties[keyof FieldInputTypeProperties]
  | (FieldInputTypeProperties[keyof FieldInputTypeProperties] &
      Record<string, unknown>) => {
  if (!props) {
    return {};
  }
  switch (type) {
    case "input":
      return props as InputTypeProperties;
    case "password":
      return props as PasswordTypeProperties;
    case "number":
      return props as NumberTypeProperties;
    case "select":
      return {
        ...props,
        mode: (props as SelectTypeProperties).multiple ? "multiple" : undefined,
      };
    case "treeselect":
      return {
        ...props,
        treeCheckable: (props as TreeSelectTypeProperties).multiple,
      };
    case "switch":
      return props as SwitchTypeProperties;
    case "checkbox":
      return props as CheckboxTypeProperties;
    case "date":
      return props as DateTypeProperties;
    case "textarea":
      return props as TextareaTypeProperties;
    case "button":
      return {
        ...(props as ButtonTypeProperties),
        isSubmitting: props.isSubmitting,
        htmlType: "submit",
      };
    default:
      return {};
  }
};
