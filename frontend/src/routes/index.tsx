import React from "react";
import {
  DashboardOutlined,
  ProductOutlined,
  ScanOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { DashboardPage } from "../pages/dashboard";
import { CategoryPage } from "../pages/categories";
import { RuleDocumentPage } from "../pages/rules";
import { InventoryPage } from "../pages/inventories";

export const routes: RouteConfig[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
  },
  {
    label: "Category",
    path: "/categories",
    icon: <ProductOutlined />,
    element: <CategoryPage />,
    hasSlug: true,
  },
  {
    label: "Rules",
    path: "/rules",
    icon: <TagsOutlined />,
    element: <RuleDocumentPage />,
  },
  {
    label: "Inventories",
    path: "/inventories",
    icon: <ScanOutlined />,
    element: <InventoryPage />,
  },
];
