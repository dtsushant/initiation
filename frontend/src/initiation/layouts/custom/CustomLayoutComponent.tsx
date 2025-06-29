import React from "react";

import {
  useXingineContext,
  TailwindSidebarComponent,
  TailwindFooterComponent,
  toCSSClassName,
  toCSSProperties,
} from "xingine-react";
import { CustomHeaderComponent } from "/@/initiation/layouts/custom/CustomHeaderComponent.tsx";
import { CustomContentComponent } from "/@/initiation/layouts/custom/CustomContentComponent.tsx";
import { LayoutRenderer } from "xingine";

interface TailwindLayoutProps {
  layout: LayoutRenderer;
}

export const CustomLayoutComponent: React.FC<TailwindLayoutProps> = ({
  layout,
}) => {
  const { panelControl, menuItems } = useXingineContext();
  const { collapsed, darkMode } = panelControl;

  console.debug("the panelControl", panelControl);

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
          <CustomHeaderComponent
            renderer={layout.header.meta}
            panelControl={panelControl}
            menuItems={menuItems}
          />
        </header>
      )}

      <div className={`flex ${layout.header ? "mt-16" : ""}`}>
        {/* Sidebar */}
        {layout.sider && (
          <aside
            className={`fixed left-0 top-0 h-screen z-40 transition-all duration-200 ${
              layout.header ? "mt-16" : "mt-0"
            } ${collapsed ? "w-0 overflow-hidden" : "w-52"} ${
              darkMode
                ? "bg-gray-800 border-r border-gray-700"
                : "bg-white border-r border-gray-200"
            }`}
          >
            <TailwindSidebarComponent
              renderer={layout.sider.meta}
              panelControl={panelControl}
              menuItems={menuItems}
            />
          </aside>
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-200 ${
            !collapsed && layout.sider ? "ml-52" : "ml-0"
          }`}
        >
          {/* Content */}
          <main
            className={`p-6 min-h-screen ${layout.footer ? "pb-20" : "pb-6"}`}
          >
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm p-6`}
            >
              <CustomContentComponent
                renderer={layout.content.meta}
                panelControl={panelControl}
              />
            </div>
          </main>

          {/* Footer */}
          {layout.footer && (
            <footer
              className={`fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 ${
                !collapsed && layout.sider ? "ml-52" : "ml-0"
              } ${
                darkMode
                  ? "bg-gray-800 border-t border-gray-700"
                  : "bg-white border-t border-gray-200"
              } shadow-sm`}
            >
              <TailwindFooterComponent
                renderer={layout.footer.meta}
                panelControl={panelControl}
              />
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
