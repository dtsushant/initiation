// bootstrap.ts
import { registerModule } from "/@/lib/xingine-react/xingine-react.service.ts";
import { get } from "/@/services/initiation.service.ts";
import {
  ModulePropertyOptions,
  modulePropertyOptionsListDecoder,
} from "@xingine";
import { componentMap } from "/@/config/ruled-component.config.ts"; // <-- your API call

export async function bootstrapApp(): Promise<void> {
  try {
    console.log("here here here ");
    const componentDefinitions = await get<ModulePropertyOptions[]>(
      modulePropertyOptionsListDecoder,
      "modules",
    );
    registerModule(componentDefinitions, componentMap);
  } catch (error) {
    console.error("Failed to bootstrap app", error);
    throw error; // Optionally halt app start
  }
}
