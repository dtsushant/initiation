import { renderDetailFields } from "/@/lib/xingine-react/component/group/detail/DetailGroup.tsx";
import {
  DetailFieldMeta,
  DetailInputTypeProperties,
} from "xingine/dist/core/component/detail-meta-map";
import { resolvePath } from "xingine";
import { Badge } from "antd";
import React from "react";

export function renderValue(
  field: DetailFieldMeta,
  detailValue: unknown,
  fullName: string,
): React.ReactNode {
  const { inputType, properties } = field;
  const value = resolvePath(detailValue, fullName);
  console.log("the fullname and the inputTpye here is ", fullName, inputType);

  switch (inputType) {
    case "text":
      return String(value);

    case "date":
      return String(value); //formatDate(value, (properties as DetailInputTypeProperties['date'])?.format);

    case "select": {
      /*const opts = (properties as DetailInputTypeProperties['select'])?.options ?? [];
            const found = opts.find((opt) => opt.value === value);
            return found?.label ?? value ?? '-';*/
      return String(value ?? "");
    }

    case "switch": {
      const active =
        (properties as DetailInputTypeProperties["switch"])?.activeLabel ??
        "Yes";
      const inactive =
        (properties as DetailInputTypeProperties["switch"])?.inactiveLabel ??
        "No";
      return value ? active : inactive;
    }

    case "checkbox": {
      const label =
        (properties as DetailInputTypeProperties["checkbox"])?.label ?? "✓";
      return value ? label : "—";
    }

    case "number": {
      const {
        precision,
        prefix = "",
        suffix = "",
      } = (properties as DetailInputTypeProperties["number"]) ?? {};

      const num = typeof value === "number" ? value : Number(value);
      return `${prefix}${num.toFixed(precision ?? 0)}${suffix}`;
    }

    case "badge": {
      const badgeProps = properties as DetailInputTypeProperties["badge"];
      return (
        <Badge
          status={badgeProps?.status ?? "default"}
          text={badgeProps?.text ?? value}
        />
      );
    }

    case "tag": {
      const tagProps = properties as DetailInputTypeProperties["tag"];
      // return <Tag color={tagProps?.color}>{String(value ?? '')}</Tag>;
      return String(value ?? "");
    }

    case "object": {
      const { fields } = properties as DetailInputTypeProperties["object"];
      // return {renderDetailFields(fields, [field.name])}</div>;
      return renderDetailFields(fields, detailValue, [field.name]);
    }

    case "object[]": {
      const { itemFields } =
        properties as DetailInputTypeProperties["object[]"];
      const items = Array.isArray(value) ? value : [];

      /*return (
                <>
                    {items.map((item, idx) => (
                        <div
                            key={`${field.name}-${idx}`}
                            style={{ marginBottom: 16, marginLeft: 16, padding: 12, background: '#f9f9f9' }}
                        >
                            {renderDetailFields(
                                itemFields.map((f) => ({
                                    ...f,
                                    value: (item as any)[f.name],
                                })),
                                [field.name, String(idx)]
                            )}
                        </div>
                    ))}
                </>
            );*/
      return String(value ?? "");
    }

    default:
      return String(value ?? "");
  }
}
