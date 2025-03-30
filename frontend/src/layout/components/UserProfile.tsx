import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { motion } from 'framer-motion';

export const UserProfile = ({ user, collapsed }: UserProfileProps) => {
  if (collapsed) {
    return (
      <Tooltip
        color="var(--color-primary)"
        title={
          <>
            <div className="font-semibold">{user.name}</div>
          </>
        }
        placement="top"
      >
        <div className="flex items-center space-x-3 cursor-pointer">
          <UserOutlined className="bg-blazeorange-2 p-2 rounded-md mb-2 text-[1.5rem]" />
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center space-x-3 mb-1">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <UserOutlined className="bg-blazeorange-2 p-2 rounded-md text-[1.5rem]" />
      </motion.div>
      <div>
        <div className="font-semibold">{user.name}</div>
        {/* role display removed */}
      </div>
    </div>
  );
};
