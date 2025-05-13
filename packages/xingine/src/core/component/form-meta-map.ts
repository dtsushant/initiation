// src/types/component-meta-map.ts

export interface InputTypeProperties {
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  email?: boolean;
}

export interface PasswordTypeProperties {
  placeholder?: string;
  minLength?: number;
  hasStrengthMeter?: boolean;
  disabled?: boolean;
}

export interface NumberTypeProperties {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
}

export interface SelectTypeProperties {
  options: { label: string; value: string }[];
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
export interface LookupTypeProperties {
  /**
   * API action or endpoint name that will return lookup options.
   * The response should be an array of `{ label: string, value: string }`.
   */
  fetchAction: string;

  /**
   * Whether multiple selections are allowed (like a multi-select).
   */
  multiple?: boolean;

  /**
   * Placeholder text for the input/select box.
   */
  placeholder?: string;

  /**
   * Whether the lookup is disabled.
   */
  disabled?: boolean;

  /**
   * Enables autocomplete or free-text input for searching.
   */
  allowSearch?: boolean;

  /**
   * If true, allows the user to create a new entry if not found.
   */
  allowAddNew?: boolean;

  /**
   * Optional field to specify what property the search query should match.
   * e.g., 'label' or 'code'
   */
  searchField?: string;

  /**
   * Optional debounce interval for search requests (in milliseconds).
   */
  debounce?: number;

  /**
   * If new option is added inline, this action will be triggered to persist it.
   */
  createAction?: string;

  /**
   * Optionally map the backend response to expected label/value structure.
   */
  resultMap?: {
    label: string;
    value: string;
  }[];
}

export interface TreeSelectTypeProperties {
  treeData: {
    title: string;
    value: string;
    children?: TreeSelectTypeProperties["treeData"];
  }[];
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface SwitchTypeProperties {
  checkedChildren?: string;
  unCheckedChildren?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

export interface CheckboxTypeProperties {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface DateTypeProperties {
  format?: string;
  showTime?: boolean;
  disabledDate?: (currentDate: string) => boolean;
  disabled?: boolean;
}

export interface TextareaTypeProperties {
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
}

export type ButtonView = "primary" | "default" | "dashed" | "link" | "text";
export interface ButtonTypeProperties {
  text: string;
  type?: ButtonView;
  disabled?: boolean;
  onClickAction?: string; // ID or name of action handler to be resolved at runtime
}
export type ObjectFieldProperties = {
  fields: FieldMeta[];
};

export type ObjectListFieldProperties = {
  itemFields: FieldMeta[];
};

export type FieldInputTypeProperties = {
  input: InputTypeProperties;
  password: PasswordTypeProperties;
  number: NumberTypeProperties;
  select: SelectTypeProperties;
  lookup: LookupTypeProperties;
  treeselect: TreeSelectTypeProperties;
  switch: SwitchTypeProperties;
  checkbox: CheckboxTypeProperties;
  date: DateTypeProperties;
  textarea: TextareaTypeProperties;
  button: ButtonTypeProperties;
  object: ObjectFieldProperties;
  "object[]": ObjectListFieldProperties;
};

export interface FieldMeta<
  T extends keyof FieldInputTypeProperties = keyof FieldInputTypeProperties,
> {
  name?: string;
  label: string;
  inputType: T;
  value?: string;
  required?: boolean;
  properties?: FieldInputTypeProperties[T];
}
