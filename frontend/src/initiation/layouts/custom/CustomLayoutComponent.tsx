import React from "react";

import {
  useXingineContext,
  TailwindSidebarComponent,
  TailwindFooterComponent,
  toCSSClassName,
  toCSSProperties,
  useSharedState,
  useActionContext,
} from "xingine-react";
import { CustomHeaderComponent } from "/@/initiation/layouts/custom/CustomHeaderComponent.tsx";
import { CustomContentComponent } from "/@/initiation/layouts/custom/CustomContentComponent.tsx";
import { LayoutRenderer, runAction, SerializableAction } from "xingine";
import { SiderComponent } from "/@/initiation/layouts/exposition/SiderComponent.tsx";
//import {useSharedState} from "/@/initiation/components/context/ActionContextProvider.tsx";

interface TailwindLayoutProps {
  layout: LayoutRenderer;
}

export const CustomLayoutComponent: React.FC<TailwindLayoutProps> = ({
  layout,
}) => {
  return (
    <div
      className={toCSSClassName(layout.style?.className)}
      style={toCSSProperties(layout.style?.style)}
    >
      {/* Header */}
      {layout.header && (
        <header
          className={toCSSClassName(layout.header.style?.className)}
          style={toCSSProperties(layout.header.style?.style)}
        >
          <CustomHeaderComponent renderer={layout.header.meta} />
        </header>
      )}

      <div className={`flex ${layout.header ? "mt-46" : ""}`}>
        {/* Sidebar */}
        {layout.sider && <SiderComponent {...layout.sider.meta} />}

        {/* Main Content Area */}
        {/***
         TODO:-
         * 1. If no sider, the main content should take full width.
         * 2. If sider is present, the main content should adjust its margin based on the collapsed state.
         * 3. this should be moved to ContentRenderer
         * */}
        <div
          className={toCSSClassName(`flex-1 transition-all duration-200 #{
                !layout.sider ? "" : collapsed ? "ml-20" : "ml-52"
            } pt-6`)}
        >
          {/* Content */}
          <main
            className={`#{
                darkMode ? "bg-gray-800" : "bg-white"
            } p-6 min-h-screen #{hasFooter ? "pb-20" : "pb-6"}`}
          >
            <div
              className={`#{
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm p-6`}
            >
              <CustomContentComponent renderer={layout.content.meta[0]} />
            </div>
          </main>

          {/* Footer */}
          {layout.footer && (
            <footer
              className={toCSSClassName(`fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 #{
                collapsed && hasSider ? "ml-20" : "ml-52"
              } #{
                darkMode
                  ? "bg-gray-800 border-t border-gray-700"
                  : "bg-white border-t border-gray-200"
              } shadow-sm`)}
            >
              <TailwindFooterComponent
                renderer={layout.footer.meta}
                panelControl={{}}
              />
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
