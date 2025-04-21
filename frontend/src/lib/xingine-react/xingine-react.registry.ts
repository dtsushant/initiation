import React, { FC, FunctionComponent, JSX } from "react";
import { ModulePropertyOptions } from "@xingine";

type ModuleRegistry = {
  modulePropertyOptions: ModulePropertyOptions[];
  component: Record<string, React.FC>;
};

class ModuleRegistryService {
  private modules: ModuleRegistry = {
    modulePropertyOptions: [],
    component: {},
  };
  private componentMap: Record<string, FunctionComponent<unknown>>;

  constructor(componentMap: Record<string, FunctionComponent<unknown>>) {
    this.componentMap = componentMap;
  }

  register(moduleProperty: ModulePropertyOptions) {
    const key = moduleProperty.uiComponent?.component;
    if (!key) return;

    const Component = this.componentMap[key];
    if (Component) {
      this.modules.component[key] = Component;
    } else {
      console.error(`Component '${key}' not found in component map.`);
      throw Error(`Component '${key}' not found in component map.`);
    }
    this.modules.modulePropertyOptions.push(moduleProperty);
  }

  get(name: string): JSX.Element | undefined {
    const Component = this.modules.component[name];
    if (!Component) return undefined;
    return React.createElement(Component);
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
