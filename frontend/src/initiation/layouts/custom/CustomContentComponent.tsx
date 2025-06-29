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

  return (
    <>
      {renderer ? (
        render(renderer)
      ) : (
        <div
          className={`p-8 text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium">No content</h3>
            <p className="mt-1 text-sm">
              No content renderer has been configured for this layout.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
