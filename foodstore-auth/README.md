# Food Store — TP TypeScript & Autenticación

Sistema de registro, login y control de acceso por roles desarrollado con Vite, TypeScript y `localStorage`, sin frameworks de UI.
Incluye protección centralizada de rutas y una interfaz oscura con portadas fotográficas en las pantallas de autenticación.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abrí la URL que muestra Vite en la terminal (por defecto `http://localhost:5173`). La aplicación arranca en el login.

## Usuario admin de prueba

| Email | Contraseña |
| --- | --- |
| `admin@foodstore.com` | `admin123` |

Este usuario se crea automáticamente al cargar la aplicación (seed). Los usuarios de tipo cliente se crean desde la pantalla de registro.

## Estructura de carpetas

```
index.html                      Punto de entrada; carga el guard
public/img/hero-burger.jpg      Imagen de portada del login
public/img/hero-parrilla.jpg    Imagen de portada del registro
src/main.ts                     Guard centralizado (protegerRuta) y revalidación con pageshow
src/style.css                   Estilos globales (tema oscuro, tarjetas, portadas)
src/types/Rol.ts                Enum de roles (ADMIN, CLIENT)
src/types/IUser.ts              IUser y SessionUser
src/utils/auth.ts               Zonas de la app, logout y utilidades de autenticación
src/utils/localStorage.ts       Acceso tipado a users y userData (con type guards)
src/utils/navigate.ts           Navegación, LOGIN_ROUTE y HOME_POR_ROL
src/pages/auth/login/login.html Login (marcado)
src/pages/auth/login/login.ts   Validación de credenciales y creación de sesión
src/pages/auth/registro/registro.html  Registro (marcado)
src/pages/auth/registro/registro.ts    Validación y alta de usuarios
src/pages/admin/home/home.html  Panel de administración
src/pages/admin/home/home.ts    Logout y email de la sesión
src/pages/client/home/home.html Inicio del cliente
src/pages/client/home/home.ts   Logout y email de la sesión
```

## Cómo funciona

### Registro

Valida, en orden y cortando al primer error: campos vacíos, formato de email, contraseña de al menos 6 caracteres, confirmación de contraseña y email no duplicado (comparación sin distinguir mayúsculas).
Si todo es correcto, guarda el usuario en la clave `users` con rol `client` y redirige al login. No inicia sesión automáticamente.

### Login

Busca el email en `users` y compara la contraseña. Si coincide, guarda la sesión en la clave `userData` **sin la contraseña** (solo email y rol) y redirige al home correspondiente según el rol.
Si el email no existe o la contraseña no coincide, muestra el mismo mensaje en ambos casos para no revelar cuál falló.

### Guard de rutas

`protegerRuta()` vive en `src/main.ts` y se carga en las 5 páginas HTML antes que el script propio de cada una.
Primero ejecuta el seed del admin, luego determina la zona según la ruta y actúa así:

| Zona | Sin sesión | Con sesión y rol correcto | Con sesión y rol incorrecto |
| --- | --- | --- | --- |
| Raíz (`/` o `index.html`) | Redirige a login | Redirige a su home | — (siempre redirige a su home) |
| Públicas (login, registro) | No hace nada | Redirige a su home | — (siempre redirige a su home) |
| `/admin/` | Redirige a login | Muestra la página | Redirige a su propio home |
| `/client/` | Redirige a login | Muestra la página | Redirige a su propio home |

## Decisiones técnicas

- **Rol como enum:** `Rol` es un `enum` de TypeScript. Por eso se quitó `erasableSyntaxOnly` del `tsconfig.json`, ya que esa opción prohíbe el uso de enums.
- **Sesión sin contraseña:** `SessionUser = Omit<IUser, "password">` garantiza que la contraseña nunca se escriba en `userData`.
- **Lectura segura de `localStorage`:** los datos de JSON se leen como `unknown` y se validan con type guards, sin usar `any`. Si la sesión guardada está corrupta, se descarta y se devuelve `null`.
- **Revalidación al volver atrás:** el evento `pageshow` (con `event.persisted`) vuelve a ejecutar el guard para que el botón Atrás del navegador no muestre una página protegida después del logout.
- **Páginas protegidas ocultas:** los homes de admin y cliente usan `visibility: hidden` hasta que el guard valida la sesión y el rol, evitando que el contenido se vea aunque sea un instante.

## Limitación

Al ser una aplicación puramente frontend, la sesión guardada en `localStorage` puede modificarse desde las DevTools del navegador.
En un sistema real, la autenticación y la validación del rol deben resolverse en un backend.

## Verificación

```bash
npx tsc --noEmit
```

El proyecto compila sin errores.

## Créditos de imágenes

- Hamburguesa (login): Foto de sk en Unsplash.
- Parrilla (registro): Foto de Amirhossein Shirdelan en Unsplash.
