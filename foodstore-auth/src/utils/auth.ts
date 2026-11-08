import { Rol } from "../types/Rol";
import { clearSession } from "./localStorage";
import { LOGIN_ROUTE, navigate } from "./navigate";

export type Zona = Rol | "publica" | "raiz";

// Determina la zona de la aplicación según la ruta actual.
export const obtenerZona = (path: string): Zona => {
  if (path.includes("/admin/")) return Rol.ADMIN;
  if (path.includes("/client/")) return Rol.CLIENT;
  if (path === "/" || path.endsWith("/index.html")) return "raiz";
  return "publica";
};

export const logout = () => {
  clearSession();
  navigate(LOGIN_ROUTE);
};
