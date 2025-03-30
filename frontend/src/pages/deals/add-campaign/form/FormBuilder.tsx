import React from 'react';
import { Form, Button, Divider } from 'antd';
import { motion } from 'framer-motion';
import { FormField } from './fields/FormField';
import { FormConfig } from './config/FormConfig';
import { showToast } from '/@/utils/toast';
import { useNavigate } from 'react-router-dom';

const CustomFormBuilder: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const voucherType = Form.useWatch('voucherType', form);

  const handleSubmit = (values: MerchantFormValues) => {
    showToast.success('New campaign has been added successfully');
    navigate('/deals');
  };

  const handleSaveDraft = () => {
    form
      .validateFields()
      .then((values) => {
        showToast.success('New campaign has been saved as draft successfully');
        navigate('/deals');
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleSubmitFailed = (_errorInfo: any) => {
    // showToast.error("Form submission failed. Please check the errors!");
  };

  const handleCancel = () => {
    navigate('/deals');
  };

  // Group fields by section
  const generalDetails = FormConfig.filter(
    (field) => field.section === 'generalDetails'
  ) as CampaignBaseFieldProps[];

  // Filter voucher details based on selection
  const voucherDetails = FormConfig.filter(
    (field) =>
      field.section === 'voucherDetails' &&
      (!field.dependsOn || !field.showWhen || field.showWhen === voucherType)
  ) as CampaignBaseFieldProps[];

  const campaignDetails = FormConfig.filter(
    (field) => field.section === 'campaignDetails'
  ) as CampaignBaseFieldProps[];
  const scheduleCampaign = FormConfig.filter(
    (field) => field.section === 'scheduleCampaign'
  ) as CampaignBaseFieldProps[];
  const scheduleCampaignDate = FormConfig.filter(
    (field) => field.section === 'scheduleCampaignDate'
  ) as CampaignBaseFieldProps[];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white"
    >
      <Form
        form={form}
        name="merchant_form"
        layout="vertical"
        initialValues={{ enableMerchant: true }}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        className="w-full"
      >
        <h2 className="text-base font-medium mb-3">General Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
          {generalDetails.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <h2 className="text-base font-medium mb-3">Voucher Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
          {voucherDetails.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <h2 className="text-base font-medium mb-3">Campaign Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {campaignDetails.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <div className="mb-8">
          {scheduleCampaign.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          {scheduleCampaignDate.map((field) => (
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
            type="default"
            className="w-fit rounded-md h-10 hover:border-primary hover:text-primary font-medium"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-fit rounded-md bg-primary hover:bg-primary-hover h-10 text-white font-medium ml-4"
          >
            Publish
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default CustomFormBuilder;
