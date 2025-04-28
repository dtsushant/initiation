// src/types/component-meta-map.ts

export type FieldInputType =
  | "text"
  | "input"
  | "password"
  | "number"
  | "select"
  | "date"
  | "textarea";

export interface FieldMeta {
  name: string;
  label: string;
  inputType: FieldInputType;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface ColumnMeta {
  field: string;
  headerName: string;
}

export interface FormMeta {
  fields: FieldMeta[];
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
