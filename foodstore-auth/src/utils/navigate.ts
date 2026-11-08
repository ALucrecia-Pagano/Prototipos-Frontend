import { Rol } from "../types/Rol";

// "/" en desarrollo, subcarpeta de GitHub Pages en el build
export const BASE = import.meta.env.BASE_URL;

export const LOGIN_ROUTE = `${BASE}src/pages/auth/login/login.html`;

export const HOME_POR_ROL: Record<Rol, string> = {
  [Rol.ADMIN]: `${BASE}src/pages/admin/home/home.html`,
  [Rol.CLIENT]: `${BASE}src/pages/client/home/home.html`,
};

export const navigate = (route: string) => {
  window.location.href = route;
};
