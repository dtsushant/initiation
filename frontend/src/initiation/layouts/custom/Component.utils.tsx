import { LayoutComponentDetail } from "xingine";
import { DangerousRenderer, getDefaultInternalComponents } from "xingine-react";
import React from "react";

export const RenderComponent: React.FC<LayoutComponentDetail> = (component) => {
  if (!component) return null;
  const compMap = getDefaultInternalComponents();

  const Comp = compMap[component.component];

  return (
    <>
      {component.content && (
        <DangerousRenderer
          style={component.contentStyle}
          content={component.content}
        />
      )}
      {Comp && <Comp {...component.meta?.properties} />}
    </>
  );
};
