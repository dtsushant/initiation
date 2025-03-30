declare interface MerchantData {
  key: string;
  name: string;
  category: string;
  contact: string;
  status: 'Enabled' | 'Disabled';
}

declare interface MerchantTableColumn {
  title: string;
  dataIndex?: keyof MerchantData;
  key: string;
  render?: (value: any, record: MerchantData) => React.ReactNode;
  fixed?: 'left' | 'right';
  width?: number | string;
}
