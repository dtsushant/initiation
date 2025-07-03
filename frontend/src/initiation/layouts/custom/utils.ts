import {
  ComponentMeta,
  ComponentMetaMap,
  EventBindings,
  getActionRef,
  LayoutComponentDetail,
} from "xingine";
import { useXingineContext } from "xingine-react";

export class LayoutComponent implements LayoutComponentDetail {
  // path?: string;
  // isMenuItem: boolean;
  component: string;
  // children?: LayoutComponent[];
  content?: string;
  meta?: ComponentMeta;

  constructor(data: LayoutComponentDetail) {
    //   this.path = data.path;
    //  this.isMenuItem = data.isMenuItem;
    this.component = data.component;
    this.content = data.content;
    this.meta = data.meta;

    // recursively wrap children if they exist
    if (data.meta?.component === "WrapperRenderer") {
      const wrapperMeta = data.meta as ComponentMetaMap["WrapperRenderer"];
      if (wrapperMeta.children) {
        this.meta = {
          ...this.meta,
          properties: wrapperMeta,
          children: wrapperMeta.children?.map((c) => new LayoutComponent(c)),
        } as ComponentMeta<keyof ComponentMetaMap>;
      }
    }
    /*if (data.meta?.properties?.children) {
            this.meta?.properties?.children = data.meta.properties.children.map((c) => new LayoutComponent(c));
        }*/
  }

  /*addChildren(...children: LayoutComponentDetail[]) {
        if (!this.children) this.children = [];

        for (const child of children) {
            const wrappedChild = new LayoutComponent(child);
            const exists = this.children.some(
                (c) => c.path === wrappedChild.path || c.component === wrappedChild.component
            );
            if (!exists) {
                this.children.push(wrappedChild);
            }
        }

        return this;
    }*/
}

/*export function getActionRef(
    expression: string,
    scope: Record<string, unknown>
): ((...args: unknown[]) => void) | undefined {
  if (!expression.startsWith('#this.')) return undefined;

  const path = expression.slice('#this.'.length).split('.');
  let current: any = scope;

  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  return typeof current === 'function' ? current : undefined;
}*/

export function bindMultipleEvents(
  bindings?: EventBindings,
  scope?: Record<string, unknown>,
): Record<string, (...args: unknown[]) => void> {
  const result: Record<string, (...args: unknown[]) => void> = {};
  if (!bindings) return result;

  const { panelControl } = useXingineContext();
  const { headerActionContext } = panelControl;
  const combinedScope = { ...headerActionContext, ...scope };
  for (const [event, action] of Object.entries(bindings)) {
    const fn = getActionRef(action, combinedScope);
    console.info(
      "binding event",
      event,
      "to function",
      fn,
      "from ref",
      action,
      "with scope",
      combinedScope,
    );
    if (typeof fn === "function") {
      result[event] = fn;
    }
  }

  return result;
}
