import { registerModule } from "/@/lib/xingine-react/xingine-react.service.ts";
import { get } from "/src/lib/xingine-react/services/initiation.service.ts";
import { ModuleProperties, modulePropertiesListDecoder } from "@xingine";
import { componentMap } from "/@/config/ruled-component.config.ts";

export async function bootstrapApp(): Promise<void> {
  try {
    const componentDefinitions = await get<ModuleProperties[]>(
      modulePropertiesListDecoder,
      "modules",
    );
    registerModule({
      modules: componentDefinitions,
      component: componentMap,
    });
  } catch (error) {
    console.error("Failed to bootstrap app", error);
    throw error; // Halts the app, decide a better approach !!!
  }
}
