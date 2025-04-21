import React, { FunctionComponent } from "react";
import { ModulePropertyOptions } from "@xingine";
import {
  getModuleRegistryService,
  initializeModuleRegistry,
} from "/@/lib/xingine-react/xingine-react.registry.ts";
export function registerModule(
  componentDefinitions: ModulePropertyOptions[],
  componentMap: Record<string, FunctionComponent<unknown>>,
) {
  initializeModuleRegistry(componentMap);
  componentDefinitions.forEach((def) => {
    console.log("the def ===>>", def);
    getModuleRegistryService()!.register(def);
  });
}
