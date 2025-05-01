import React, { JSX } from "react";
import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Switch,
  Checkbox,
  DatePicker,
  Button,
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
  (
    props: FieldInputTypeProperties[keyof FieldInputTypeProperties],
  ) => JSX.Element
> = {
  input: (props) => (
    <Input
      placeholder={(props as InputTypeProperties).placeholder}
      maxLength={(props as InputTypeProperties).maxLength}
      disabled={(props as InputTypeProperties).disabled}
    />
  ),

  password: (props) => (
    <Input.Password
      placeholder={(props as PasswordTypeProperties).placeholder}
      disabled={(props as PasswordTypeProperties).disabled}
    />
  ),

  number: (props) => (
    <InputNumber
      min={(props as NumberTypeProperties).min}
      max={(props as NumberTypeProperties).max}
      step={(props as NumberTypeProperties).step}
      disabled={(props as NumberTypeProperties).disabled}
    />
  ),

  select: (props) => (
    <Select
      options={(props as SelectTypeProperties).options}
      mode={(props as SelectTypeProperties).multiple ? "multiple" : undefined}
      disabled={(props as SelectTypeProperties).disabled}
      placeholder={(props as SelectTypeProperties).placeholder}
    />
  ),

  treeselect: (props) => (
    <TreeSelect
      treeData={(props as TreeSelectTypeProperties).treeData}
      treeCheckable={(props as TreeSelectTypeProperties).multiple}
      disabled={(props as TreeSelectTypeProperties).disabled}
      placeholder={(props as TreeSelectTypeProperties).placeholder}
    />
  ),

  switch: (props) => (
    <Switch
      defaultChecked={(props as SwitchTypeProperties).defaultChecked}
      checkedChildren={(props as SwitchTypeProperties).checkedChildren}
      unCheckedChildren={(props as SwitchTypeProperties).unCheckedChildren}
      disabled={(props as SwitchTypeProperties).disabled}
    />
  ),

  checkbox: (props) => (
    <Checkbox disabled={(props as CheckboxTypeProperties).disabled}>
      {(props as CheckboxTypeProperties).label}
    </Checkbox>
  ),

  date: (props) => (
    <DatePicker
      format={(props as DateTypeProperties).format}
      showTime={(props as DateTypeProperties).showTime}
      disabled={(props as DateTypeProperties).disabled}
    />
  ),

  textarea: (props) => (
    <Input.TextArea
      placeholder={(props as TextareaTypeProperties).placeholder}
      maxLength={(props as TextareaTypeProperties).maxLength}
      rows={(props as TextareaTypeProperties).rows}
      disabled={(props as TextareaTypeProperties).disabled}
    />
  ),

  button: (props) => (
    <Button
      type={(props as ButtonTypeProperties).type}
      disabled={(props as ButtonTypeProperties).disabled}
    >
      {(props as ButtonTypeProperties).text}
    </Button>
  ),
};
