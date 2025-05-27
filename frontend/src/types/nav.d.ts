interface NavProps {
  routes?: Array<{
    path: string;
    label: string;
    icon: React.ReactNode;
    roles?: string[];
  }>;
}
