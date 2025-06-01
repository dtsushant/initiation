import {
  LayoutMandate,
  ModuleProperties,
  ModulePropertyOptions,
  Panel,
  Permission,
  UIComponent,
} from "./xingine.type";
import {
  array,
  Decoder,
  either,
  object,
  optional,
  record,
  string,
  unknown,
} from "decoders";
import {
  ColumnMeta,
  ComponentMeta,
  ComponentMetaMap,
  TableMeta,
  TabMeta,
} from "@xingine/core/component/component-meta-map";
import { formMetaDecoder } from "@xingine/core/decoders/form.decoder";
import { detailMetaDecoder } from "@xingine/core/decoders/detail.decoder";
import { tableMetaDecoder } from "@xingine/core/decoders/table.decoder";
import { chartMetaDecoder } from "@xingine/core/decoders/chart.decoder";

const tabMetaDecoder: Decoder<TabMeta> = object({
  tabs: array(
    object({
      label: string,
      component: string,
      meta: unknown,
    }),
  ),
}).transform(
  (tabMeta) =>
    ({
      tabs: tabMeta.tabs.map((tab) => ({
        label: tab.label,
        component: tab.component,
        meta: decodeMetaByComponent(tab.component, tab.meta),
      })),
    }) as TabMeta,
);

function decodeMetaByComponent(component: string, input: unknown): object {
  switch (component) {
    case "FormRenderer":
      return formMetaDecoder.verify(input);
    case "TableRenderer":
      return tableMetaDecoder.verify(input);
    case "TabRenderer":
      return tabMetaDecoder.verify(input);
    case "DetailRenderer":
      return detailMetaDecoder.verify(input);
    case "ChartRenderer":
      return chartMetaDecoder.verify(input);
    default:
      throw new Error(
        `Unknown component type '${component}' for meta decoding`,
      );
  }
}

const componentMetaDecoderBase = object({
  component: string,
  properties: unknown,
});

export function componentMetaDecoder(): Decoder<ComponentMeta> {
  return componentMetaDecoderBase.transform((baseComponentMeta) => {
    const strictMeta = decodeMetaByComponent(
      baseComponentMeta.component,
      baseComponentMeta.properties,
    ) as ComponentMetaMap[keyof ComponentMetaMap];

    return { ...baseComponentMeta, properties: strictMeta } as ComponentMeta;
  });
}

export const panelDecoder: Decoder<Panel> = object({
  presidium: string,
  assembly: string,
  doctrine: string,
});

export const LayoutMandateDecoder: Decoder<LayoutMandate> = object({
  structure: panelDecoder,
  clearanceRequired: optional(array(string)),
});

export const uiComponentDecoderBase = object({
  component: string,
  path: string,
  layout: optional(LayoutMandateDecoder),
  icon: optional(string),
  roles: optional(array(string)),
  permissions: optional(array(string)),
  meta: optional(componentMetaDecoder()),
});

export function uiComponentDecoder(): Decoder<UIComponent> {
  return uiComponentDecoderBase.transform((uiComponentDecoderBase) => {
    const base = uiComponentDecoderBase;
    const defaultLayout: LayoutMandate = {
      structure: {
        presidium: "people",
        assembly: "people",
        doctrine: "people",
      },
      clearanceRequired: [],
    };

    return {
      ...base,
      layout: base.layout ?? defaultLayout,
    };
  });
}

const permissionDecoder: Decoder<Permission> = object({
  name: string,
  description: string,
});

// ModulePropertyOptions decoder
const modulePropertyOptionsDecoder: Decoder<ModulePropertyOptions> = object({
  description: optional(string),
  uiComponent: optional(array(uiComponentDecoder())),
  permissions: array(permissionDecoder),
});

export const modulePropertyOptionsListDecoder: Decoder<
  ModulePropertyOptions[]
> = array(modulePropertyOptionsDecoder);

export const modulePropertiesDecoder: Decoder<ModuleProperties> = object({
  name: string,
  uiComponent: optional(array(uiComponentDecoder())),
  permissions: array(permissionDecoder),
  description: optional(string),
});

export const modulePropertiesListDecoder: Decoder<ModuleProperties[]> = array(
  modulePropertiesDecoder,
);

export * from "./decoders/shared.decoder";
export * from "./decoders/form.decoder";
export * from "./decoders/detail.decoder";
