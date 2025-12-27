import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function RequireAuth() {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
