import {
  FieldMeta,
  ObjectFieldProperties,
  ObjectListFieldProperties,
} from "@xingine/core/component/component-meta-map.ts";
import { fieldTypeRenderMap } from "/@/lib/xingine-react/component/group/form/FormGroup.map.tsx";
import { Card, Form } from "antd";
import { NamePath } from "antd/es/form/interface";
import {
  generateRules,
  resolveComponentProps,
} from "/@/lib/xingine-react/component/group/form/FormGroup.utils.ts";
import React from "react";

export function formGroup(
  fields: FieldMeta[],
  isSubmitting: boolean,
  parentName: NamePath = [],
  callingField?: FieldMeta,
): React.ReactNode {
  return fields.map((field) => {
    const fullFieldName: NamePath = [...parentName, field.name];
    const FormField = fieldTypeRenderMap[field.inputType];
    const combinedProps = {
      ...field.properties,
      isSubmitting,
      parentName,
      label: field.label,
      name: fullFieldName,
    };
    console.log(
      "the combined name",
      parentName,
      combinedProps.name,
      fullFieldName,
    );

    // ✅ Use `object` field component from map
    if (field.inputType === "object") {
      return (
        <FormField
          key={field.name}
          {...(combinedProps as ObjectFieldProperties & {
            isSubmitting: boolean;
          })}
          callingField={field}
        />
      );
    }

    if (field.inputType === "object[]") {
      return (
        <Form.Item
          key={field.name}
          label={field.label}
          required={field.required}
        >
          <FormField
            {...(combinedProps as ObjectListFieldProperties & {
              isSubmitting: boolean;
            })}
            callingField={field}
          />
        </Form.Item>
      );
    }

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
        <FormField {...resolveComponentProps(field.inputType, combinedProps)} />
      </Form.Item>
    );
  });
}
