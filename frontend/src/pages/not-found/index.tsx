import React from 'react';
import { Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="text-[140px] font-bold bg-clip-text text-fieryorange-6 leading-none"
          >
            404
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Title level={2} className="text-neutral-6 mb-4">
            Page Not Found
          </Title>

          <Text className="text-neutral-9 text-lg block mb-8">
            We've searched everywhere, but it seems this page has gone missing.
            Let's get you back on track.
          </Text>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                className="bg-[#ff7300] hover:bg-brightorange-6 border-none h-12 px-8 shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
