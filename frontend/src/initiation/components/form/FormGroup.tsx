import {
  fieldTypeRenderMap,
  ObjectFieldProps,
  renderField,
} from "./FormGroup.map";
import { Card, Form } from "antd";
import { NamePath } from "antd/es/form/interface";
import { generateRules, resolveComponentProps } from "./FormGroup.utils";
import React from "react";
import {
  FieldInputTypeProperties,
  FieldMeta,
  ObjectFieldProperties,
  ObjectListFieldProperties,
} from "xingine";

export function formGroup(
  fields: FieldMeta[],
  isSubmitting: boolean,
  parentName: NamePath = [],
  callingField?: FieldMeta,
): React.ReactNode {
  return fields.map((field) => {
    const fullFieldName: NamePath = [...parentName, field.name];
    const combinedProps = {
      ...field.properties,
      isSubmitting,
      parentName,
      label: field.label,
      name: fullFieldName,
    };

    // Object (Nested Form Group)
    if (field.inputType === "object") {
      return renderField("object", {
        ...combinedProps,
        callingField: field,
      } as ObjectFieldProps);
    }

    // Object List
    if (field.inputType === "object[]") {
      return (
        <Form.Item
          key={field.name}
          label={field.label}
          required={field.required}
        >
          {renderField("object[]", {
            ...combinedProps,
          } as ObjectListFieldProperties)}
        </Form.Item>
      );
    }

    // Standard Inputs
    return (
      <Form.Item
        key={field.name}
        name={fullFieldName}
        label={field.label}
        rules={generateRules(field, field.properties)}
        initialValue={field.value}
        {...(field.inputType === "checkbox"
          ? { valuePropName: "checked" }
          : {})}
      >
        {renderField(
          field.inputType as keyof FieldInputTypeProperties,
          combinedProps,
        )}
      </Form.Item>
    );
  });
}
