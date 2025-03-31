declare interface RouteConfig {
  label: string;
  path: string;
  icon: React.ReactNode;
  element: React.ReactNode;
  children?: Omit<RouteConfig, | 'icon'>[];
}
