import React, { useState } from "react";
import {
  getActionRef,
  getTypedValue,
  LayoutComponentDetail,
  resolvePath,
} from "xingine";
import HeaderComponent from "/@/initiation/layouts/exposition/HeaderComponent.tsx";
import {
  bindMultipleEvents,
  PanelControlBureau,
  RenderComponent,
} from "xingine-react";
import { CleanHeader } from "/@/initiation/layouts/custom/Component.utils.tsx";

interface TailwindHeaderComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: PanelControlBureau;
  menuItems: any[];
}

export const CustomHeaderComponent: React.FC<TailwindHeaderComponentProps> = ({
  renderer,
}) => {
  return (
    <>
      <HeaderComponent {...renderer} />
      {/*<CleanHeader />*/}
    </>
  );
};
