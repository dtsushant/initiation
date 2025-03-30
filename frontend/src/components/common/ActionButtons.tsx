import React from 'react';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onMore,
}) => {
  return (
    <motion.div
      className="flex items-center"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 30, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {onEdit && (
        <EditOutlined
          onClick={onEdit}
          className="cursor-pointer mr-2 text-lg hover:scale-125 transition-all duration-300"
        />
      )}
      {onDelete && (
        <DeleteOutlined
          onClick={onDelete}
          className="cursor-pointer mr-2 text-lg hover:scale-125 transition-all duration-300"
        />
      )}
      {onMore && (
        <MoreOutlined
          onClick={onMore}
          className="cursor-pointer text-lg hover:scale-125 transition-all"
        />
      )}
    </motion.div>
  );
};
