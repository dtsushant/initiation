import React from 'react';
import { motion } from 'framer-motion';

export const DealsCardShimmer: React.FC = () => (
  <motion.div
    className="rounded-lg p-6 flex flex-col h-full relative overflow-hidden"
    style={{
      background: 'linear-gradient(to right, #ffffff, #ffff)',
    }}
    animate={{
      boxShadow: [
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {/* Primary shimmer effect */}
    <motion.div
      className="absolute inset-0 z-0"
      style={{
        background: 'linear-gradient(to right, #ffffff, #ffff)',
      }}
      animate={{
        backgroundPosition: ['-100% 0%', '200% 0%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />

    <motion.div
      className="absolute inset-0 z-1"
      style={{
        background: 'linear-gradient(to right, #ffffff, #ffff)',
      }}
      animate={{
        backgroundPosition: ['-100% 0%', '200% 0%'],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.3,
      }}
    />

    <motion.div
      className="h-8 w-8 rounded"
      style={{
        background: '#e2e8f0',
      }}
      animate={{
        opacity: [0.7, 0.9, 0.7],
        scale: [1, 0.98, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.2,
      }}
    />

    <div className="flex justify-between items-center my-4 relative z-10">
      <motion.div
        className="h-7 w-[70px] rounded"
        style={{
          background: '#e2e8f0',
        }}
        animate={{
          opacity: [0.7, 0.9, 0.7],
          scale: [1, 0.98, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>

    <motion.div
      className="h-5 w-32 rounded"
      style={{
        background: '#e2e8f0',
      }}
      animate={{
        opacity: [0.7, 0.9, 0.7],
        scale: [1, 0.98, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.2,
      }}
    />
  </motion.div>
);
