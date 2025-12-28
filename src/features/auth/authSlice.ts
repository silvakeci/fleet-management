import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginCredentials, User } from "../../types/auth";

type AuthState = {
  user: User | null;
  error: string | null;
};

const STORAGE_KEY = "fleet.auth.user";

const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "u_admin",
    name: "Admin User",
    role: "ADMIN",
    email: "admin@fleet.com",
    password: "Admin123!",
  },
  {
    id: "u_mgr",
    name: "Fleet Manager",
    role: "FLEET_MANAGER",
    email: "manager@fleet.com",
    password: "Manager123!",
  },
  {
    id: "u_driver",
    name: "Driver",
    role: "DRIVER",
    email: "driver@fleet.com",
    password: "Driver123!",
  },
];

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  try {
    if (!user) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
  }
}

const initialState: AuthState = {
  user: loadUser(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginCredentials>) {
      const email = action.payload.email.trim().toLowerCase();
      const password = action.payload.password;

      const match = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email && u.password === password
      );

      if (!match) {
        state.user = null;
        state.error = "Invalid email or password.";
        saveUser(null);
        return;
      }

      const { password: _pw, ...safeUser } = match; 
      state.user = safeUser;
      state.error = null;
      saveUser(safeUser);
    },
    logout(state) {
      state.user = null;
      state.error = null;
      saveUser(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
