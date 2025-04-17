declare interface RouteConfig {
  label: string;
  path: string;
  icon: React.ReactNode;
  element: React.ReactNode;
  hasSlug?: boolean;
  children?: Omit<RouteConfig, "icon">[];
}
