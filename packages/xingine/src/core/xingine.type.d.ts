export interface UIComponent {
  component: string;
  path: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  meta?: Record<string, object>;
}

export interface Permission {
  name: string;
  description: string;
}

export interface ModulePropertyOptions {
  uiComponent?: UIComponent;
  permissions: Permission[];
  description?: string;
}

export interface ModuleProperties extends ModulePropertyOptions {
  name: string;
}
