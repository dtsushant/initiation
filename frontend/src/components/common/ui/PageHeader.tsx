import React from 'react';
import { Space, Badge } from 'antd';
import { motion } from 'framer-motion';
import { BellOutlined } from '@ant-design/icons';
import { useCollapsed } from '/@/context/CollapsedContext';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  className,
  actions,
  showNotification = true,
  notificationCount = 4,
}) => {
  const { isCollapsed } = useCollapsed();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`justify-between items-center h-[68px] fixed top-0 right-0 z-10 flex ${
        isCollapsed ? 'w-[calc(100%-90px)]' : 'w-[calc(100%-280px)]'
      } border-none px-6 bg-blur bg-opacity-20 backdrop-filter backdrop-blur-lg`}
    >
      <span className={`text-[20px] font-medium ${className}`}>{title}</span>
      <div className="flex items-center">
        {actions && <Space>{actions}</Space>}
        {showNotification && (
          <Badge count={notificationCount} className="cursor-pointer">
            <BellOutlined className="bg-white rounded-full p-1.5 text-[1.5rem] hover:scale-110 transition-all duration-300" />
          </Badge>
        )}
      </div>
    </motion.div>
  );
};
