import { ModulePropertyOptions, UIComponent } from "./xingine.type";
import { array, Decoder, dict, object, optional, string } from "decoders";

export const uiComponentDecoder: Decoder<UIComponent> = object({
  component: string,
  path: string,
  icon: optional(string),
  roles: optional(array(string)),
  permissions: optional(array(string)),
  meta: optional(dict(object({}))),
});

export const modulePropertyOptionsDecoder: Decoder<ModulePropertyOptions> =
  object({
    uiComponent: optional(uiComponentDecoder),
  });

export const modulePropertyOptionsListDecoder: Decoder<
  ModulePropertyOptions[]
> = array(modulePropertyOptionsDecoder);
