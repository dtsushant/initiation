import React from "react";
import {
  DangerousRenderer,
  getDefaultInternalComponents,
  getLayoutComponentRegistryService,
  RenderComponent,
  toCSSClassName,
  useAllSharedState,
  useSharedState,
} from "xingine-react";
import { extrapolate, LayoutComponentDetail } from "xingine";

interface TailwindContentComponentProps {
  renderer?: LayoutComponentDetail;
}

export const CustomContentComponent: React.FC<
  TailwindContentComponentProps
> = ({ renderer }) => {
  const registry = getLayoutComponentRegistryService();
  const compMap = getDefaultInternalComponents();

  const render = (component: LayoutComponentDetail) => {
    // Use the registry to render the component if it exists
    //TODO: test or remove before the push
    if (registry) {
      const rendered = registry.renderLayoutComponent(component);
      if (rendered) return rendered;
    }

    return <RenderComponent {...component} />;
  };
  const states = useAllSharedState(); // ✅ reactive!

  return <>{renderer ? render(renderer) : <></>}</>;
};
