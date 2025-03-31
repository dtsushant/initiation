import React from 'react';
import {
  DashboardOutlined, ProductOutlined,
  ScanOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { DashboardPage } from '../pages/dashboard';
import {CategoryPage} from "../pages/categories";
import {AddCategoryPage} from "../pages/categories/components/add-category";
import {RuleDocumentPage} from "../pages/rules";
import {InventoryPage} from "../pages/inventories";


export const routes: RouteConfig[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
  },
  {
    label: 'Category',
    path: '/categories',
    icon: <ProductOutlined />,
    element: <CategoryPage />,
    children: [
      {
        path: '/categories/add',
        label:'Add Category',
        element: <AddCategoryPage />,
      }
    ],
  },
  {
    label: 'Rules',
    path: '/rules',
    icon: <TagsOutlined />,
    element: <RuleDocumentPage />
  },
  {
    label: 'Inventories',
    path: '/inventories',
    icon: <ScanOutlined />,
    element: <InventoryPage />,
  },
];
