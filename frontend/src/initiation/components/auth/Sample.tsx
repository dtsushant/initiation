import {
  XingineContextBureau,
  XingineLayoutExample,
  useXingineContext,
  ActionProvider,
  useSharedState,
  toCSSClassName,
  toCSSProperties,
  TailwindFooterComponent,
  useActionContext,
  RenderComponent,
  DefaultLayoutRenderer,
} from "xingine-react";
import { componentMap } from "/@/initiation/constants/Component.map.ts";
import { layoutMap } from "/@/initiation/constants/Layout.map.ts";
import { CustomLayoutComponent } from "/@/initiation/layouts/custom/CustomLayoutComponent.tsx";
import React from "react";
import { SiderRenderer } from "/@/initiation/components/SiderRenderer.tsx";
import { getDefaultTemplate } from "/@/initiation/layouts/custom/builderExample.ts";
import { ConditionalRenderer } from "/@/initiation/components/ConditionalRenderer.tsx";
import { MenuRenderer } from "/@/initiation/components/MenuRenderer.tsx";
import { SvgRenderer } from "/@/initiation/components/SvgRenderer.tsx";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";
import { createTailwindDashboardLayout } from "/@/initiation/layouts/custom/example.ts";
import { ButtonRenderer } from "/@/initiation/components/ButtonRenderer.tsx";
import { ChartRenderer } from "/@/initiation/components/ChartRenderer.tsx";
import { FormRenderer } from "/@/initiation/components/FormRenderer.tsx";
import { Outlet, RouteObject } from "react-router-dom";
import { LayoutRenderer, runAction, SerializableAction } from "xingine";
import { CustomHeaderComponent } from "/@/initiation/layouts/custom/CustomHeaderComponent.tsx";
import { SiderComponent } from "/@/initiation/layouts/exposition/SiderComponent.tsx";
import { CustomContentComponent } from "/@/initiation/layouts/custom/CustomContentComponent.tsx";
import { FooterComponent } from "/@/initiation/layouts/exposition/FooterComponent.tsx";
import { StyleMeta } from "xingine/dist/core/expressions/style";
import {
  Commissar,
  LayoutComponentDetail,
} from "xingine/dist/core/xingine.type";
//import {ActionProvider} from "/@/initiation/components/context/ActionContextProvider.tsx";

const MyTestComponent: React.FC<Record<string, unknown>> = (props) => {
  console.info("Do i ever get called");
  return <div className="p-4 bg-blue-100">My Test Component</div>;
};

export const Sample = () => {
  return <TailwindDashboardExample />;
};

export const TailwindDashboardExample = () => {
  const layout = getDefaultTemplate();
  return <CustomLayoutComponent layout={layout} />;
};

const useCurrentScreenSize = () => {
  const actionContext = useActionContext();
  const current = useSharedState<number>("currentScreenSize") || undefined;

  React.useEffect(() => {
    const checkScreenSize = () => {
      console.info("how often am i triggered");
      const currentWidth = window.innerWidth;
      // Get fresh value inside effect to avoid re-render-in-render
      const currentVal = actionContext.getState<number>("currentScreenSize");

      if (currentWidth !== currentVal) {
        const action: SerializableAction = {
          action: "setState",
          args: {
            key: "currentScreenSize",
            value: currentWidth,
          },
        };
        runAction(action, actionContext);
      }
    };

    // Delay first check until after mount to prevent re-entrant render
    setTimeout(checkScreenSize, 0);

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [actionContext]);

  return current;
};

export const DefaultLayoutComponent: React.FC<LayoutRenderer> = (layout) => {
  const currentScreenSize = useCurrentScreenSize();
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
          <RenderComponent {...layout.header.meta} />
        </header>
      )}

      <div className={toCSSClassName(`flex #{hasHeader ? "mt-46" : ""}`)}>
        {/* Sidebar */}
        {layout.sider && <RenderComponent {...layout.sider.meta} />}

        {/* Main Content Area */}
        <div
          className={toCSSClassName(
            `flex-1 transition-all duration-200 #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : "0"} pt-6`,
          )}
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
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          {layout.footer && (
            <footer className={toCSSClassName(layout.footer.style?.className)}>
              <RenderComponent {...layout.footer.meta} />
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};
export function generateRoutesFromLayout(
  layout: LayoutRenderer,
): RouteObject[] {
  const l = { ...layout, content: undefined };
  return [
    {
      path: "/",
      element: (
        <ActionProvider>
          <DefaultLayoutComponent {...l} />
        </ActionProvider>
      ),
      children: layout.content.meta.map((commissar) => ({
        path: commissar.path,

        element: <CustomContentComponent renderer={commissar} />, // Render the specific Commissar UI
      })),
    },
  ];
}

export function getRoutes(): RouteObject[] {
  return grwl(getDefaultTemplate());
}

const LayoutWithContext: React.FC<LayoutRenderer> = (props) => {
  const ctx = useXingineContext();
  return (
    <ActionProvider>
      <DefaultLayoutRenderer {...props} />
    </ActionProvider>
  );
};

export function grwl(layout: LayoutRenderer): RouteObject[] {
  const l = { ...layout, content: undefined };
  return [
    {
      path: "/",
      element: <LayoutWithContext {...l} />,
      children: layout.content.meta.map((commissar) => ({
        path: commissar.path,
        element: <CustomContentComponent renderer={commissar} />,
      })),
    },
  ];
}
