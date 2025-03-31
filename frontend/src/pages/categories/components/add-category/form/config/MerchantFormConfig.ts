const businessCategories = [
  { value: 'retail', label: 'Retail' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'financial', label: 'Financial Services' },
];

export const MerchantFormConfig: MerchantFieldProps[] = [
  {
    type: 'input',
    label: 'Merchant Name',
    name: 'merchantName',
    placeholder: 'Enter merchant name',
    rules: [{ required: true, message: 'Please input merchant name' }],
    section: 'merchantDetails',
  },
  {
    type: 'select',
    label: 'Business Category',
    name: 'businessCategory',
    placeholder: 'Select category',
    options: businessCategories,
    rules: [{ required: true, message: 'Please select business category' }],
    section: 'merchantDetails',
  },
  {
    type: 'input',
    label: 'PAN/VAT',
    name: 'panVat',
    placeholder: 'Enter PAN/VAT number',
    rules: [{ required: true, message: 'Please input PAN/VAT number' }],
    section: 'merchantDetails',
  },
  {
    type: 'input',
    label: 'Mobile Number',
    name: 'mobileNumber',
    placeholder: 'Enter mobile number',
    rules: [{ required: true, message: 'Please input mobile number' }],
    section: 'merchantDetails',
  },
  {
    type: 'input',
    label: 'Location',
    name: 'location',
    placeholder: 'Enter location',
    rules: [{ required: true, message: 'Please input location' }],
    section: 'merchantDetails',
  },

  // Contact Person Details - 3 col per row
  {
    type: 'input',
    label: 'Name',
    name: 'contactPersonName',
    placeholder: 'Enter contact person name',
    rules: [{ required: true, message: 'Please input contact person name' }],
    section: 'contactDetails',
  },
  {
    type: 'input',
    label: 'Email',
    name: 'contactPersonEmail',
    placeholder: 'Enter contact person email',
    rules: [
      { required: true, message: 'Please input contact person email' },
      { type: 'email', message: 'Please enter a valid email' },
    ],
    section: 'contactDetails',
  },
  {
    type: 'input',
    label: 'Mobile Number',
    name: 'contactPersonMobileNumber',
    placeholder: 'Enter contact mobile number',
    rules: [{ required: true, message: 'Please input contact mobile number' }],
    section: 'contactDetails',
  },

  // Merchant Status - takes whole row
  {
    type: 'checkbox',
    label: '',
    name: 'enableMerchant',
    text: 'Enable This Merchant',
    className: 'mt-8',
    section: 'merchantStatus',
    colSpan: 3, // Takes full width (3 columns)
  },

  // Business Media - 2 col per row
  {
    type: 'upload',
    label: 'Business Logo (optional)',
    name: 'businessLogo',
    buttonText: 'Upload Logo',
    section: 'businessMedia',
  },
  {
    type: 'upload',
    label: 'Business Icon (optional)',
    name: 'businessIcon',
    buttonText: 'Upload Icon',
    section: 'businessMedia',
  },
];
