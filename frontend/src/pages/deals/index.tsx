import React, { memo, useEffect, useState } from 'react';
import { Page } from '/@/components/common/Page';
import {
  Tabs,
  Card,
  Table,
  Badge,
  MenuProps,
  Space,
  Dropdown,
  Typography,
  Button,
  TableColumnsType,
} from 'antd';
import {
  DownOutlined,
  ExportOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { StatsCardAltSection } from './components/StatsCard';
import { Link, useNavigate } from 'react-router-dom';
import { data } from './mockData';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import { useStyle } from '/@/utils/ant';
import { TableShimmer } from '/@/components/common/ui/shimmer/TableShimmer';
import { ScrollToTop } from '/@/components/common/ScrollToTop';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Completed',
  },
  {
    key: '2',
    label: 'In Progress',
  },
  {
    key: '3',
    label: 'Scheduled',
  },
];

const columns: TableColumnsType<Campaign> = [
  {
    title: 'S.N.',
    dataIndex: 'key',
    key: 'key',
    align: 'center',
  },
  {
    title: 'Campaign Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Voucher Type',
    dataIndex: 'voucherType',
    key: 'voucherType',
  },
  {
    title: 'Number of Vouchers',
    dataIndex: 'numberOfVouchers',
    key: 'numberOfVouchers',
  },
  {
    title: 'Account Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Badge
        status={status === 'Active' ? 'success' : 'default'}
        text={status}
      />
    ),
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (record) => (
      <Space size="middle">
        <Link
          to={`/deals/details?=${record.key}`}
          state={{ dealName: record.name }}
        >
          <EyeOutlined className="text-[1.5rem] hover:text-brightorange-6" />
        </Link>
      </Space>
    ),
  },
];

export const DealsPage = memo(() => {
  const { styles } = useStyle();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const tabItems = [
    {
      key: '1',
      label: (
        <span className={activeTab === '1' ? 'text-primary' : ''}>
          Campaigns
        </span>
      ),
      children: (
        <Card className="-mt-5 border-t-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-3">
            <span className="text-base text-[#000000E0] font-medium">
              Campaign List
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
                    Campaign Status
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
              <Link to="/deals/add-new-campaign" className="w-full sm:w-auto">
                <Button
                  type="primary"
                  className="bg-primary hover:bg-brightorange-6 hover:border-brightorange-6 h-10 w-full sm:w-auto"
                  icon={<PlusCircleOutlined className="text-[1rem]" />}
                >
                  New Campaign
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
                scroll={{ x: 'max-content' }}
                className={styles.customTable}
                pagination={{ pageSize: 20 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate(`/deals/details?=${record.key}`);
                  },
                })}
              />
            )}
          </div>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span className={activeTab === '2' ? 'text-primary' : ''}>Drafts</span>
      ),
      children: (
        <Card className="-mt-5 border-t-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base text-[#000000E0] font-medium">
              Draft List
            </span>
            <div>
              <Dropdown
                className="mr-3"
                menu={{
                  items,
                  selectable: true,
                  defaultSelectedKeys: ['3'],
                }}
              >
                <Typography.Link className="text-black">
                  <Space>
                    Draft Status
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
              <Button
                variant="dashed"
                className="mr-3 hover:border-neutral-3 hover:text-neutral-8 h-10"
                icon={<ExportOutlined />}
              >
                Export
              </Button>
            </div>
          </div>
          {loading ? (
            <TableShimmer />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              className="table-responsive mt-3"
              scroll={{ x: 'max-content' }}
            />
          )}
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span className={activeTab === '3' ? 'text-primary' : ''}>
          Completed Campaigns
        </span>
      ),
      children: (
        <Card className="-mt-5 border-t-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base text-[#000000E0] font-medium">
              Completed Campaign List
            </span>
            <div>
              <Dropdown
                className="mr-3"
                menu={{
                  items,
                  selectable: true,
                  defaultSelectedKeys: ['3'],
                }}
              >
                <Typography.Link className="text-black">
                  <Space>
                    Completed Status
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
              <Button
                variant="dashed"
                className="mr-3 hover:border-neutral-3 hover:text-neutral-8 h-10"
                icon={<ExportOutlined />}
              >
                Export
              </Button>
            </div>
          </div>
          {loading ? (
            <TableShimmer />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              className="table-responsive mt-3"
              scroll={{ x: 'max-content' }}
            />
          )}
        </Card>
      ),
    },
  ];

  return (
    <Page headerLess title="Deals & Campaigns">
      <PageHeader title="Deals & Campaigns" actions={null} />
      <Breadcrumbs
        items={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Deals & Campaigns' },
        ]}
      />

      <StatsCardAltSection />
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
    </Page>
  );
});

DealsPage.displayName = 'DealsPage';
