import React from "react";
import { ButtonMeta } from "xingine";
import {
  bindMultipleEvents,
  DangerousRenderer,
  toCSSClassName,
  toCSSProperties,
} from "xingine-react";
import { Button } from "antd";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";

export interface ButtonMetaExtended extends ButtonMeta {
  scope: Record<string, unknown>;
}

export const ButtonRenderer: React.FC<ButtonMetaExtended> = (meta) => {
  const { style, event, name, content, scope, ...props } = meta;
  const { style: innerStyle, className } = style || {};
  return (
    <Button
      name={name}
      style={toCSSProperties(innerStyle)}
      className={toCSSClassName(className)}
      {...bindMultipleEvents(event, scope)}
      {...props}
    >
      {typeof content === "string" && content ? (
        <DangerousRenderer content={content} />
      ) : content && typeof content === "object" ? (
        <IconRenderer {...content} />
      ) : (
        "Default Button"
      )}
    </Button>
  );
};
