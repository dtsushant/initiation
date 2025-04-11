import React, { JSX } from "react";
import { Form, Input } from "antd";
import type { NamePath } from "antd/es/form/interface";
import { GenericFormField } from "/@/types/genericFormField.tsx";

export const FormGroup: React.FC<{ props: GenericFormField }> = ({ props }) => {
  const {
    type,
    name,
    label,
    fieldType,
    rules,
    value,
    placeholder,
    disabled,
    lg,
    inputProps,
    textAreaProps,
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
            value={value}
            {...inputProps}
          />
        );
      }
      return (
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={`form-control${lg ? " form-control-lg" : ""}`}
          {...inputProps}
        />
      );
    },

    textarea: () => (
      <Input.TextArea
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        rows={4}
        {...textAreaProps}
      />
    ),

    list: () => (
      <Input
        type={type}
        placeholder={`List input for ${placeholder}`}
        disabled={disabled}
        value={value}
        className={`form-control${lg ? " form-control-lg" : ""}`}
        {...inputProps}
      />
    ),
  };

  const renderInput = inputRenderMap[fieldType];

  return (
    <Form.Item name={name as NamePath} label={label} rules={rules}>
      {renderInput()}
    </Form.Item>
  );
};
