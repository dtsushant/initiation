import React, { FC, FunctionComponent } from "react";
import { ModulePropertyOptions } from "@xingine";
import {
  getModuleRegistryService,
  initializeModuleRegistry,
} from "/@/lib/xingine-react/xingine-react.registry.ts";
import { XingineConfig } from "/@/lib/xingine-react/configuration/Configuration";
import { defaultInternalComponents } from "/@/lib/xingine-react/component/group";
export function registerModule(config: XingineConfig) {
  const combinedComponentRegistry = {
    ...(defaultInternalComponents as Record<string, FC<unknown>>),
    ...(config.component || {}),
  };
  initializeModuleRegistry(combinedComponentRegistry);
  config.modules.forEach((def) => {
    getModuleRegistryService()!.register(def);
  });
}
