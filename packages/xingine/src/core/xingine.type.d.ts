export interface UIComponent {
  component: string;
  path: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  meta?: Record<string, object>;
}

export interface ModulePropertyOptions {
  uiComponent?: UIComponent;
}
