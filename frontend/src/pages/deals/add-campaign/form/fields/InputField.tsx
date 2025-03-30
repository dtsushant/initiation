import React, { useState } from 'react';
import { Form, Input } from 'antd';

export const InputField: React.FC<CampaignInputFieldProps> = ({
  label,
  name,
  placeholder,
  rules,
  className = 'mb-4',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <Input
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`h-12 rounded-lg transition-all duration-300 ${
          isFocused
            ? 'border-orange-500 shadow-sm shadow-orange-100'
            : 'border-gray-300 hover:border-orange-300'
        }`}
      />
    </Form.Item>
  );
};
