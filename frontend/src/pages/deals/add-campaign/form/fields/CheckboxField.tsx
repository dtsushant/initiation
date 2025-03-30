import React from 'react';
import { Form, Checkbox } from 'antd';

export const CheckboxField: React.FC<CampaignCheckboxFieldProps> = ({
  name,
  text,
  className = 'mb-4',
}) => (
  <Form.Item name={name} valuePropName="checked" className={className}>
    <Checkbox>{text}</Checkbox>
  </Form.Item>
);
