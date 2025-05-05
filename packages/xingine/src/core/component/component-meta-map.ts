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
  treeselect: TreeSelectTypeProperties;
  switch: SwitchTypeProperties;
  checkbox: CheckboxTypeProperties;
  date: DateTypeProperties;
  textarea: TextareaTypeProperties;
  button: ButtonTypeProperties;
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

export interface ColumnMeta {
  field: string;
  headerName: string;
}

export interface FormMeta {
  fields: FieldMeta[];
  action: string;
}

export interface TableMeta {
  columns: ColumnMeta[];
  dataSourceUrl: string;
}

export interface TabMeta {
  tabs: {
    label: string;
    component: keyof ComponentMetaMap;
    meta: ComponentMetaMap[keyof ComponentMetaMap];
  }[];
}

export interface DetailMeta {
  fields: FieldMeta[];
}

export type ComponentMetaMap = {
  FormRenderer: FormMeta;
  TableRenderer: TableMeta;
  TabRenderer: TabMeta;
  DetailRenderer: DetailMeta;
};

export interface ComponentMeta<
  T extends keyof ComponentMetaMap = keyof ComponentMetaMap,
> {
  component: T;
  properties: ComponentMetaMap[T];
}
