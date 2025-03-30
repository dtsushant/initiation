import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PercentageOutlined,
  ClockCircleOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { containerVariants } from '../constants';
import { StatCardAlt } from '../../../components/common/ui/statCardAlt';
import { DealsCardShimmer } from '/@/components/common/ui/shimmer/DealsCardShimmer';

export const StatsCardAltSection: React.FC = () => {
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
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {loading ? (
        <>
          <DealsCardShimmer />
          <DealsCardShimmer />
          <DealsCardShimmer />
          <DealsCardShimmer />
          <DealsCardShimmer />
        </>
      ) : (
        <>
          <StatCardAlt
            title="Active Campaigns"
            value={24000}
            icon={
              <PercentageOutlined className="text-neutral-14 bg-emeraldgreen-2 p-[6px] rounded-lg text-lg" />
            }
            className="flex flex-col h-full"
          />
          <StatCardAlt
            title="Scheduled Campaigns"
            value={100}
            icon={
              <ClockCircleOutlined className="text-neutral-14 bg-blazeorange-2 p-[6px] rounded-lg text-lg" />
            }
            className="flex flex-col h-full"
          />
          <StatCardAlt
            title="Vouchers Created"
            value={2500000}
            icon={
              <TagsOutlined className="text-neutral-14 bg-blue-4 p-[6px] rounded-lg text-lg" />
            }
            className="flex flex-col h-full"
          />
          <StatCardAlt
            title="Vouchers Claimed"
            value={2300000}
            icon={
              <BookOutlined className="text-neutral-14 bg-goldenyellow-3 p-[6px] rounded-lg text-lg" />
            }
            className="flex flex-col h-full"
          />
          <StatCardAlt
            title="Vouchers Redeemed"
            value={1800000}
            icon={
              <CheckCircleOutlined className="text-neutral-14 bg-emeraldgreen-5 p-[6px] rounded-lg text-lg" />
            }
            className="flex flex-col h-full"
          />
        </>
      )}
    </motion.div>
  );
};
