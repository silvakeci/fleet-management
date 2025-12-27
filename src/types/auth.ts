export type Role = "ADMIN" | "FLEET_MANAGER" | "DRIVER";

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
