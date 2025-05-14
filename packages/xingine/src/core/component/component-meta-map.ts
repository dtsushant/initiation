import { FieldMeta } from "@xingine/core/component/form-meta-map";
import { DetailFieldMeta } from "@xingine/core/component/detail-meta-map";

export type Method = "POST" | "GET";
export interface ColumnMeta {
  field: string;
  headerName: string;
}

export interface FormMeta {
  fields: FieldMeta[];
  action: string;
}

export interface DetailMeta {
  fields: DetailFieldMeta[];
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

export * from "./form-meta-map";
