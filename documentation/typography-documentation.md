# ✒️ Fluid Typography System: A Deep Dive

Welcome to the documentation for the project's fluid typography system. This guide explains how to create beautiful, scalable, and readable text that adapts seamlessly to any screen size.

The system is built on modern CSS features to provide a smooth, linear scaling of font sizes, eliminating the abrupt jumps often seen with traditional breakpoint-based typography.

---

## 1. Core Concept: Fluidity with `clamp()`

The entire system is powered by the CSS `clamp()` function. Instead of defining static font sizes for different screen widths, we define a _range_ within which the font size can grow or shrink.

### The `clamp()` Formula

Each font size variable in our system follows this structure:

```css
:root {
	--fs-step-0: clamp(MINIMUM_SIZE, PREFERRED_SIZE, MAXIMUM_SIZE);
}
```

- **`MINIMUM_SIZE`**: The absolute smallest the font will get. This ensures readability on the narrowest screens.
- **`PREFERRED_SIZE`**: A dynamic value that scales with the viewport's width. We use the `vi` (viewport inline) unit, which is `1%` of the viewport's width. This is the "fluid" part of the equation.
- **`MAXIMUM_SIZE`**: The absolute largest the font will get. This prevents text from becoming excessively large on ultra-wide displays.

**Example:**

```css
/* From main.css */
--fs-step-2: clamp(1.1863rem, 1.0335rem + 0.6516vi, 1.62rem);
```

This single line of code replaces multiple media queries, resulting in perfectly fluid text scaling.

---

## 2. The Typographic Scale

The system provides a pre-defined modular scale of font sizes, available as CSS custom properties. These steps are designed to create a harmonious visual hierarchy.

The available steps range from `--fs-step-000` (smallest) to `--fs-step-12` (largest).

| Variable        | Typical Use Case     |
| --------------- | -------------------- |
| `--fs-step-000` | Fine print, legal    |
| `--fs-step-00`  | Small text, captions |
| `--fs-step-0`   | Body copy            |
| `--fs-step-1`   | Large body, lead-in  |
| `--fs-step-2`   | Subheadings (h4)     |
| `--fs-step-3`   | Subheadings (h3)     |
| `--fs-step-4`   | Headings (h2)        |
| `--fs-step-5`   | Main headings (h1)   |
| `...`           |                      |
| `--fs-step-12`  | Hero/display titles  |

---

## 3. Usage with Utility Classes

The easiest way to apply these font sizes is through the provided utility classes.

### Basic Font Size Utilities

Apply a font size directly to an element using the `.fs-step-{N}` classes.

```html
<h1 class="fs-step-5">This is a Major Headline</h1>
<h2 class="fs-step-4">This is a Sub-Headline</h2>
<p class="fs-step-0">
	This is a paragraph of body text. It will scale smoothly based on the viewport width, ensuring
	it's always comfortable to read.
</p>
<small class="fs-step-00">This is some smaller caption text.</small>
```

### Responsive Font Size Utilities

For more explicit control, you can change the font size at specific breakpoints using responsive prefixes (`sm:`, `md:`, `lg:`). This is useful for adjusting typographic hierarchy on different screen sizes.

- `sm:` applies at `min-width: 40rem`
- `md:` applies at `min-width: 64rem`
- `lg:` applies at `min-width: 80rem`

```html
<!-- Starts as a large headline, but gets even bigger on medium screens -->
<h1 class="fs-step-5 md:fs-step-7">A Responsive Headline</h1>

<!-- Starts as body text, but becomes a lead paragraph on small screens -->
<p class="fs-step-0 sm:fs-step-1">
	This paragraph gets slightly larger on wider screens to improve readability in a wider content
	column.
</p>
```

---s

## 4. Font Families

The project uses two primary font families, imported from Google Fonts in `src/styles/abstracts/_typography.scss`:

- **Body & UI:** `Fira Sans` (applied to `body`)
- **Headings:** `PT Serif` (applied to `h1`, `h2`, `h3`, `h4`)

This provides a clean, classic look with a sans-serif for readability and a serif for impactful headlines.
