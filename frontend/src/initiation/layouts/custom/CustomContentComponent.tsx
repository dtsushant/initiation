import React from "react";
import {
  DangerousRenderer,
  getDefaultInternalComponents,
  getLayoutComponentRegistryService,
} from "xingine-react";
import { LayoutComponentDetail } from "xingine";
import { RenderComponent } from "/@/initiation/layouts/custom/Component.utils.tsx";

interface TailwindContentComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: any;
}

export const CustomContentComponent: React.FC<
  TailwindContentComponentProps
> = ({ renderer, panelControl }) => {
  const registry = getLayoutComponentRegistryService();
  const { darkMode } = panelControl;
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

  return <>{renderer ? render(renderer) : <></>}</>;
};
