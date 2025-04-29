import React, { FC, FunctionComponent, JSX } from "react";
import { ModulePropertyOptions } from "@xingine";
import { ComponentMetaMap } from "@xingine/core/component/component-meta-map.ts";

type ModuleRegistry = {
  modulePropertyOptions: ModulePropertyOptions[];
  component: Record<
    string,
    {
      name: string;
      path: string;
      props?: ComponentMetaMap[keyof ComponentMetaMap];
      fc: React.FC<unknown>;
    }
  >;
};

class ModuleRegistryService {
  private modules: ModuleRegistry = {
    modulePropertyOptions: [],
    component: {},
  };
  private readonly componentMap: Record<string, FunctionComponent<unknown>>;

  constructor(componentMap: Record<string, FunctionComponent<unknown>>) {
    this.componentMap = componentMap;
  }

  register(moduleProperty: ModulePropertyOptions) {
    moduleProperty.uiComponent?.forEach((component) => {
      const key = component.component;
      const Component = this.componentMap[key];
      if (Component) {
        this.modules.component[key] = {
          name: key,
          path: component.path,
          props: component.meta,
          fc: Component,
        };
      } else {
        console.error(`Component '${key}' not found in component map.`);
        throw Error(`Component '${key}' not found in component map.`);
      }
      this.modules.modulePropertyOptions.push(moduleProperty);
    });
  }

  get(
    name: string,
    props?: ComponentMetaMap[keyof ComponentMetaMap],
  ): JSX.Element | undefined {
    const Component = this.modules.component[name];
    if (!Component) return undefined;
    console.log("the props here is", props);
    return React.createElement(Component.fc, props);
  }

  getAll(): ModuleRegistry {
    return this.modules;
  }
}

let instance: ModuleRegistryService | null = null;

export function initializeModuleRegistry(
  componentMap: Record<string, FunctionComponent<unknown>>,
) {
  if (instance) {
    throw new Error("ModuleRegistryService is already initialized");
  }
  instance = new ModuleRegistryService(componentMap);
}

export function getModuleRegistryService(): ModuleRegistryService | undefined {
  if (!instance) {
    return undefined;
  }
  return instance;
}
