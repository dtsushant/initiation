import {
  ComponentMeta,
  ComponentMetaMap,
  LayoutComponentDetail,
} from "xingine";

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
