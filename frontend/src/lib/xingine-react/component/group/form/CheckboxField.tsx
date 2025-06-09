import React, { forwardRef, useEffect, useState } from "react";
import { Checkbox, CheckboxChangeEvent, CheckboxRef, Spin } from "antd";

import { get } from "/@/lib/xingine-react/xingine-react.service.ts";
import {
  CheckboxOption,
  CheckboxTypeProperties,
} from "xingine/dist/core/component/form-meta-map";
import { checkboxOptionListDecoder } from "xingine";

interface CheckboxGroupFieldProps extends CheckboxTypeProperties {
  value: string[];
  onChange?: (val: boolean | string[]) => void;
  isSubmitting?: boolean;
}
export const CheckboxField: React.FC<CheckboxGroupFieldProps> = (props) => {
  console.log("the props here is ", props);

  const {
    value,
    onChange,
    isSubmitting,
    fetchAction,
    options = [],
    label,
    checked,
    disabled,
    direction = "vertical",
  } = props;

  const [resolvedOptions, setResolvedOptions] =
    useState<CheckboxOption[]>(options);
  const [loading, setLoading] = useState<boolean>(false);

  const isGroupMode = fetchAction || options.length > 0;

  // Fetch if needed
  useEffect(() => {
    if (!fetchAction) return;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await get<CheckboxOption[]>(
          checkboxOptionListDecoder,
          fetchAction,
        );
        setResolvedOptions(data); // assume valid CheckboxOption[]
      } catch (err) {
        console.error("Failed to fetch checkbox options:", err);
        setResolvedOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [fetchAction]);

  if (loading) return <Spin size="small" />;

  if (isGroupMode) {
    return (
      <Checkbox.Group
        options={resolvedOptions}
        onChange={(val) => onChange?.(val)}
        disabled={disabled || isSubmitting}
        style={{
          display: "flex",
          flexDirection: direction === "horizontal" ? "row" : "column",
          gap: 8,
        }}
      />
    );
  }

  return (
    <Checkbox
      onChange={(e: CheckboxChangeEvent) => onChange?.(e.target.checked)}
      disabled={disabled || isSubmitting}
    >
      {label}
    </Checkbox>
  );
};
