import React from "react";
import { Descriptions, Tag, Badge } from "antd";
import { DetailFieldMeta } from "@xingine/core/component/detail-meta-map.ts";
import { renderValue } from "/@/lib/xingine-react/component/group/detail/DetailGroup.map.tsx";
import { resolvePath } from "@xingine/core/utils/type.ts";

export function renderDetailFields(
  fields: DetailFieldMeta[],
  details: unknown,
  parentName: string[] = [],
): React.ReactNode {
  return (
    <Descriptions
      size="middle"
      bordered
      column={1}
      style={{ marginBottom: 24, background: "#fff", padding: 12 }}
    >
      {fields.map((field) => {
        const fullName = [...parentName, field.name].join(".");

        const value = renderValue(field, details, fullName);

        return (
          <Descriptions.Item key={fullName} label={field.label}>
            {value}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
}
