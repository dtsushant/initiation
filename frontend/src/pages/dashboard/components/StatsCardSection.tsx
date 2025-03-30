import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TagsOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { containerVariants } from '../constants';
import { StatCard } from '../../../components/common/ui/statCard';
import { CardShimmer } from '../../../components/common/ui/shimmer/CardShimmer';

export const StatsCardSection: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {loading ? (
        <>
          <CardShimmer />
          <CardShimmer />
          <CardShimmer />
          <CardShimmer />
        </>
      ) : (
        <>
          <StatCard
            title="Active Deals"
            value={24}
            icon={<TagsOutlined className="text-blue-500 text-[1.5rem]" />}
            className="flex flex-col h-full"
          />
          <StatCard
            title="Total Value"
            value={846290}
            precision={2}
            formatter={(value) =>
              `NPR ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            icon={<DollarOutlined className="text-green-500 text-[1.5rem]" />}
            className="flex flex-col h-full"
          />
          <StatCard
            title="Closed Deals"
            value={16}
            icon={
              <CheckCircleOutlined className="text-purple-500 text-[1.5rem]" />
            }
            className="flex flex-col h-full"
          />
          <StatCard
            title="Closing Soon"
            value={8}
            icon={
              <ClockCircleOutlined className="text-yellow-500 text-[1.5rem]" />
            }
            className="flex flex-col h-full"
          />
        </>
      )}
    </motion.div>
  );
};
