import React from 'react';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const CustomUpload = ({ value, onChange, ...props }: any & UploadProps) => {
  const fileList = value ? (Array.isArray(value) ? value : [value]) : [];

  const handleChange = (info: any) => {
    if (onChange) {
      onChange(info.fileList);
    }
  };

  return (
    <Upload {...props} fileList={fileList} onChange={handleChange}>
      {props.children}
    </Upload>
  );
};

export const UploadField: React.FC<MerchantUploadFieldProps> = ({
  label,
  name,
  buttonText,
  className = 'mb-4',
}) => (
  <Form.Item label={label} name={name} className={className}>
    <CustomUpload
      maxCount={1}
      listType="picture"
      beforeUpload={() => false}
      accept="image/*"
    >
      <Button icon={<UploadOutlined />} className="rounded-md h-10">
        {buttonText}
      </Button>
    </CustomUpload>
  </Form.Item>
);
