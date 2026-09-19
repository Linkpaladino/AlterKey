import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  input: {
    main: resolve(root, "index.html"),
    settings: resolve(root, "settings.html"),
    variants: resolve(root, "variants.html"),
  },
  server: {
    cors: {
      origin: ["https://owlbear.rodeo", "https://www.owlbear.rodeo"],
    },
  },
});
