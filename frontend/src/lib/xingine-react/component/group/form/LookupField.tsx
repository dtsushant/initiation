import { Input, Select, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { NamePath } from "antd/es/form/interface";
import type { Decoder } from "decoders";
import { LookupTypeProperties } from "@xingine/core/component/component-meta-map.ts";
import { array, object, string } from "decoders";
import { get, post } from "/@/lib/xingine-react/xingine-react.service.ts";

type OptionType = { label: string; value: string };

const optionTypeDecoder: Decoder<OptionType> = object({
  label: string,
  value: string,
});

const optionTypeListDecoder: Decoder<OptionType[]> = array(optionTypeDecoder);
export interface LookupFieldProps extends LookupTypeProperties {
  value?: string | string[];
  onChange?: (value: any) => void;
  isSubmitting?: boolean;
  parentName?: NamePath;
  label?: string;
  name?: string;
}

export function resolveMappedOption(
  option: Record<string, unknown>,
  resultMap?: LookupTypeProperties["resultMap"],
): { label: string; value: string } {
  if (!resultMap || resultMap.length === 0) {
    return {
      label: String(option.label ?? option.value ?? ""),
      value: String(option.value ?? ""),
    };
  }

  for (const map of resultMap) {
    const labelCandidate = option[map.label];
    const valueCandidate = option[map.value];

    if (labelCandidate !== undefined && valueCandidate !== undefined) {
      return {
        label: String(labelCandidate),
        value: String(valueCandidate),
      };
    }
  }

  // fallback if nothing matched
  return {
    label: String(option.label ?? option.value ?? ""),
    value: String(option.value ?? ""),
  };
}

const createResponseDecoder = object({
  label: string,
  value: string,
});

export interface LookupFieldProps extends LookupTypeProperties {
  value?: string | string[];
  onChange?: (value: any) => void;
  isSubmitting?: boolean;
  parentName?: NamePath;
  label?: string;
  name?: string;
  //fetchDecoder?: Decoder<TLookupRes[]>;
}

export const LookupField: React.FC<LookupFieldProps> = (props) => {
  const {
    value,
    onChange,
    isSubmitting,
    parentName,
    label,
    name,
    fetchAction,
    multiple,
    placeholder,
    disabled,
    allowSearch,
    debounce = 300,
    allowAddNew,
    createAction,
    resultMap,
    searchField = "q",
    //fetchDecoder,
  } = props;

  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (query?: string) => {
    /* console.log("calling fetch options", fetchDecoder);
        if (!fetchDecoder) return;*/
    setLoading(true);
    /*<TLookupRes extends object = Record<string, unknown>>*/

    try {
      const url = query
        ? `${fetchAction}?${searchField}=${encodeURIComponent(query)}`
        : fetchAction;
      console.log("the url fetch", url, fetchAction);

      const result = await get(optionTypeListDecoder, url);
      const parsed: OptionType[] = result.map((item) =>
        resolveMappedOption(item as Record<string, unknown>, resultMap),
      );

      setOptions(parsed);
    } catch (error) {
      console.error("Failed to fetch options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOptions = useDebouncedCallback((val: string) => {
    fetchOptions(val);
  }, debounce);

  const handleAddOption = async (input: string) => {
    if (!createAction || !allowAddNew || !input) return;

    const result = await post<
      { label: string },
      { label: string; value: string }
    >({ label: input }, createResponseDecoder, createAction);

    if (result.ok) {
      const newItem = resolveMappedOption(result.val, resultMap);
      setOptions((prev) => [...prev, newItem]);
      onChange?.(
        multiple ? [...(value as string[]), newItem.value] : newItem.value,
      );
    } else {
      console.error("Failed to create lookup item:", result.val);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const tagRender = (tag: any) => {
    return (
      <Tag
        color="blue"
        closable={tag.closable}
        onClose={tag.onClose}
        style={{ marginRight: 3 }}
      >
        {tag.label}
      </Tag>
    );
  };
  console.log(" rendering the lookup type", allowAddNew);
  return (
    <Select
      showSearch={allowSearch}
      mode={multiple ? "multiple" : undefined}
      value={value}
      disabled={disabled || isSubmitting}
      placeholder={placeholder}
      loading={loading}
      filterOption={false}
      onSearch={debouncedFetchOptions}
      onChange={onChange}
      tagRender={tagRender}
      notFoundContent={loading ? <Spin size="small" /> : "No options"}
      onBlur={() => setLoading(false)}
      onSelect={(val) => {
        if (allowAddNew && !options.some((o) => o.value === val)) {
          handleAddOption(val as string);
        }
      }}
      options={options}
    />
  );
};
