import {
  XingineContextBureau,
  XingineLayoutExample,
  useXingineContext,
} from "xingine-react";
import { componentMap } from "/@/initiation/constants/Component.map.ts";
import { layoutMap } from "/@/initiation/constants/Layout.map.ts";
import { CustomLayoutComponent } from "/@/initiation/layouts/custom/CustomLayoutComponent.tsx";
import { createTailwindDashboardLayout } from "/@/initiation/layouts/custom/example.ts";

const config = { component: componentMap, layout: layoutMap };

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
  const layout = createTailwindDashboardLayout();

  return <CustomLayoutComponent layout={layout} />;
};

const BureauTest = () => {
  const context = useXingineContext();
};
