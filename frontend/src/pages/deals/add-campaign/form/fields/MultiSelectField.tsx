import React, { useState } from 'react';
import { Form, Select, Tooltip } from 'antd';

const { Option } = Select;

export const MultiSelectField: React.FC<CampaignMultiSelectFieldProps> = ({
  label,
  name,
  placeholder,
  options,
  rules,
  className = 'mb-4',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <Select
        mode="multiple"
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxTagCount="responsive"
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip
            styles={{ root: { pointerEvents: 'none' } }}
            title={omittedValues.map(({ label }) => label).join(', ')}
          >
            <span>...</span>
          </Tooltip>
        )}
        className={`h-12 rounded-lg transition-all duration-300 ${
          isFocused
            ? 'border-orange-500 shadow-sm shadow-orange-100'
            : 'border-gray-300 hover:border-orange-300'
        }`}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
