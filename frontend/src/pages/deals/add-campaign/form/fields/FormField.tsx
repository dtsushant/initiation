import React from 'react';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { UploadField } from './UploadField';
import { DateField } from './DateField';
import { RadioField } from './RadioField';
import { MultiSelectField } from './MultiSelectField';

export const FormField: React.FC<CampaignBaseFieldProps> = (props) => {
  switch (props.type) {
    case 'input':
      return <InputField {...(props as CampaignInputFieldProps)} />;
    case 'select':
      return <SelectField {...(props as CampaignSelectFieldProps)} />;
    case 'checkbox':
      return <CheckboxField {...(props as CampaignCheckboxFieldProps)} />;
    case 'upload':
      return <UploadField {...(props as CampaignUploadFieldProps)} />;
    case 'date':
      return <DateField {...(props as CampaignDateFieldProps)} />;
    case 'radio':
      return <RadioField {...(props as CampaignRadioFieldProps)} />;
    case 'multiSelect':
      return <MultiSelectField {...(props as CampaignMultiSelectFieldProps)} />;
    default:
      return null;
  }
};
