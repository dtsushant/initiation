import { FieldMeta } from "@xingine/core/component/form-meta-map";
import { DetailFieldMeta } from "@xingine/core/component/detail-meta-map";

export type Method = "POST" | "GET";
export interface ColumnMeta {
  field: string;
  headerName: string;
}

export interface FormDispatchProperties {
  onSuccessRedirectTo?: {
    component: string;
  };
}

export interface TableDispatchProperties {
  onRowClickNavigateTo?: {
    component: string;
  };
  refreshAfterAction?: boolean;
}

export interface TabDispatchProperties {
  activateTab?: string;
}

export interface DetailDispatchProperties {
  scrollToField?: string;
}

export interface FormMeta {
  fields: FieldMeta[];
  action: string;
  dispatch?: FormDispatchProperties;
}

export interface DetailMeta {
  fields: DetailFieldMeta[];
  action: string;
  dispatch?: DetailDispatchProperties;
}

export interface TableMeta {
  columns: ColumnMeta[];
  dataSourceUrl: string;
  dispatch?: TableDispatchProperties;
}

export interface TabMeta {
  tabs: {
    label: string;
    component: keyof ComponentMetaMap;
    meta: ComponentMetaMap[keyof ComponentMetaMap];
  }[];
  dispatch?: TabDispatchProperties;
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
