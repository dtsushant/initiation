declare interface User {
  id: string;
  email: string;
  name: string;
}

declare interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

declare interface ProtectedRouteProps {
  children: React.ReactNode;
}

declare interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}
