import { defineConfig } from "astro/config";

import swup from '@swup/astro';

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), swup()],
});
