import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Page } from '/@/components/common/Page';
import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Badge,
  Dropdown,
  MenuProps,
} from 'antd';
import {
  DownOutlined,
  ExportOutlined,
  EyeOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import { MerchantStats } from './components/MerchantStats';
import { data as mockData } from './mockData';
import { useStyle } from '/@/utils/ant';
import type { TableColumnsType } from 'antd';
import { TableShimmer } from '/@/components/common/ui/shimmer/TableShimmer';

const data: MerchantData[] = mockData.map((item) => ({
  ...item,
  status: item.status === 'Enabled' ? 'Enabled' : 'Disabled',
})) as MerchantData[];

const columns: TableColumnsType<MerchantData> = [
  {
    title: 'S.N.',
    dataIndex: 'key',
    align: 'center',
    key: 'key',
  },
  {
    title: 'Merchant Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Business Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Contact Number',
    dataIndex: 'contact',
    key: 'contact',
  },

  {
    title: 'Account Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: MerchantData['status']) => (
      <span className="flex items-center gap-2">
        <Badge
          status={status === 'Enabled' ? 'success' : 'default'}
          text={
            <span
              className={
                status === 'Enabled' ? 'text-green-500' : 'text-gray-500'
              }
            >
              {status}
            </span>
          }
        />
      </span>
    ),
  },

  {
    title: 'Action',
    key: 'action',
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (record) => (
      <Link
        to={`/merchants/details?=${record.key}`}
        state={{ merchantName: record.name }}
      >
        <EyeOutlined className="text-[1.5rem] hover:text-brightorange-6" />
      </Link>
    ),
  },
];
const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Manoj Khatri',
  },
  {
    key: '2',
    label: 'Puskar Shrestha',
  },
];

export const MerchantsPage = memo(() => {
  const { styles } = useStyle();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <Page headerLess title="Merchants">
      <PageHeader title="Merchants" actions={null} />

      <Breadcrumbs
        items={[{ title: 'Home', path: '/dashboard' }, { title: 'Merchants' }]}
      />

      <MerchantStats />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-3">
            <span className="text-base text-[#000000E0] font-medium">
              Merchant List
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Dropdown
                className="mb-2 md:mb-0 md:mr-3 w-full sm:w-auto"
                menu={{
                  items,
                  selectable: true,
                  defaultSelectedKeys: ['3'],
                }}
              >
                <Typography.Link className="text-black w-full sm:w-auto flex justify-between">
                  <Space>
                    Merchant Name
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
              <Button
                variant="dashed"
                className="mb-2 md:mb-0 md:mr-3 hover:border-neutral-3 hover:text-neutral-8 h-10 w-full sm:w-auto"
                icon={<ExportOutlined />}
              >
                Export
              </Button>
              <Link to="/merchants/add" className="w-full sm:w-auto">
                <Button
                  type="primary"
                  className="bg-primary hover:bg-brightorange-6 hover:border-brightorange-6 h-10 w-full sm:w-auto"
                  icon={<UserAddOutlined className="text-[1rem]" />}
                >
                  New Merchant
                </Button>
              </Link>
            </div>
          </div>

          <div className="clickable-table-row">
            {loading ? (
              <TableShimmer />
            ) : (
              <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  pageSize: 20,
                  current: currentPage,
                  onChange: (page) => setCurrentPage(page),
                }}
                className={styles.customTable}
                scroll={{ x: 'max-content' }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate(`/merchants/details?=${record.key}`);
                  },
                })}
              />
            )}
          </div>
        </Card>
      </motion.div>
    </Page>
  );
});
MerchantsPage.displayName = 'MerchantsPage';
