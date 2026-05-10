// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  image: {
    dangerouslyProcessSVG: true,
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  prefetch: { defaultStrategy: "viewport" },
  vite: {
    preview: {
      allowedHosts: ["memory-book-astro-production.up.railway.app", "mommacoq.up.railway.app"],
    },
  },
});
