import React from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';

export const TableShimmer: React.FC = () => {
  const shimmerRows = Array(5).fill(0);
  const columnWidths = ['5%', '15%', '25%', '20%', '18%'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="shadow-md overflow-hidden border border-gray-100">
        {/* Header section */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <motion.div
              className="h-7 w-28 rounded-md"
              style={{
                background:
                  'linear-gradient(120deg, #e6e8eb 30%, #f0f2f5 50%, #e6e8eb 70%)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['-100% 0%', '200% 0%'],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <motion.div
            className="h-9 w-24 rounded-md"
            style={{
              background:
                'linear-gradient(120deg, #e6e8eb 30%, #f0f2f5 50%, #e6e8eb 70%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['-100% 0%', '200% 0%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
        </div>

        <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50/70 to-white/90">
          <div className="flex w-full p-3 bg-gray-50/80 border-b border-gray-100" />

          {/* Table rows with subtle hover effects */}
          <div className="relative">
            {shimmerRows.map((_, rowIndex) => (
              <motion.div
                key={`row-${rowIndex}`}
                className="flex justify-between p-4 border-b border-gray-50 hover:bg-gray-50/30 transition-colors duration-300"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: rowIndex * 0.15,
                }}
              >
                {[0, 1, 2, 3, 4].map((_, colIndex) => (
                  <motion.div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="rounded-md"
                    style={{
                      height: colIndex === 0 ? '20px' : '16px',
                      width: columnWidths[colIndex],
                      margin:
                        colIndex === 0
                          ? '0 12px 0 0'
                          : colIndex === 3
                            ? '0 0 0 12px'
                            : '0 12px',
                      background:
                        'linear-gradient(120deg, #e6e8eb 30%, #f0f2f5 50%, #e6e8eb 70%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['-100% 0%', '200% 0%'],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: rowIndex * 0.1 + colIndex * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            ))}

            {/* Primary shimmer wave */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['-100% 0%', '200% 0%'],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Secondary shimmer wave (offset) */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['-100% 0%', '200% 0%'],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            />
          </div>

          {/* Table footer with pagination */}
          <div className="flex justify-end items-center px-4 py-3 bg-gray-50/50 border-t border-gray-100">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div
                  key={`page-${i}`}
                  className="h-8 w-8 rounded-md"
                  style={{
                    background:
                      i === 0
                        ? 'linear-gradient(120deg, #e2e8f0 30%, #edf2f7 50%, #e2e8f0 70%)'
                        : 'linear-gradient(120deg, #e6e8eb 30%, #f0f2f5 50%, #e6e8eb 70%)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['-100% 0%', '200% 0%'],
                    scale: i === 0 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    backgroundPosition: {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.1,
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
