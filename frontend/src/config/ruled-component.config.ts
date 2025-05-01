import { FC } from "react";
import { CategoryPage } from "/@/pages/categories";
import { UserPage } from "/@/pages/users";
import { InventoryPage } from "/@/pages/inventories";
import { RuleDocumentPage } from "/@/pages/rules";
import { UserLogin } from "/@/pages/users/components/UserLogin.tsx";

export const componentMap: Record<string, FC<unknown>> = {
  CategoryPage,
  UserPage,
  UserLogin,
  InventoryPage,
  RuleDocumentPage,
};
