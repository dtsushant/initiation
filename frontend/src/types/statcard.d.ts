declare interface StatCardProps {
  /** Card title */
  title: string;
  /** The value displayed in the card */
  value: number | string;
  /** Number of decimal places for the value */
  precision?: number;
  /** Function to format the displayed value */
  formatter?: (value: number | string) => React.ReactNode;
  /** Icon displayed before the value */
  icon?: React.ReactNode;
  /** Additional class names for the card */
  className?: string;
  /** Custom animation variants (overrides defaults) */
  variants?: any;
  /** Whether to disable animations */
  disableAnimation?: boolean;
  /** Additional props passed to the Card component */
  cardProps?: Omit<import('antd').CardProps, 'className'>;
  /** Additional props passed to the Statistic component */
  statisticProps?: Omit<
    import('antd').StatisticProps,
    'title' | 'value' | 'precision' | 'formatter' | 'prefix'
  >;
  /** Optional callback for card click */
  onClick?: () => void;
  /** Description text to show below statistic */
  description?: React.ReactNode;
  /** Card hover effect - default is true */
  hoverEffect?: boolean;
}

declare const defaultVariants: {
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
