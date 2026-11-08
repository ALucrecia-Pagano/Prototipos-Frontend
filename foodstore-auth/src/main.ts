import { obtenerZona } from "./utils/auth";
import { getSession, seedAdmin } from "./utils/localStorage";
import { HOME_POR_ROL, LOGIN_ROUTE, navigate } from "./utils/navigate";

// Guard centralizado: valida sesión y rol en cada carga de página.
export const protegerRuta = (): void => {
  // Asegura que exista el administrador por defecto.
  seedAdmin();

  const zona = obtenerZona(window.location.pathname);
  const sesion = getSession();

  // Raíz: siempre redirige según haya sesión o no.
  if (zona === "raiz") {
    if (sesion) {
      navigate(HOME_POR_ROL[sesion.role]);
    } else {
      navigate(LOGIN_ROUTE);
    }
    return;
  }

  // Públicas: con sesión se manda a su home; sin sesión se deja pasar.
  if (zona === "publica") {
    if (sesion) {
      navigate(HOME_POR_ROL[sesion.role]);
    }
    return;
  }

  // Zonas protegidas (admin o client).
  if (!sesion) {
    navigate(LOGIN_ROUTE);
    return;
  }

  // Sin permiso para esta zona: se redirige a su propio home.
  if (sesion.role !== zona) {
    navigate(HOME_POR_ROL[sesion.role]);
    return;
  }

  // Tiene permiso: se muestra la página.
  document.body.style.visibility = "visible";
};

protegerRuta();

// Al volver con el botón "Atrás" desde bfcache, se vuelve a validar.
window.addEventListener("pageshow", (e: PageTransitionEvent) => {
  if (e.persisted) protegerRuta();
});
