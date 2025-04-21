import "reflect-metadata";
import { ModulePropertyOptions } from "./xingine.type";

export const MODULE_PROPERTY_METADATA_KEY = "custom:module-property";

export function ModuleProperty(options: ModulePropertyOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_PROPERTY_METADATA_KEY, options, target);
  };
}

export function getModulePropertyMetadata<T extends object>(
  moduleClass: new (...args: []) => T,
): ModulePropertyOptions | undefined {
  return Reflect.getMetadata(MODULE_PROPERTY_METADATA_KEY, moduleClass) as
    | ModulePropertyOptions
    | undefined;
}
