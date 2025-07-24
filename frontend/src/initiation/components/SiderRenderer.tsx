import React, { useEffect, useMemo, useState } from "react";
import { SiderMeta } from "xingine";
import {
  bindMultipleEvents,
  DangerousRenderer,
  getAllComponentMap,
  toCSSClassName,
  toCSSProperties,
  useXingineContext,
} from "xingine-react";

export const SiderRenderer: React.FC<SiderMeta> = (meta) => {
  const {
    children,
    style,
    content,
    event,

    ...props
  } = meta;
  const compMap = getAllComponentMap(); //getDefaultInternalComponents();

  return (
    <>
      <aside
        style={toCSSProperties(style?.style)}
        className={toCSSClassName(style?.className)}
        {...bindMultipleEvents(event)}
        {...props}
      >
        {content && <DangerousRenderer content={content} />}

        {children
          ?.filter((child) => !!child.meta)
          .map((child, index) => {
            const Comp = compMap[child.meta!.component];
            if (!Comp) {
              console.warn(
                `layout Component ${child.meta!.component} not found`,
              );
              return null;
            }
            return <Comp {...child.meta!.properties} key={index} />;
          })}
      </aside>
    </>
  );
};
