import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../../../../components/common/ui/statCard';
import { CardShimmer } from '/@/components/common/ui/shimmer/CardShimmer';

export const MerchantStats: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
    >
      {loading ? (
        <>
          <CardShimmer />
          <CardShimmer />
          <CardShimmer />
        </>
      ) : (
        <>
          <StatCard
            title="Total Merchants"
            value={100500}
            description={
              <p className="text-sm mt-1">
                <span className="text-[#009148]">5% More</span> than last month
              </p>
            }
            className="flex flex-col h-full"
          />
          <StatCard
            title="Merchant with active campaigns"
            value={100000}
            precision={2}
            formatter={(value) =>
              `NPR ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            description={
              <p className="text-sm mt-1">
                <span className="text-[#B5260F]">5% Less</span> than last month
              </p>
            }
            className="flex flex-col h-full"
          />
          <StatCard
            title="Merchant without active campaigns"
            value={500}
            description={
              <p className="text-sm mt-1">
                <span className="text-[#B5260F]">25% Less</span> than last month
              </p>
            }
            className="flex flex-col h-full"
          />
        </>
      )}
    </motion.div>
  );
};
