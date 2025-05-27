import { FC } from "react";
import { ModuleProperties } from "@xingine";

export interface XingineConfig {
  component?: Record<string, FC<unknown>>;
  modules: ModuleProperties[];
}
