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
): React.ReactNode {
  return fields.map((field) => {
    const fullFieldName: NamePath = [...parentName, field.name];
    const FormField = fieldTypeRenderMap[field.inputType];
    const combinedProps = {
      ...field.properties,
      isSubmitting,
    };

    /*if (field.inputType === "object") {
      const nestedFields = (field.properties as ObjectFieldProperties).fields;
      return (
        <Card
          key={field.name}
          title={field.label}
          size="small"
          style={{ marginBottom: 16, background: "#fafafa", borderRadius: 8 }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {formGroup(nestedFields, isSubmitting, fullFieldName)}
          </div>
        </Card>
      );
    }

    if (field.inputType === "object[]") {
      const itemFields = (field.properties as ObjectListFieldProperties)
        .itemFields;
      return (
        <Card
          key={field.name}
          title={field.label}
          size="small"
          style={{ marginBottom: 16, background: "#f6f6ff", borderRadius: 8 }}
        >
          <Form.List name={fullFieldName} key={field.name}>
            {(fields, { add, remove }) => (
              <div style={{ marginBottom: 16 }}>
                <h4>{field.label}</h4>
                {fields.map((fieldMeta, index) => (
                  <div
                    key={fieldMeta.key}
                    style={{
                      marginBottom: 16,
                      padding: 16,
                      border: "1px dashed #ccc",
                    }}
                  >
                    {formGroup(itemFields, isSubmitting, [
                      ...fullFieldName,
                      index,
                    ])}
                    <Form.Item>
                      <button
                        type="button"
                        onClick={() => remove(fieldMeta.name)}
                      >
                        Remove
                      </button>
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <button type="button" onClick={() => add()}>
                    Add {field.label}
                  </button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Card>
      );
    }*/
    // ✅ Use `object` field component from map
    if (field.inputType === "object") {
      return (
        <FormField
          key={field.name}
          {...(combinedProps as ObjectFieldProperties & {
            isSubmitting: boolean;
          })}
        />
      );
    }

    // ✅ Use `object[]` field component from map (usually renders Form.List)
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
