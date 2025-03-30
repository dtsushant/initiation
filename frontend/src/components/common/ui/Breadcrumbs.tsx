import React from 'react';
import { Breadcrumb } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
}) => {
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const formattedItems = items.map((item) => ({
    title: item.path ? (
      <Link to={item.path} className="hover:text-primary hover:bg-inherit">
        {item.title}
      </Link>
    ) : (
      item.title
    ),
  }));

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`${className} mt-10 mb-4`}
    >
      <Breadcrumb separator={<RightOutlined />} items={formattedItems} />
    </motion.div>
  );
};
