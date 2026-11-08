import { Rol } from "../../../types/Rol";
import type { IUser } from "../../../types/IUser";
import {
  findUserByEmail,
  getUsers,
  saveUsers,
} from "../../../utils/localStorage";
import { LOGIN_ROUTE, navigate } from "../../../utils/navigate";

type TipoMensaje = "error" | "exito";

const form = document.querySelector<HTMLFormElement>("#form-registro");
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

// Validación simple de formato de email.
const esEmailValido = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

if (form) {
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = leerCampo(formData, "email");
    const password = leerCampo(formData, "password");
    const confirmPassword = leerCampo(formData, "confirmPassword");

    // a) Campos vacíos.
    if (!email || !password || !confirmPassword) {
      mostrarMensaje("Completá todos los campos.", "error");
      return;
    }

    // b) Formato de email.
    if (!esEmailValido(email)) {
      mostrarMensaje("Ingresá un email válido.", "error");
      return;
    }

    // c) Longitud mínima de la contraseña.
    if (password.length < 6) {
      mostrarMensaje(
        "La contraseña debe tener al menos 6 caracteres.",
        "error"
      );
      return;
    }

    // d) Confirmación de contraseña.
    if (password !== confirmPassword) {
      mostrarMensaje("Las contraseñas no coinciden.", "error");
      return;
    }

    // e) Email ya registrado.
    if (findUserByEmail(email)) {
      mostrarMensaje("Ya existe una cuenta con ese email.", "error");
      return;
    }

    const nuevoUsuario: IUser = {
      email: email.toLowerCase(),
      password,
      role: Rol.CLIENT,
    };

    saveUsers([...getUsers(), nuevoUsuario]);
    mostrarMensaje("Cuenta creada. Redirigiendo al login...", "exito");
    form.reset();

    setTimeout(() => {
      navigate(LOGIN_ROUTE);
    }, 1500);
  });
}
