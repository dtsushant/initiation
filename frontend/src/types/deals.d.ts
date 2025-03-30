declare interface Campaign {
  key: string;
  name: string;
  voucherType: string;
  numberOfVouchers: number;
  status: string;
}

declare const dealContainerVariants: {
  hidden: { opacity: number };
  visible: {
    opacity: number;
    transition: {
      staggerChildren: number;
    };
  };
};

declare const dealItemVariants: {
  hidden: { y: number; opacity: number };
  visible: {
    y: number;
    opacity: number;
    transition: {
      type: string;
      stiffness: number;
    };
  };
};

declare interface VoucherData {
  key: string;
  code: string;
  claimedDate: string;
  redeemedDate: string;
  status: string;
  claimedBy: string;
  redeemedBy: string;
}

declare interface Column {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: string) => JSX.Element;
}
