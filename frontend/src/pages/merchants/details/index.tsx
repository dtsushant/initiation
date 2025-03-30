import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '/@/components/common/Page';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import { useLocation } from 'react-router-dom';
import { Card, Tabs, Typography, Tag, Badge, Image } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import dealsLogo from '/@/assets/dealsLogo.svg';
import { ActionButtons } from '/@/components/common/ActionButtons';

const { Text } = Typography;

export const MerchantDetailPage = memo(() => {
  const location = useLocation();
  const { merchantName = 'Innovatech Solutions' } = location.state || {};
  const [activeTab, setActiveTab] = useState('1');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const tabItems = [
    {
      key: '1',
      label: (
        <span className={activeTab === '1' ? 'text-primary' : ''}>
          Active Campaigns
        </span>
      ),
      children: (
        <Card className="-mt-5 border-t-0">
          <Card
            className="shadow-sm flex flex-col"
            onMouseEnter={() => setHoveredCard('active-campaign')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold mb-1">
                Dashain 25% off on every items!!!
              </p>
              <AnimatePresence>
                {hoveredCard && (
                  <ActionButtons
                    onEdit={() => console.log('Edit clicked')}
                    onDelete={() => console.log('Delete clicked')}
                    onMore={() => console.log('More clicked')}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-500">
              <p className="text-base font-medium mb-1">Innovatech Solutions</p>
              <p>March 10, 2025 - April 10, 2025</p>
              <p>
                Applicable on :{' '}
                <Tag className="w-fit mt-2 text-gray-500">All Locations</Tag>
              </p>
            </div>
          </Card>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span className={activeTab === '2' ? 'text-primary' : ''}>
          Campaign History
        </span>
      ),
      children: (
        <Card className="-mt-5 border-t-0">
          <Card
            className="shadow-sm flex flex-col"
            onMouseEnter={() => setHoveredCard('campaign-history')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between">
              <p className="text-base font-medium">
                New Year 30% off on every items!!!
              </p>
              <AnimatePresence>
                {hoveredCard === 'campaign-history' && (
                  <ActionButtons
                    onEdit={() => console.log('Edit clicked')}
                    onDelete={() => console.log('Delete clicked')}
                    onMore={() => console.log('More clicked')}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="text-xs text-gray-500">
              <p>KFC</p>
              <p>April 8, 2025 - April 12, 2025</p>
              <p>
                Applicable on :{' '}
                <Tag className="w-fit mt-2 text-gray-500">All Locations</Tag>
              </p>
            </div>
          </Card>
        </Card>
      ),
    },
  ];

  return (
    <Page headerLess title={merchantName}>
      <PageHeader title={'Merchants'} actions={null} />
      <Breadcrumbs
        items={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Merchants', path: '/merchants' },
          { title: merchantName },
        ]}
      />
      <div className="space-y-6 rounded-md min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge.Ribbon text="Enabled" color="green">
            <Card className="shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Image
                  src={dealsLogo}
                  alt="Merchant Logo"
                  className="w-32 h-32 rounded-xl border border-gray-200"
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold">
                      {merchantName}
                    </span>
                    <EditOutlined className="text-lg cursor-pointer" />
                  </div>
                  <Text className="text-gray-500">
                    45 Tech Park, Bansbari, Kathmandu, Nepal
                  </Text>
                  <Text className="text-gray-500">9843123456</Text>
                  <div className="flex">
                    <Tag className="w-fit mt-2 text-gray-500">
                      PAN/VAT : 2342345
                    </Tag>
                    <Tag className="w-fit mt-2 text-gray-500">
                      Business Category : Technology
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Badge.Ribbon>

          <div className="space-y-6 rounded-md min-h-full pb-6 mt-5">
            <Tabs
              activeKey={activeTab}
              type="card"
              onChange={(key) => setActiveTab(key)}
              className="w-full"
              tabBarGutter={7}
              items={tabItems}
            />
          </div>
        </motion.div>
      </div>
    </Page>
  );
});
MerchantDetailPage.displayName = 'MerchantDetailPage';
