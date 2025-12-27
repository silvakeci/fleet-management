import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { Role } from "../../types/auth";

export default function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const role = useAppSelector((s) => s.auth.user?.role);
  if (!role) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
