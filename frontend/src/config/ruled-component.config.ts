import { FC } from "react";
import { CategoryPage } from "/@/pages/categories";
import { UserPage } from "/@/pages/users";
import { InventoryPage } from "/@/pages/inventories";
import { RuleDocumentPage } from "/@/pages/rules";

export const componentMap: Record<string, FC> = {
  CategoryPage,
  UserPage,
  InventoryPage,
  RuleDocumentPage,
};
