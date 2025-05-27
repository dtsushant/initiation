import React, { useMemo } from 'react';
import { Space, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {CategoryData} from "../../../types/dashboard";

export const useCategoryTableColumns = () => {
  return useMemo<TableColumnsType<CategoryData>>(
    () => [
      {
        title: 'S.N.',
        key: 'sn',
        align: 'center',
        render: (_: any, __: CategoryData, index: number) => `${index + 1}`,
      },
      {
        title: 'Category Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: 'Merchant Name',
        dataIndex: 'merchant',
        key: 'merchant',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        align: 'right',
        key: 'value',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: DealData['status']) => {
          const color =
            status === 'Closed'
              ? 'volcano'
              : status === 'Pending'
                ? 'geekblue'
                : 'green';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: () => (
          <Space size="middle">
            <a href="#view" onClick={(e) => e.preventDefault()}>
              <EyeOutlined className="text-[1.5rem] hover:text-brightorange-6" />
            </a>
          </Space>
        ),
      },
    ],
    []
  );
};
