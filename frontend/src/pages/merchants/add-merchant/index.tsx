import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Page } from '/@/components/common/Page';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import CustomFormBuilder from './form/FormBuilder';

export const AddMerchantPage = memo(() => {
  return (
    <Page headerLess title="Add Merchant">
      <PageHeader title="Add Merchant" actions={null} />
      <Breadcrumbs
        items={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Merchants', path: '/merchants' },
          { title: 'Add Merchant' },
        ]}
      />
      <div className="px-6 space-y-6 bg-white rounded-md min-h-full pb-6 py-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CustomFormBuilder />
        </motion.div>
      </div>
    </Page>
  );
});
AddMerchantPage.displayName = 'AddMerchantPage';
