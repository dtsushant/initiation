import { routes } from '../routes';

export const flattenRoutes = (routeList: RouteConfig[]): RouteConfig[] => {
  return routeList.reduce<RouteConfig[]>((acc, route) => {
    const flatRoute = { ...route };
    const children = route.children || [];

    acc.push(flatRoute);

    children.forEach((child) => {
      acc.push({
        ...child,
        label: route.label,
        icon: route.icon,
      });
    });

    return acc;
  }, []);
};

export const findParentRoute = (path: string): string | undefined => {
  if (routes.some((route) => route.path === path)) {
    return path;
  }

  const parentRoutes = routes
    .filter((route) => path.startsWith(route.path + '/'))
    .sort((a, b) => b.path.length - a.path.length);

  return parentRoutes.length > 0 ? parentRoutes[0].path : undefined;
};
