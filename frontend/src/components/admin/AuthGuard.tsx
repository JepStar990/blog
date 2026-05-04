import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
}
