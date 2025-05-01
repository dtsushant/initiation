import React from "react";
import { FieldMeta } from "@xingine/core/component/component-meta-map.ts";
import { Form } from "antd";
import { NamePath } from "antd/es/form/interface";
import { generateRules } from "/src/lib/xingine-react/component/group/form/FormGroup.utils.ts";
import { fieldTypeRenderMap } from "/@/lib/xingine-react/component/group/form/FormGroup.map.tsx";

export const FormGroup: React.FC<{ field: FieldMeta }> = ({ field }) => {
  const FormField = fieldTypeRenderMap[field.inputType];
  return (
    <Form.Item
      key={field.name}
      name={field.name as NamePath}
      label={field.label}
      rules={generateRules(field, field.properties)} // you must pass field.properties here
    >
      <FormField {...field.properties} />
    </Form.Item>
  );
};
