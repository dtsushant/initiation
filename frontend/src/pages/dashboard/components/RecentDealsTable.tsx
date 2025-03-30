import React from 'react';
import { Button, Card, Table } from 'antd';
import { motion } from 'framer-motion';
import { ExportOutlined } from '@ant-design/icons';

export const RecentDealsTable: React.FC<RecentDealsTableProps> = ({
  columns,
  data,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <Card className="shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-base text-[#000000E0] font-medium">
            Recent List
          </span>
          <div>
            <Button
              variant="dashed"
              className="mr-3 hover:border-neutral-3 hover:text-neutral-8 h-9 w-full"
              icon={<ExportOutlined />}
            >
              Export
            </Button>
          </div>
        </div>
      </motion.div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        className="w-full scrollbar-hide"
        scroll={{ x: 'max-content' }}
      />
    </Card>
  </motion.div>
);
