import React from 'react';
import { Form, DatePicker } from 'antd';

export const DateField: React.FC<CampaignDateFieldProps> = ({
  label,
  name,
  placeholder,
  rules,
  className = 'mb-4',
}) => (
  <Form.Item label={label} name={name} rules={rules} className={className}>
    <DatePicker
      placeholder={placeholder}
      className="w-full rounded-md h-12"
      format="YYYY-MM-DD HH:mm:ss"
      showTime={{ format: 'HH:mm' }}
    />
  </Form.Item>
);
