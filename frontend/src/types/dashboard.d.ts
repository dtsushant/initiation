import {TableColumnsType} from "antd";

declare interface CategoryData {
  key: string;
  name: string;
  merchant: string;
  value: string;
  valueRaw: number;
  status: 'Active' | 'Pending' | 'Closed';
}

declare interface RecentDealsTableProps {
  columns: TableColumnsType<CategoryData>;
  data: CategoryData[];
}

declare const dashboardContainerVariants: {
  hidden: { opacity: number };
  visible: {
    opacity: number;
    transition: {
      staggerChildren: number;
    };
  };
};

declare const dashboardItemVariants: {
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
