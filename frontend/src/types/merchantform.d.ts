declare interface MerchantFormValues {
  merchantName: string;
  businessCategory: string;
  panVat: string;
  mobileNumber: string;
  location: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonMobileNumber: string;
  enableMerchant: boolean;
  businessLogo?: any[];
  businessIcon?: any[];
}

declare type MerchantFormSection =
  | 'merchantDetails'
  | 'contactDetails'
  | 'merchantStatus'
  | 'businessMedia';

declare interface MerchantBaseFieldProps {
  type: string;
  label: string;
  name: keyof MerchantFormValues | string;
  rules?: import('antd/es/form').Rule[];
  className?: string;
  section?: MerchantFormSection;
  colSpan?: number;
}

declare interface MerchantInputFieldProps extends MerchantBaseFieldProps {
  type: 'input';
  placeholder?: string;
}

declare interface MerchantSelectFieldProps extends MerchantBaseFieldProps {
  type: 'select';
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

declare interface MerchantCheckboxFieldProps extends MerchantBaseFieldProps {
  type: 'checkbox';
  text: string;
}

declare interface MerchantUploadFieldProps extends MerchantBaseFieldProps {
  type: 'upload';
  buttonText: string;
}

declare interface MerchantFieldProps {
  type: 'input' | 'select' | 'checkbox' | 'upload';
  label: string;
  name: keyof MerchantFormValues | string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rules?: import('antd/es/form').Rule[];
  text?: string;
  className?: string;
  buttonText?: string;
  section?: MerchantFormSection;
  colSpan?: number;
}
