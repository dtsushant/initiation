import React from 'react';
import { Form, Button, Divider } from 'antd';
import { motion } from 'framer-motion';
import { FormField } from './fields/FormField';
import { MerchantFormConfig } from './config/MerchantFormConfig';
import { showToast } from '/@/utils/toast';
import { useNavigate } from 'react-router-dom';

const CustomFormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (values: MerchantFormValues) => {
    showToast.success('Merchant has been successfully onboarded to the system');
    navigate('/merchants');
  };

  const handleSubmitFailed = (_errorInfo: any) => {
    // showToast.error("Form submission failed. Please check the errors!");
  };

  const handleCancel = () => {
    navigate('/merchants');
  };

  // Group fields by section
  const merchantDetails = MerchantFormConfig.filter(
    (field) => field.section === 'merchantDetails'
  );
  const contactDetails = MerchantFormConfig.filter(
    (field) => field.section === 'contactDetails'
  );
  const merchantStatus = MerchantFormConfig.filter(
    (field) => field.section === 'merchantStatus'
  );
  const businessMedia = MerchantFormConfig.filter(
    (field) => field.section === 'businessMedia'
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white"
    >
      <Form
        name="merchant_form"
        layout="vertical"
        initialValues={{ enableMerchant: true }}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        className="w-full"
      >
        <h2 className="text-base font-medium mb-4">Merchant Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {merchantDetails.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <h2 className="text-base font-medium mb-4 mt-8">
          Contact Person Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {contactDetails.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <div className="mb-6">
          {merchantStatus.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {businessMedia.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <Divider />

        <Form.Item className="mt-6 flex justify-end">
          <Button
            type="default"
            className="w-fit rounded-md border border-gray-300 h-10 text-gray-700 font-medium mr-4"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-fit rounded-md bg-primary hover:bg-primary-hover h-10 text-white font-medium"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default CustomFormBuilder;
