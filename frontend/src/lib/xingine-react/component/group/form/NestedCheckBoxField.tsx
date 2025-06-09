import React, { useEffect, useState } from "react";
import { Checkbox, Spin } from "antd";
import { get } from "/@/lib/xingine-react/xingine-react.service.ts";
import {
  NestedCheckboxOption,
  NestedCheckboxTypeProperties,
} from "xingine/dist/core/component/form-meta-map";
import { nestedCheckboxOptionListDecoder } from "xingine";

interface NestedCheckboxGroupFieldProps extends NestedCheckboxTypeProperties {
  value: string[];
  onChange?: (val: boolean | string[]) => void;
  isSubmitting?: boolean;
}
export const NestedCheckboxField: React.FC<NestedCheckboxGroupFieldProps> = (
  props,
) => {
  const {
    value = [],
    onChange,
    isSubmitting,
    fetchAction,
    options = [],
    disabled,
    direction = "vertical",
  } = props;

  const [treeData, setTreeData] = useState<NestedCheckboxOption[]>(options);
  const [loading, setLoading] = useState<boolean>(!!fetchAction);
  const [checkedList, setCheckedList] = useState<string[]>(value);

  // useEffect(() => setCheckedList(value), [value]);

  useEffect(() => {
    if (!fetchAction) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await get<NestedCheckboxOption[]>(
          nestedCheckboxOptionListDecoder,
          fetchAction,
        );
        setTreeData(res); // assumes correct structure from backend
      } catch (err) {
        console.error("Failed to fetch nested checkbox data:", err);
        setTreeData([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [fetchAction]);

  if (loading) return <Spin size="small" />;

  const renderNode = (node: NestedCheckboxOption) => {
    const all = collectAllValues([node]);
    const checkedCount = all.filter((v) => checkedList.includes(v)).length;
    const fullyChecked = checkedCount === all.length;
    const indeterminate = checkedCount > 0 && !fullyChecked;

    return (
      <div key={node.value} style={{ marginLeft: 16, marginTop: 4 }}>
        <Checkbox
          checked={fullyChecked}
          indeterminate={indeterminate}
          disabled={disabled || node.disabled || isSubmitting}
          onChange={(e) => {
            const next = new Set(checkedList);
            const targets = collectAllValues([node]);
            targets.forEach((v) =>
              e.target.checked ? next.add(v) : next.delete(v),
            );
            const updated = Array.from(next);
            setCheckedList(updated);
            onChange?.(updated);
          }}
        >
          {node.label}
        </Checkbox>
        {node.children?.map(renderNode)}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
      }}
    >
      {treeData.map(renderNode)}
    </div>
  );
};
function collectAllValues(nodes: NestedCheckboxOption[]): string[] {
  const list: string[] = [];
  const walk = (arr: NestedCheckboxOption[]) => {
    arr.forEach((n) => {
      list.push(n.value);
      if (n.children?.length) walk(n.children);
    });
  };
  walk(nodes);
  return list;
}
