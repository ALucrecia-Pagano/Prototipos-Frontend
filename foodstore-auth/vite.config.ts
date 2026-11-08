import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Prototipos-Frontend/foodstore-demo/" : "/",
  build: {
    outDir: "../foodstore-demo",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
      },
    },
  },
}));
