declare interface CampaignFormValues {
  campaignName: string;
  totalVouchers: string;
  voucherType: string;
  discountPercentage: string;
  maxDiscountAmount: string;
  appliedMerchants: string;
  appliedProducts: string[];
  scheduleCampaign: 'schedule' | 'publish';
  campaignStartDate: Date;
  campaignEndDate: Date;
}

declare type CampaignFormSection =
  | 'generalDetails'
  | 'voucherDetails'
  | 'campaignDetails'
  | 'scheduleCampaign'
  | 'scheduleCampaignDate';

declare interface CampaignBaseFieldProps {
  type: string;
  label: string;
  name: keyof CampaignFormValues | string;
  rules?: import('antd/es/form').Rule[];
  className?: string;
  section?: CampaignFormSection;
  colSpan?: number;
}

declare interface CampaignInputFieldProps extends CampaignBaseFieldProps {
  type: 'input';
  placeholder?: string;
}

declare interface CampaignSelectFieldProps extends CampaignBaseFieldProps {
  type: 'select';
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

declare interface CampaignCheckboxFieldProps extends CampaignBaseFieldProps {
  type: 'checkbox';
  text: string;
}

declare interface CampaignUploadFieldProps extends CampaignBaseFieldProps {
  type: 'upload';
  buttonText: string;
}

declare interface CampaignDateFieldProps extends CampaignBaseFieldProps {
  type: 'date';
  placeholder?: string;
}

declare interface CampaignRadioFieldProps extends CampaignBaseFieldProps {
  type: 'radio';
  options: Array<{ value: string; label: string }>;
}

declare interface CampaignMultiSelectFieldProps extends CampaignBaseFieldProps {
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

declare interface CampaignFieldProps {
  type:
    | 'input'
    | 'select'
    | 'checkbox'
    | 'upload'
    | 'date'
    | 'radio'
    | 'multiSelect';
  label: string;
  name: keyof CampaignFormValues | string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rules?: import('antd/es/form').Rule[];
  text?: string;
  className?: string;
  buttonText?: string;
  section?: CampaignFormSection;
  colSpan?: number;
  dependsOn?: string;
  showWhen?: string;
}
