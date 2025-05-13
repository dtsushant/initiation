import {
  array,
  Decoder,
  number,
  object,
  oneOf,
  optional,
  string,
  unknown,
} from "decoders";
import {
  Badge,
  BadgeDetailProperties,
  CheckboxDetailProperties,
  DateDetailProperties,
  DetailFieldMeta,
  NumberDetailProperties,
  ObjectArrayDetailProperties,
  ObjectDetailProperties,
  SelectDetailProperties,
  SwitchDetailProperties,
  TagDetailProperties,
  TextDetailProperties,
} from "../component/detail-meta-map";
import { DetailMeta } from "@xingine/core/component/component-meta-map";
import { dynamicShapeDecoder } from "./shared.decoder";

export const textDetailDecoder: Decoder<TextDetailProperties> = object({
  placeholder: optional(string),
});

export const dateDetailDecoder: Decoder<DateDetailProperties> = object({
  format: optional(string),
});

// ✅ Select
export const selectDetailDecoder: Decoder<SelectDetailProperties> = object({
  options: optional(array(object({ label: string, value: string }))),
  fallback: optional(string),
});

// ✅ Switch
export const switchDetailDecoder: Decoder<SwitchDetailProperties> = object({
  activeLabel: optional(string),
  inactiveLabel: optional(string),
});

// ✅ Checkbox
export const checkboxDetailDecoder: Decoder<CheckboxDetailProperties> = object({
  label: optional(string),
});

// ✅ Number
export const numberDetailDecoder: Decoder<NumberDetailProperties> = object({
  precision: optional(number),
  prefix: optional(string),
  suffix: optional(string),
});

const buttonViewDecoder: Decoder<Badge> = oneOf([
  "success",
  "processing",
  "error",
  "default",
  "warning",
]);
export const badgeDetailDecoder: Decoder<BadgeDetailProperties> = object({
  status: optional(buttonViewDecoder),
  text: optional(string),
});

export const tagDetailDecoder: Decoder<TagDetailProperties> = object({
  color: optional(string),
});

/*
const fieldMetaDecoderBase = object({
    name: string,
    label: string,
    inputType: string,
    required: optional(boolean),
    value: optional(string),
    properties: optional(unknown),
});

function fieldMetaDecoder(): Decoder<FieldMeta> {
    return fieldMetaDecoderBase.transform((baseFieldMeta) => {
        const strictMeta = decodeFieldInputPropertiesByInputType(
            baseFieldMeta.inputType,
            baseFieldMeta.properties,
        );
        return { ...baseFieldMeta, properties: strictMeta } as FieldMeta;
    });
}

name: string;
    label: string;
    inputType: T;
    value: unknown;
    properties?: DetailInputTypeProperties[T];
 */

const detailMetaDecoderBase = object({
  label: string,
  inputType: string,
  value: optional(dynamicShapeDecoder),
  properties: optional(unknown),
});

function detailFieldMetaDecoder(): Decoder<DetailFieldMeta> {
  return detailMetaDecoderBase.transform((baseDetailMeta) => {
    console.log("the baseDetailMeta", baseDetailMeta);
    const inputType =
      baseDetailMeta.inputType as keyof typeof detailPropertyDecoderMap;
    const decoder = detailPropertyDecoderMap[inputType];
    const strictMeta = decoder.verify(baseDetailMeta.properties);

    return { ...baseDetailMeta, properties: strictMeta } as DetailFieldMeta;
  });
}

export const objectDetailDecoder: Decoder<ObjectDetailProperties> = object({
  fields: array(detailFieldMetaDecoder()).transform((f) => f ?? []),
});

export const objectArrayDetailDecoder: Decoder<ObjectArrayDetailProperties> =
  object({
    itemFields: array(detailFieldMetaDecoder()).transform((f) => f ?? []),
  });

export const detailPropertyDecoderMap = {
  text: textDetailDecoder,
  date: dateDetailDecoder,
  select: selectDetailDecoder,
  switch: switchDetailDecoder,
  checkbox: checkboxDetailDecoder,
  number: numberDetailDecoder,
  badge: badgeDetailDecoder,
  tag: tagDetailDecoder,
  object: objectDetailDecoder,
  "object[]": objectArrayDetailDecoder,
};

export const detailMetaDecoder: Decoder<DetailMeta> = object({
  fields: array(detailFieldMetaDecoder()).transform((f) => f ?? []),
  action: string,
});
