import type { Rol } from "./Rol";

export interface IUser {
  email: string;
  password: string;
  role: Rol;
}

// Datos de sesión: el usuario sin su contraseña.
export type SessionUser = Omit<IUser, "password">;
