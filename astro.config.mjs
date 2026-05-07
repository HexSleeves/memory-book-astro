// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  prefetch: { defaultStrategy: "viewport" },
});
