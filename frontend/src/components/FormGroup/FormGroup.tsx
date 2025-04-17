import React, { JSX } from "react";
import { Form, Input, Switch, TreeSelect } from "antd";
import type { NamePath } from "antd/es/form/interface";
import { GenericFormField } from "/@/types/genericFormField.tsx";

export const FormGroup: React.FC<{ props: GenericFormField }> = ({ props }) => {
  const {
    type,
    name,
    label,
    fieldType,
    rules,
    placeholder,
    disabled,
    lg,
    inputProps,
    textAreaProps,
    treeData,
    initialValue,
    maxLength,
    minLength,
    onChange,
  } = props;
  const inputRenderMap: Record<
    GenericFormField["fieldType"],
    () => JSX.Element
  > = {
    input: () => {
      if (type === "password") {
        return (
          <Input.Password
            placeholder={placeholder}
            disabled={disabled}
            {...inputProps}
          />
        );
      }
      return (
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-control${lg ? " form-control-lg" : ""}`}
          {...(maxLength !== undefined && { maxLength: maxLength })}
          {...(minLength !== undefined && { minLength: minLength })}
          {...inputProps}
        />
      );
    },

    textarea: () => (
      <Input.TextArea
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        {...textAreaProps}
      />
    ),
    switch: () => (
      <Switch
        disabled={disabled}
        onChange={(checked) => onChange(name, checked)}
      />
    ),

    select: () => <Switch disabled={disabled} />,

    treeSelect: () => (
      <TreeSelect
        showSearch
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder={placeholder}
        allowClear
        treeDefaultExpandAll
        treeData={treeData}
        onChange={(val) => onChange(name, val)}
      />
    ),

    list: () => (
      <Input
        type={type}
        placeholder={`List input for ${placeholder}`}
        disabled={disabled}
        className={`form-control${lg ? " form-control-lg" : ""}`}
        {...inputProps}
      />
    ),
  };

  const renderInput = inputRenderMap[fieldType];

  return (
    <Form.Item
      name={name as NamePath}
      label={label}
      rules={rules}
      initialValue={initialValue}
    >
      {renderInput()}
    </Form.Item>
  );
};
