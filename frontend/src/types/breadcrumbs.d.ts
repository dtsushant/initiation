declare interface BreadcrumbItem {
  title: string;
  path?: string;
}

declare interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}
