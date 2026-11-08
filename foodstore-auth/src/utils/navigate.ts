import { Rol } from "../types/Rol";

export const LOGIN_ROUTE = "/src/pages/auth/login/login.html";

export const HOME_POR_ROL: Record<Rol, string> = {
  [Rol.ADMIN]: "/src/pages/admin/home/home.html",
  [Rol.CLIENT]: "/src/pages/client/home/home.html",
};

export const navigate = (route: string) => {
  window.location.href = route;
};
