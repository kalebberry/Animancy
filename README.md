# The Eien Framework: A Design System Template

Welcome to the Eien Framework, a complete design system and website starter kit built with Astro, SCSS, and a modern token-based architecture. This template is designed for creating clean, content-focused web experiences with a calm, monochrome aesthetic inspired by manga and inkwork.

The `index.astro` page serves as a living style guide and a demonstration of all core features.

---

## 🚀 Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This command will automatically:
    - Generate CSS variables and SCSS maps from your design tokens.
    - Start the Astro development server at `http://localhost:4321`.

---

## 🏛️ Core Architecture

This project is built on a clear, layered architecture that separates design decisions from implementation.

### 1. Design Tokens (`/src/design-tokens/tokens.json`)

This file is the **single source of truth** for your core design system. All fundamental visual properties like colors and the typographic scale are defined here.

- **To change colors or typography:** Modify the values in `tokens.json`.
- **To apply changes:** The `npm run dev` command automatically runs the `npm run tokens` script, which executes `convert-tokens.js`. This script reads `tokens.json` and generates the necessary CSS variables and SCSS maps.

### 2. SCSS (`/src/styles/`)

The styling is managed by a professional-grade SCSS architecture divided into logical layers:

- **/abstracts:** Contains all variables, functions, mixins, and design tokens (both token-generated and SCSS-native). This is the "brains" of the system.
- **/base:** Global styles for the entire project, like resets and default typography for `<body>`, `<h1>`, etc.
- **/components:** Styles for individual, reusable components like buttons and cards.
- **/compositions:** Styles for layout patterns like the grid system.
- **/utilities:** Low-level utility classes like `.padding-*` and `.margin-*`.

---

## 🛠️ How to Use the System

This template provides a comprehensive set of tools to build consistent and beautiful user interfaces.

### Layouts (Grid & Flexbox)

The system includes a powerful, dual-engine layout system for creating responsive page structures.

- **`.grid` (CSS Grid):** For complex, two-dimensional layouts.
- **`.flex-grid` (Flexbox):** For simpler, one-dimensional wrapping rows.

Both engines use a `data-cols` attribute for defining column counts and a `data-span` attribute for creating wider items.

**Example:**

```html
<!-- A 4-column responsive grid -->
<div class="grid" data-cols="4" style="--gutter: 1rem;">
	<div class="card">...</div>
	<div class="card" data-span="2">This one is wider</div>
	...
</div>
```

> For a complete guide, see **Grid System Documentation**.

### Typography

The fluid typography system ensures text scales smoothly across all screen sizes. All font sizes are generated from `tokens.json`.

**Usage:**

Apply `.fs-step-*` utility classes to any element to set its font size.

```html
<h1 class="fs-step-5">A Major Headline</h1>
<p class="fs-step-0">Body text that scales fluidly.</p>
```

> For a complete guide, see **Typography System Documentation**.

### Spacing (Padding & Margin)

The spacing system is managed within SCSS and provides a full set of utility classes for `margin` and `padding`.

- **Configuration:** The spacing scale is defined in the `$space` map inside `src/styles/abstracts/_space-sizes.scss`.
- **Generation:** The `src/styles/utilities/_spacing.scss` file loops over this map to generate all utility classes.

**Usage:**

```html
<!-- Apply padding to all sides -->
<div class="padding-16">...</div>

<!-- Apply margin only to the top -->
<div class="margin-block-start-32">...</div>
```

### Colors

All theme colors are generated from the `color` object in `tokens.json`. The system automatically generates CSS variables for both light and dark modes.

**Usage:**

Use the semantic CSS variables in your styles.

```css
.my-component {
	background-color: var(--background);
	color: var(--text);
	border: 1px solid var(--border-weak);
}
```

---

## 🧩 Components

This template includes a set of pre-styled components that you can use and extend. The `index.astro` page serves as a live component library.

- `.card--bw`: The standard card component.
- `.btn`, `.btn--primary`, `.btn--ghost`: Button variants.
- `.tag`: A small, pill-shaped tag for metadata.
- `.poster`: A figure with a stylized image placeholder.

---

## ✨ Client-Side Interactivity (Vue.js)

For interactive components ("islands of interactivity"), this template uses Astro's official **Vue.js integration**, along with **Pinia** for state management.

### Hydrating Vue Components

Instead of using Astro's `client:*` directives, this template uses a manual hydration approach for more control. This is handled by scripts in the `/src/hydrate/` directory.

**Workflow:**

1.  **Create your Vue component** (e.g., `MyComponent.vue`) in `/src/components/vue/`.
2.  **Add a target element** with a unique ID in your `.astro` file where you want the component to appear.
    ```html
    <div id="my-vue-app"></div>
    ```
3.  **Mount the component** in a hydration script (e.g., `/src/hydrate/landing.ts`). Use the `initPinia` helper utility to mount your component and provide Pinia state management.

    ```typescript
    import { initPinia } from '@/utils/initPinia';
    import MyComponent from '@/components/vue/MyComponent.vue';

    initPinia(MyComponent, '#my-vue-app');
    ```

## 📜 Available Scripts

All scripts are defined in `package.json`.

- `npm run dev`: Starts the development server with automatic token generation.
- `npm run build`: Builds the site for production.
- `npm run preview`: Previews the production build locally.
- `npm run tokens`: Manually regenerates design tokens.
- `npm run scss`: Manually compiles SCSS to CSS.
