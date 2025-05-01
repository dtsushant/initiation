import {
  FieldInputTypeProperties,
  FieldMeta,
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
