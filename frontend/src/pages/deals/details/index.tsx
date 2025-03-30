import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Page } from '/@/components/common/Page';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import { useLocation } from 'react-router-dom';
``;
import { Card } from 'antd';
import DealDetails from '../components/DealDetails';

export const DealsDetailPage = memo(() => {
  const location = useLocation();
  const { dealName = 'Details' } = location.state || {};

  return (
    <Page headerLess title={dealName}>
      <PageHeader title={dealName} actions={null} />
      <Breadcrumbs
        items={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Deals & Campaigns', path: '/deals' },
          { title: dealName },
        ]}
      />
      <div className="space-y-6 bg-white rounded-md min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DealDetails />
        </motion.div>
      </div>
    </Page>
  );
});
DealsDetailPage.displayName = 'DealsDetailPage';
