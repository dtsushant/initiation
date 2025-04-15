export interface Category {
  code: string;
  label?: string;
  description?: string;
  level: number;
  parentCategoryCode?: string;
  children?: Category[];
}
