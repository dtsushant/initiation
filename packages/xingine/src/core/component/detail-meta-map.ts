export interface TextDetailProperties {
  placeholder?: string;
}

export interface DateDetailProperties {
  format?: string;
}

export interface SelectDetailProperties {
  options?: { label: string; value: string }[];
  fallback?: string;
}

export interface SwitchDetailProperties {
  activeLabel?: string;
  inactiveLabel?: string;
}

export interface CheckboxDetailProperties {
  label?: string;
}

export interface NumberDetailProperties {
  precision?: number;
  suffix?: string;
  prefix?: string;
}

export type Badge = "success" | "processing" | "error" | "default" | "warning";
export interface BadgeDetailProperties {
  status?: Badge;
  text?: string;
}

export interface TagDetailProperties {
  color?: string;
}

export interface ObjectDetailProperties {
  fields: DetailFieldMeta[];
}

export interface ObjectArrayDetailProperties {
  itemFields: DetailFieldMeta[];
}

export type DetailInputTypeProperties = {
  text: TextDetailProperties;
  date: DateDetailProperties;
  select: SelectDetailProperties;
  switch: SwitchDetailProperties;
  checkbox: CheckboxDetailProperties;
  number: NumberDetailProperties;
  badge: BadgeDetailProperties;
  tag: TagDetailProperties;
  object: ObjectDetailProperties;
  "object[]": ObjectArrayDetailProperties;
};
export interface DetailFieldMeta<
  T extends keyof DetailInputTypeProperties = keyof DetailInputTypeProperties,
> {
  name?: string;
  label: string;
  inputType: T;
  value?: unknown;
  properties?: DetailInputTypeProperties[T];
}
