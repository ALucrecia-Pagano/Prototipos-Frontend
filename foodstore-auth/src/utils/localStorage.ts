import { Rol } from "../types/Rol";
import type { IUser, SessionUser } from "../types/IUser";

const USERS_KEY = "users";
const SESSION_KEY = "userData";

// Valida que un valor desconocido sea un Rol válido.
const isRol = (valor: unknown): valor is Rol => {
  if (typeof valor !== "string") return false;
  return (Object.values(Rol) as string[]).includes(valor);
};

// Valida que un valor desconocido tenga la forma de IUser.
const isUser = (valor: unknown): valor is IUser => {
  if (typeof valor !== "object" || valor === null) return false;
  const user = valor as Record<string, unknown>;
  return (
    typeof user.email === "string" &&
    typeof user.password === "string" &&
    isRol(user.role)
  );
};

// Valida que un valor desconocido tenga la forma de SessionUser.
const isSessionUser = (valor: unknown): valor is SessionUser => {
  if (typeof valor !== "object" || valor === null) return false;
  const user = valor as Record<string, unknown>;
  return typeof user.email === "string" && isRol(user.role);
};

export const getUsers = (): IUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isUser);
  } catch {
    return [];
  }
};

export const saveUsers = (users: IUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): IUser | undefined => {
  const objetivo = email.trim().toLowerCase();
  return getUsers().find(
    (user) => user.email.trim().toLowerCase() === objetivo
  );
};

export const saveSession = (user: SessionUser): void => {
  // Se guarda solo email y role, nunca la contraseña.
  const session: SessionUser = { email: user.email, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isSessionUser(parsed)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const seedAdmin = (): void => {
  if (findUserByEmail("admin@foodstore.com")) return;
  const admin: IUser = {
    email: "admin@foodstore.com",
    password: "admin123",
    role: Rol.ADMIN,
  };
  saveUsers([...getUsers(), admin]);
};
