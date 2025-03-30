import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

export const SelectField: React.FC<CampaignSelectFieldProps> = ({
  label,
  name,
  placeholder,
  options,
  rules,
  className = 'mb-4',
}) => (
  <Form.Item label={label} name={name} rules={rules} className={className}>
    <Select placeholder={placeholder} className="rounded-md h-12">
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);
