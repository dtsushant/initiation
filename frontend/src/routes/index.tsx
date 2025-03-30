import React from 'react';
import {
  DashboardOutlined,
  ScanOutlined,
  ShopOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { DashboardPage } from '../pages/dashboard';
import { MerchantsPage } from '../pages/merchants/merchant-list';
import { AddMerchantPage } from '../pages/merchants/add-merchant';
import { DealsPage } from '../pages/deals';
import { AddCampaignPage } from '../pages/deals/add-campaign';
import { DealsDetailPage } from '../pages/deals/details';
import { MerchantDetailPage } from '../pages/merchants/details';
import { RedeemDealsPage } from '../pages/redeem-deals';

export const routes: RouteConfig[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
  },
  {
    label: 'Merchants',
    path: '/merchants',
    icon: <ShopOutlined />,
    element: <MerchantsPage />,
    children: [
      {
        path: '/merchants/add',
        element: <AddMerchantPage />,
      },
      {
        path: '/merchants/details',
        element: <MerchantDetailPage />,
      },
    ],
  },
  {
    label: 'Deals & Campaigns',
    path: '/deals',
    icon: <TagsOutlined />,
    element: <DealsPage />,

    children: [
      {
        path: '/deals/add-new-campaign',
        element: <AddCampaignPage />,
      },
      {
        path: '/deals/details',
        element: <DealsDetailPage />,
      },
    ],
  },
  {
    label: 'Redeem Deals',
    path: '/redeem-deals',
    icon: <ScanOutlined />,
    element: <RedeemDealsPage />,
  },
];
