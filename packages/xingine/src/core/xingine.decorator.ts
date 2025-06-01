import "reflect-metadata";
import {
  CommissarProperties,
  ModuleProperties,
  ModulePropertyOptions,
  Provisioneer,
  ProvisioneerProperties,
} from "./xingine.type";
import { Constructor } from "@xingine/core/utils/type";
import {
  ColumnMeta,
  FieldMeta,
  FormMeta,
} from "@xingine/core/component/component-meta-map";
import { DetailFieldMeta } from "@xingine/core/component/detail-meta-map";

export const MODULE_PROPERTY_METADATA_KEY = "custom:module-property";
export const PROVISIONEER_METADATA = "xingine:provisioneer";
export const FORM_FIELD_METADATA = "xingine:form-field";
export const DETAIL_FIELD_METADATA = "xingine:detail-field";
export const COLUMN_PROPERTY_METADATA = "xingine:column-property";

/**
 *A @Provisioneer is a service controller that acts as a centralized,state-assigned provision handler.
 * It exposes a defined set of provision points (actions), each governed by a @Commissar, representing specific state-sanctioned duties.
 * The Provisioneer is not autonomous in defining its functional intent;
 * instead, it operates strictly under system-defined allocations and routes.
 */
export function Provisioneer(options: Provisioneer): ClassDecorator {
  return (target) => {
    const finalOptions: Provisioneer = {
      ...options,
      name: options.name ?? target.name,
    };
    Reflect.defineMetadata(PROVISIONEER_METADATA, finalOptions, target);
  };
}

export function getProvisioneerProperties(
  controllerClass: Constructor,
): ProvisioneerProperties | undefined {
  return Reflect.getMetadata(PROVISIONEER_METADATA, controllerClass) as
    | ProvisioneerProperties
    | undefined;
}

export function ModuleProperty(options: ModulePropertyOptions): ClassDecorator {
  return (target) => {
    const finalOptions: ModuleProperties = {
      ...options,
      name: target.name,
    };
    Reflect.defineMetadata(MODULE_PROPERTY_METADATA_KEY, finalOptions, target);
  };
}

export function getModulePropertyMetadata<T extends object>(
  moduleClass: new (...args: []) => T,
): ModuleProperties | undefined {
  return Reflect.getMetadata(MODULE_PROPERTY_METADATA_KEY, moduleClass) as
    | ModuleProperties
    | undefined;
}

export function FormField(meta: FieldMeta): PropertyDecorator {
  return (target, propertyKey) => {
    const existing: FieldMeta[] =
      Reflect.getMetadata(FORM_FIELD_METADATA, target.constructor) || [];
    meta.name = propertyKey.toString(); // ensure name is always set
    Reflect.defineMetadata(
      FORM_FIELD_METADATA,
      [...existing, meta],
      target.constructor,
    );
  };
}

export function generateFormMeta(dtoClass: new () => any): FormMeta {
  const fields: FieldMeta[] =
    Reflect.getMetadata(FORM_FIELD_METADATA, dtoClass) || [];
  return {
    action: "",
    fields,
  };
}

export function DetailField(meta: DetailFieldMeta): PropertyDecorator {
  return (target, propertyKey) => {
    const existing: DetailFieldMeta[] =
      Reflect.getMetadata(DETAIL_FIELD_METADATA, target.constructor) || [];
    meta.name = propertyKey.toString(); // ensure name is always set
    Reflect.defineMetadata(
      DETAIL_FIELD_METADATA,
      [...existing, meta],
      target.constructor,
    );
  };
}

export function ColumnProperty(meta: ColumnMeta): PropertyDecorator {
  return (target, propertyKey) => {
    const existing: ColumnMeta[] =
      Reflect.getMetadata(COLUMN_PROPERTY_METADATA, target.constructor) || [];
    meta.title = propertyKey.toString();
    meta.dataIndex = propertyKey.toString();
    Reflect.defineMetadata(
      COLUMN_PROPERTY_METADATA,
      [...existing, meta],
      target.constructor,
    );
  };
}
