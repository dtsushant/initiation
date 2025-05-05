import React, { forwardRef } from "react";
import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Switch,
  Checkbox,
  DatePicker,
  Button,
  CheckboxRef,
  CheckboxChangeEvent,
} from "antd";
import {
  ButtonTypeProperties,
  CheckboxTypeProperties,
  DateTypeProperties,
  FieldInputTypeProperties,
  InputTypeProperties,
  NumberTypeProperties,
  PasswordTypeProperties,
  SelectTypeProperties,
  SwitchTypeProperties,
  TextareaTypeProperties,
  TreeSelectTypeProperties,
} from "@xingine/core/component/component-meta-map.ts";

export const fieldTypeRenderMap: Record<
  keyof FieldInputTypeProperties,
  React.FC<unknown>
> = {
  input: Input,
  password: Input.Password,
  number: InputNumber,
  select: Select,
  treeselect: TreeSelect,
  switch: Switch,
  checkbox: forwardRef<
    CheckboxRef,
    CheckboxTypeProperties & {
      onChange?: (e: CheckboxChangeEvent) => void;
    }
  >((props, ref) => (
    <Checkbox ref={ref} disabled={props.disabled} onChange={props.onChange}>
      {props.label}
    </Checkbox>
  )),
  date: DatePicker,
  textarea: Input.TextArea,
  button: (props: ButtonTypeProperties & { isSubmitting: boolean }) => {
    console.log("rendering button", props.isSubmitting);
    return (
      <Button
        type={props.type}
        disabled={props.disabled || props.isSubmitting}
        htmlType="submit"
        loading={props.isSubmitting}
      >
        {props.text}
      </Button>
    );
  },
};
