import {
  array,
  Decoder,
  object,
  oneOf,
  optional,
  string,
  unknown,
} from "decoders";
import {
  ButtonView,
  ChartConfig,
  ChartDataset,
  ChartMeta,
  ChartType,
} from "@xingine/core/component/component-meta-map";

const chartDatasetDecoderBase = object({
  label: string,
  data: array(unknown), // number[] or {x, y}[]
  backgroundColor: optional(string),
  borderColor: optional(string),
});

export function chartDatasetDecoder(): Decoder<ChartDataset> {
  return chartDatasetDecoderBase.transform((chartDatasetDecoderBase) => {
    return chartDatasetDecoderBase as ChartDataset;
  });
}

export const chartTypeDecoder: Decoder<ChartType> = oneOf([
  "bar",
  "line",
  "pie",
  "scatter",
]);
export const chartConfigDecoder: Decoder<ChartConfig> = object({
  type: chartTypeDecoder,
  title: optional(string),
  labels: optional(array(string)),
  datasets: optional(array(chartDatasetDecoder())),
  dataSourceUrl: optional(string),
  options: optional(object({})),
});

export const chartMetaDecoder: Decoder<ChartMeta> = object({
  charts: array(chartConfigDecoder),
});
