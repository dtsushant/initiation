import "reflect-metadata";
import { ModuleProperties, ModulePropertyOptions } from "./xingine.type";

export const MODULE_PROPERTY_METADATA_KEY = "custom:module-property";

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
