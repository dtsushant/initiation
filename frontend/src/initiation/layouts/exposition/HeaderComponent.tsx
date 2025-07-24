import React from "react";
import { LayoutComponentDetail, runAction, SerializableAction } from "xingine";
import {
  RenderComponent,
  useActionContext,
  useSharedState,
} from "xingine-react";

// Hook to detect very small screens (below 508px)

export const HeaderComponent: React.FC<LayoutComponentDetail> = (meta) => {
  return <RenderComponent {...meta} />;
};

export default HeaderComponent;
