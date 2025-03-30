import React from 'react';
import { Form, Radio } from 'antd';

export const RadioField: React.FC<CampaignRadioFieldProps> = ({
  label,
  name,
  options,
  rules,
  className = 'mb-4',
}) => (
  <Form.Item label={label} name={name} rules={rules} className={className}>
    <Radio.Group>
      {options.map((option) => (
        <Radio key={option.value} value={option.value} className="custom-radio">
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  </Form.Item>
);
