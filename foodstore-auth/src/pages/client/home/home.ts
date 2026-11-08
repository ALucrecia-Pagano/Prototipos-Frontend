import { logout } from "../../../utils/auth";
import { getSession } from "../../../utils/localStorage";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const userEmail = document.querySelector<HTMLSpanElement>("#userEmail");

const sesion = getSession();

if (userEmail && sesion) {
  userEmail.textContent = sesion.email;
}

buttonLogout?.addEventListener("click", () => {
  logout();
});
