import { findUserByEmail, saveSession } from "../../../utils/localStorage";
import { HOME_POR_ROL, navigate } from "../../../utils/navigate";

type TipoMensaje = "error" | "exito";

const form = document.querySelector<HTMLFormElement>("#form-login");
const mensaje = document.querySelector<HTMLParagraphElement>("#mensaje");

// Muestra un mensaje con el estilo correspondiente al tipo.
const mostrarMensaje = (texto: string, tipo: TipoMensaje): void => {
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.className = `auth__message auth__message--${tipo}`;
};

// Lee un campo del formulario como string recortado.
const leerCampo = (formData: FormData, campo: string): string => {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
};

if (form) {
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = leerCampo(formData, "email");
    const password = leerCampo(formData, "password");

    // a) Campos vacíos.
    if (!email || !password) {
      mostrarMensaje("Completá todos los campos.", "error");
      return;
    }

    // b) Credenciales inválidas: mismo mensaje para no revelar cuál falló.
    const usuario = findUserByEmail(email);
    if (!usuario || usuario.password !== password) {
      mostrarMensaje("Email o contraseña incorrectos.", "error");
      return;
    }

    // c) Sesión y redirección según el rol del usuario guardado.
    saveSession({ email: usuario.email, role: usuario.role });
    navigate(HOME_POR_ROL[usuario.role]);
  });
}
