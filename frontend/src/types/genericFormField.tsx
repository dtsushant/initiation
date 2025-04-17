import { InputProps, TreeSelectProps } from "antd";
import type { Rule } from "antd/es/form";
import { TextAreaProps } from "antd/es/input";
import { NamePath } from "antd/es/form/interface";

type CommonFormField = {
  name: NamePath;
  label: string;
  type: string;
  placeholder: string;
  lg: boolean;
  initialValue?: string | boolean;
  rules?: Rule[];
  listName?: string;
  onChange: (name: NamePath, value: string | boolean) => void;
};

export type GenericFormField =
  | (CommonFormField & {
      fieldType: "input";
      inputProps?: InputProps;
      maxLength?: number;
      minLength?: number;
    })
  | (CommonFormField & {
      fieldType: "textarea";
      textAreaProps?: TextAreaProps;
      rows?: number;
    })
  | (CommonFormField & {
      fieldType: "treeSelect";
      treeSelectProps?: TreeSelectProps;
      treeData: TreeSelectProps["treeData"];
    })
  | (CommonFormField & {
      fieldType: "list";
    })
  | (CommonFormField & {
      fieldType: "switch";
      valuePropName: "checked";
      initialValue: boolean;
    })
  | (CommonFormField & {
      fieldType: "select";
    });

export function buildGenericFormField(
  data: Partial<GenericFormField> & { name: NamePath },
): GenericFormField {
  return {
    type: "text",
    placeholder: "",
    fieldType: "input",
    lg: true,
    ...data,
  } as GenericFormField;
}
