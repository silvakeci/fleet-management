import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAuthError, login } from "../features/auth/authSlice";
import { Button, Card, Input } from "../components/ui";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const error = useAppSelector((s) => s.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const demoUsers = useMemo(
    () => [
      { label: "Admin", email: "admin@fleet.com", password: "Admin123!" },
      { label: "Fleet Manager", email: "manager@fleet.com", password: "Manager123!" },
      { label: "Driver", email: "driver@fleet.com", password: "Driver123!" },
    ],
    []
  );

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center  from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center text-xl font-bold">
            FM
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Fleet Management
          </h1>
          <p className="text-sm text-gray-500">Sign in to your dashboard</p>
        </div>

        {/* Card */}
        <Card className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(clearAuthError());
              setSubmitting(true);
              dispatch(login({ email, password }));
              window.setTimeout(() => setSubmitting(false), 250);
            }}
          >
            <Input
              label="Email address"
              type="email"
              autoComplete="username"
              placeholder="admin@fleet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => dispatch(clearAuthError())}
              required
            />

            <Input
              label="Password"
              type="password"
              showPasswordToggle
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => dispatch(clearAuthError())}
              required
            />

            <Button type="submit" className="w-full" loading={submitting}>
              Sign in
            </Button>
          </form>

          <div className="pt-4 border-t space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Demo accounts
            </div>

            <div className="space-y-2">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-gray-50 transition"
                  onClick={() => {
                    dispatch(clearAuthError());
                    setEmail(u.email);
                    setPassword(u.password);
                  }}
                >
                  <div className="font-medium">{u.label}</div>
                  <div className="text-xs text-gray-500">
                    {u.email} / {u.password}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fleet Management Dashboard
        </p>
      </div>
    </div>
  );
}
