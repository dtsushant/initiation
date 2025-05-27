import { useSelector } from "react-redux";
import { Comrade } from "@xingine";

interface AccessGuardProps {
  comrade: Comrade;
  roles?: string[];
  permissions?: string[];
  children: React.ReactNode;
}

export const AccessGuard = ({
  comrade,
  roles,
  permissions,
  children,
}: AccessGuardProps) => {
  const hasRole = true; //roles ? roles.some(role => comrade.roles.includes(role)) : true;
  const hasPermission = true; //permissions ? permissions.some(p => comrade.permissions.includes(p)) : true;

  if (!hasRole || !hasPermission) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};
