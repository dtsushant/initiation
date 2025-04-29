import { Card, DatePicker, Form, Input, InputNumber, Select } from "antd";
import {
  FieldMeta,
  FormMeta,
} from "@xingine/core/component/component-meta-map.ts";
import React from "react";

const FormRenderer: React.FC<FormMeta> = (meta) => {
  const [form] = Form.useForm();
  console.log("the meta here is ", meta);
  const renderField = (field: FieldMeta) => {
    switch (field.inputType) {
      case "text":
      case "input":
        return <Input />;
      case "password":
        return <Input.Password />;
      case "number":
        return <InputNumber style={{ width: "100%" }} />;
      case "date":
        return <DatePicker style={{ width: "100%" }} />;
      case "textarea":
        return <Input.TextArea rows={4} />;

      default:
        return <Input />;
    }
  };

  return (
    <Card style={{ margin: 24 }}>
      <Form form={form} layout="vertical">
        {meta.fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={
              field.required
                ? [{ required: true, message: `${field.label} is required` }]
                : []
            }
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>
    </Card>
  );
};

export default FormRenderer;
