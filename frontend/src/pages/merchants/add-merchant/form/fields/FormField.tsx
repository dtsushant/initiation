import React from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { UploadField } from './UploadField';

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
