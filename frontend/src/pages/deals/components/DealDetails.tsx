import React from 'react';
import { Card, Row, Col, Tag, Table, Divider } from 'antd';
import { motion } from 'framer-motion';
import { useStyle } from '/@/utils/ant';

const DealDetails = () => {
  const { styles } = useStyle();
  const voucherData: VoucherData[] = [
    {
      key: '1',
      code: 'SAVE20NOW',
      claimedDate: 'May 15, 2024, 6:10 PM',
      redeemedDate: 'February 22, 2025, 6:35 AM',
      status: 'Redeemed',
      claimedBy: 'Manoj Khatri, 9843072022, March 12, 2025, 11:00 PM',
      redeemedBy:
        'Manoj Khatri, 9843072022, March 12, 2025, 12:00 PM, at 1234 Maharajgunj Street, Kathmandu, Nepal',
    },
    {
      key: '2',
      code: 'SAVE20NOW',
      claimedDate: 'April 08, 2026, 2:30 PM',
      redeemedDate: 'July 12, 2024, 9:45 AM',
      status: 'Redeemed',
      claimedBy: 'Puskar Shrestha, 9849099891, March 12, 2025, 11:00 PM',
      redeemedBy:
        'Puskar Shrestha, 9849099891, March 12, 2025, 12:00 PM, at 1234 Maharajgunj Street, Kathmandu, Nepal',
    },
  ];

  const columns: Column[] = [
    {
      title: 'Voucher Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Claimed Date',
      dataIndex: 'claimedDate',
      key: 'claimedDate',
    },
    {
      title: 'Redeemed Date',
      dataIndex: 'redeemedDate',
      key: 'redeemedDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="green">{status}</Tag>,
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="shadow-md rounded-2xl p-6">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div className="general-details" variants={sectionVariants}>
          <h2 className="text-base font-normal text-neutral-13 mb-4">
            General Details
          </h2>

          <Row gutter={[16, 16]} className="mb-2">
            <Col xs={24} sm={24} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Campaign name:</p> Dashain 25% off
                on every items!!!
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Campaign Start Date:</p> March 15,
                2025
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Campaign End Date:</p> April 15,
                2025
              </p>
            </Col>
          </Row>
        </motion.div>

        <motion.div className="voucher-details" variants={sectionVariants}>
          <h2 className="text-base font-normal text-neutral-13 mb-4">
            Voucher Details
          </h2>
          <Row gutter={[16, 16]} className="mb-2">
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Total Numbers of Vouchers:</p> 600
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Voucher Type:</p> Percentage
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">Discount Percentage:</p> 200
              </p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="text-neutral-10">
                <p className="text-neutral-7">
                  Maximum amount that can be discounted:
                </p>{' '}
                800
              </p>
            </Col>
          </Row>
        </motion.div>

        <motion.div className="campaign-details" variants={sectionVariants}>
          <h2 className="text-base font-normal text-neutral-13 mb-4">
            Campaign Details
          </h2>
          <p className="text-neutral-10 mb-3">
            <p className="text-neutral-7">Participating Merchant:</p> Closet
            Solutions
          </p>
          <p className="text-neutral-10 mb-2">
            <p className="text-neutral-7">
              Campaign applied to following product category:
            </p>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              'Head Massage',
              'Pickup and Drop Service',
              'Home Delivery Services',
              'Jeans',
              'Summer Clothes',
              'Ovens',
              'Kitchen Upgrade Services',
              'All-in-One Cooking Solutions',
              'Premium Activewear Collection',
              'Versatile Home Design Essentials',
              'Smart Appliance Innovations',
              'Custom Kitchen Gadget Sets',
              'Trendy Fashion Hub',
              'Seamless Kitchen Integration Tools',
            ].map((category) => (
              <Tag key={category} className="mb-2">
                {category}
              </Tag>
            ))}
          </div>
        </motion.div>

        <motion.div className="vouchers-details" variants={sectionVariants}>
          <h2 className="text-base font-normal text-neutral-13 mb-4">
            Vouchers Details
          </h2>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="px-12 bg-gray-50 rounded-md">
                    <p className="text-neutral-10 mb-2">
                      <p>Claimed By:</p> {record.claimedBy}
                    </p>
                    <p className="text-neutral-10">
                      <p>Redeemed By:</p> {record.redeemedBy}
                    </p>
                  </div>
                ),
              }}
              dataSource={voucherData}
              className={styles.customTable}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DealDetails;
