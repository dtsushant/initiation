import React from "react";
import {
  ActionContext,
  ButtonMeta,
  EventBindings,
  runAction,
  SerializableAction,
} from "xingine";
import {
  bindMultipleEvents,
  DangerousRenderer,
  toCSSClassName,
  toCSSProperties,
  useActionContext,
} from "xingine-react";
import { Button } from "antd";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";
// import {useActionContext} from "/@/initiation/components/context/ActionContextProvider.tsx";

export interface ButtonMetaExtended extends ButtonMeta {
  scope: Record<string, unknown>;
}
/*export function bindMultipleEvents(
    bindings?: EventBindings,
    scope?: Record<string, unknown>
): Record<string, (...args: unknown[]) => void> {
  const result: Record<string, (...args: unknown[]) => void> = {};
  if (!bindings) return result;
  const context = useActionContext();
  console.log("the bindings", bindings)

  for (const [eventName, action] of Object.entries(bindings)) {
    result[eventName] = (...args: unknown[]) => {
      runAction(action , context, args[0]);
    };
  }
  return result;
}*/

export const ButtonRenderer: React.FC<ButtonMetaExtended> = (meta) => {
  const { style, event, name, content, scope, ...props } = meta;
  const { style: innerStyle, className } = style || {};
  console.debug("the event", event, "for name", name);
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
