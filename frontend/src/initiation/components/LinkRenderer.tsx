import React from "react";
import { EventBindings, IconMeta } from "xingine";
import { StyleMeta } from "../../../.yalc/xingine";
import { Link } from "react-router-dom";
import {
  bindMultipleEvents,
  IconRenderer,
  toCSSClassName,
  toCSSProperties,
} from "xingine-react";

export interface LinkMeta {
  path: string;
  event?: EventBindings;
  style?: StyleMeta;
  icon?: IconMeta;
  label?: string;
}

export interface LinkMetaExtended extends LinkMeta {
  scope?: Record<string, unknown>;
}

export const LinkRenderer: React.FC<LinkMetaExtended> = (meta) => {
  return (
    <Link
      to={meta.path}
      style={toCSSProperties(meta.style?.style)}
      className={toCSSClassName(meta.style?.className)}
      {...bindMultipleEvents(meta.event, meta.scope)}
    >
      {meta.icon && typeof meta.icon === "object" ? (
        <IconRenderer {...meta.icon} />
      ) : typeof meta.icon === "string" ? (
        <span>{meta.icon}</span>
      ) : null}
      {meta.label}
    </Link>
  );
};
