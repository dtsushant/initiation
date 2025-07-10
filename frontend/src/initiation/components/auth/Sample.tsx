import {
  XingineContextBureau,
  XingineLayoutExample,
  useXingineContext,
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

const MyTestComponent: React.FC<Record<string, unknown>> = (props) => {
  console.info("Do i ever get called");
  return <div className="p-4 bg-blue-100">My Test Component</div>;
};

const config = {
  component: {
    ...componentMap,
    ...{
      MyTestComponent,
      SiderRenderer,
      ConditionalRenderer,
      MenuRenderer,
      IconRenderer,
      SvgRenderer,
      ButtonRenderer,
    },
  },
  layout: layoutMap,
};

export const Sample = () => {
  return (
    <XingineContextBureau config={config}>
      <BureauTest />
      <Test />
    </XingineContextBureau>
  );
};

const Test = () => {
  return <TailwindDashboardExample />;
};

export const TailwindDashboardExample = () => {
  // const layout = createTailwindDashboardLayout();
  const layout = getDefaultTemplate();
  //const layoutfx =TemplateBuilders.completeDashboard();
  return <CustomLayoutComponent layout={layout} />;
};

const BureauTest = () => {
  const context = useXingineContext();
};
