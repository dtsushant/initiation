import React from "react";
import {
  DangerousRenderer,
  getDefaultInternalComponents,
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
  const compMap = getDefaultInternalComponents();

  const render = (component: LayoutComponentDetail) => {
    return <RenderComponent {...component} />;
  };
  const states = useAllSharedState(); // ✅ reactive!

  return <>{renderer ? render(renderer) : <></>}</>;
};
