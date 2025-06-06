import {
  ChartMeta,
  ComponentMetaMap,
  DetailMeta,
  FormMeta,
  TableMeta,
} from "@xingine/core/component/component-meta-map.ts";
import React from "react";
import FormRenderer from "/@/lib/xingine-react/component/group/FormRenderer.tsx";
import TableRenderer from "/@/lib/xingine-react/component/group/TableRenderer.tsx";
import DetailRenderer from "/@/lib/xingine-react/component/group/DetailRenderer.tsx";
import { ChartRenderer } from "/@/lib/xingine-react/component/group/ChartRenderer.tsx";

export const rendererMap: Record<
  keyof ComponentMetaMap,
  React.FC<ComponentMetaMap[keyof ComponentMetaMap]>
> = {
  FormRenderer: FormRenderer,
  TableRenderer: TableRenderer,
  DetailRenderer: DetailRenderer,
  TabRenderer: TableRenderer,
  ChartRenderer: ChartRenderer,
};
