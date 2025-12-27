import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`;

export default function AppLayout() {
    const user = useAppSelector((s) => s.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="font-semibold">Fleet Management</div>

                        <nav className="flex gap-2 text-sm">
                            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                            <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
                            <NavLink to="/drivers" className={linkClass}>Drivers</NavLink>
                            <NavLink to="/maintenance" className={linkClass}>Maintenance</NavLink>
                            <NavLink to="/reports" className={linkClass}>Reports</NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-sm px-3 py-1 rounded bg-gray-100">
                            {user?.name} · {user?.role} · {user?.email}
                        </div>

                        <button
                            className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
                            onClick={() => {
                                dispatch(logout());
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-6 py-6">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}
