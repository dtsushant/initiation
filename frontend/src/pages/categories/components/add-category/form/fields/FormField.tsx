import React from 'react';
import { InputField } from './InputField.tsx';
import { SelectField } from './SelectField.tsx';
import { CheckboxField } from './CheckboxField.tsx';
import { UploadField } from './UploadField.tsx';

export const FormField: React.FC<MerchantBaseFieldProps> = (props) => {
  switch (props.type) {
    case 'input':
      return <InputField {...(props as MerchantInputFieldProps)} />;
    case 'select':
      return <SelectField {...(props as MerchantSelectFieldProps)} />;
    case 'checkbox':
      return <CheckboxField {...(props as MerchantCheckboxFieldProps)} />;
    case 'upload':
      return <UploadField {...(props as MerchantUploadFieldProps)} />;
    default:
      return null;
  }
};
