declare interface CollapsedContextProps {
  isCollapsed: boolean;
}

declare interface CollapsedProviderProps {
  children: React.ReactNode;
  value: CollapsedContextProps;
}

declare type UseCollapsedHook = () => CollapsedContextProps;
