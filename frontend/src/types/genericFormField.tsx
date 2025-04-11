import { InputProps } from "antd";
import type { Rule } from "antd/es/form";
import { TextAreaProps } from "antd/es/input";

export interface GenericFormField {
  name: string;
  label: string;
  value: string;
  type: string;
  placeholder: string;
  rows?: number;
  fieldType: "input" | "textarea" | "list";
  listName?: string;
  lg: boolean;
  rules?: Rule[];
  inputProps?: InputProps;
  textAreaProps?: TextAreaProps;
}

export function buildGenericFormField(
  data: Partial<GenericFormField> & { name: string },
): GenericFormField {
  return {
    type: "text",
    placeholder: "",
    fieldType: "input",
    lg: true,
    ...data,
  };
}
