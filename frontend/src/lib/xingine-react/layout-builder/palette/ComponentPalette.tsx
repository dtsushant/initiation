// layout-builder/palette/ComponentPalette.tsx
import React from "react";
import { Card } from "antd";
import { useDrag } from "react-dnd";
import { useStore } from "/@/store/store.hook.ts";
import { AppState } from "/@/components/app/App.slice.ts";
import { UIComponent } from "@xingine";
import { ComponentMeta } from "@xingine/core/component/component-meta-map.ts";

const components = [
  "FormRenderer",
  "TableRenderer",
  "ChartRenderer",
  "DetailRenderer",
  "TabRenderer",
];

export const ComponentPalette: React.FC = () => {
  const {
    app: { allowedModule },
  } = useStore<{
    app: AppState;
  }>((state) => ({
    app: state.app,
  }));

  const comps: UIComponent[] = [];
  const populatedComps = () => {
    if (allowedModule) {
      allowedModule.forEach((modules) => {
        if (modules.uiComponent !== undefined) {
          comps.push(...modules.uiComponent);
        }
      });
    }
  };
  populatedComps();

  return (
    <Card title="Component Palette" style={{ width: 250 }}>
      {comps.map((type) => (
        <PaletteItem key={type} type={type.component} meta={type.meta} />
      ))}
    </Card>
  );
};

const PaletteItem: React.FC<{ type: string; meta?: ComponentMeta }> = ({
  type,
  meta,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { component: type, meta: meta },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, padding: "8px", cursor: "grab" }}
    >
      {type}
    </div>
  );
};
