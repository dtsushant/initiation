import {
  FieldInputTypeProperties,
  FieldMeta,
} from "@xingine/core/component/form-meta-map";
import { DetailFieldMeta } from "@xingine/core/component/detail-meta-map";
import { Operator } from "@xingine/core/expressions/operators";

export type Method = "POST" | "GET";
export interface ColumnMeta {
  title?: string;
  dataIndex?: string;
  key?: string;
  render?: string; // optional: string name of render function
  width?: number | string;
  sortable?: boolean;
  filterable?: {
    apply?: boolean;
    operator?: Operator;
    inputType?: keyof FieldInputTypeProperties;
    searchFieldKey?: string;
  };
}

export interface FormDispatchProperties {
  formSubmissionResponse: unknown;
  onSuccessRedirectTo?: {
    component: string;
    payloadNamePath?: Record<string, string>;
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
  rowKey?: string;
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
  ChartRenderer: ChartMeta;
};

export type ChartType = "bar" | "line" | "pie" | "scatter";

export interface ChartDataset {
  label: string;
  data: number[] | { x: number | string; y: number }[];
  backgroundColor?: string;
  borderColor?: string;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  labels?: string[];
  datasets?: ChartDataset[];
  options?: Record<string, unknown>;
  dataSourceUrl?: string;
}

export interface ChartMeta {
  charts: ChartConfig[];
}

export interface ComponentMeta<
  T extends keyof ComponentMetaMap = keyof ComponentMetaMap,
> {
  component: T;
  properties: ComponentMetaMap[T];
}

export * from "./form-meta-map";
