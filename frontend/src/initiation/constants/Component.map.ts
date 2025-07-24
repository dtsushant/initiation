import { UserLogin } from "/@/initiation/components/auth/UserLogin.tsx";
import { FC } from "react";
import { SiderRenderer } from "/@/initiation/components/SiderRenderer.tsx";
import { ConditionalRenderer } from "/@/initiation/components/ConditionalRenderer.tsx";
import { MenuRenderer } from "/@/initiation/components/MenuRenderer.tsx";
import { IconRenderer } from "/@/initiation/components/IconRenderer.tsx";
import { SvgRenderer } from "/@/initiation/components/SvgRenderer.tsx";
import { ButtonRenderer } from "/@/initiation/components/ButtonRenderer.tsx";
import { ChartRenderer } from "/@/initiation/components/ChartRenderer.tsx";
import { FormRenderer } from "/@/initiation/components/FormRenderer.tsx";
import { LinkRenderer } from "/@/initiation/components/LinkRenderer.tsx";

export const componentMap: Record<string, FC<unknown>> = {
  UserLogin,
  SiderRenderer,
  ConditionalRenderer,
  MenuRenderer,
  IconRenderer,
  SvgRenderer,
  ButtonRenderer,
  ChartRenderer,
  FormRenderer,
  LinkRenderer,
};
