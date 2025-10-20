# 📐 The Auto-Grid System: A Deep Dive

Welcome to the detailed documentation for the Auto-Grid system. This guide provides an in-depth look at how to build modern, intrinsically responsive layouts using this powerful set of CSS classes and conventions.

The system is built on two core layout engines—CSS Grid and Flexbox—and enhanced with custom properties, data attributes, and container queries to create layouts that adapt to their available space without relying on traditional media query breakpoints.

---

## 1. Core Concepts

### Layout Engines

The system offers two distinct layout "engines." You choose one by applying its class to a container element.

- **`.grid` (CSS Grid):** The primary and most powerful engine. It's best for two-dimensional layouts, creating responsive column grids, and handling complex scenarios like item spanning and "dense" packing. It uses `display: grid`.
- **`.flex-grid` (Flexbox):** A simpler engine for one-dimensional layouts. It's ideal for creating rows of items that wrap gracefully and share space equally. It uses `display: flex` with `flex-wrap: wrap`.

### Custom Properties (CSS Variables)

The grid's behavior is controlled by a set of CSS custom properties. You can set these inline via a `style` attribute or in your own CSS.

- `--gutter`: The space between grid or flex items. Defaults to `1rem`.
- `--grid-min-item-size`: The minimum desired width for an item in a `.grid`. The grid will create as many columns of this width as can fit. Defaults to `16rem`.
- `--grid-placement`: Controls the algorithm for placing items. Can be `auto-fit` (default, collapses empty tracks) or `auto-fill` (preserves empty tracks).

### Container Queries

Instead of reacting to the viewport's width, our components can react to the width of their parent container. This is achieved by wrapping a grid in a dedicated container element. This makes components truly modular and reusable.

- `.grid-container`
- `.sidebar-grid__container`
- `.masonry__container`

These classes apply `container-type: inline-size`, which "turns on" query abilities for their children.

---

## 2. The `.grid` Engine in Detail

The `.grid` class is the heart of the system. Its default behavior is to create as many columns as can fit in the available space.

### The Auto-Grid Formula

The magic behind the auto-responsive grid is this line:

```css
grid-template-columns: repeat(
	var(--grid-placement, auto-fit),
	minmax(var(--grid-min-item-size, 16rem), 1fr)
);
```

- `repeat(auto-fit, ...)`: Creates as many columns as will fit, and collapses any empty column tracks, allowing filled tracks to expand and take up the remaining space.
- `minmax(16rem, 1fr)`: Each column will be at least `16rem` wide (or whatever `--grid-min-item-size` is set to). If there's extra space in the container, all columns will share it equally (because of `1fr`).

**Example: Basic Auto-Grid**

```html
<div class="grid gap-4" style="--grid-min-item-size: 15rem;">
	<div class="card">Item 1</div>
	<div class="card">Item 2</div>
	<div class="card">Item 3</div>
	<div class="card">Item 4</div>
	<div class="card">Item 5</div>
</div>
```

_On a wide screen, this might show 5 columns. As the screen narrows, it will automatically reflow to 4, 3, 2, and finally 1 column, without any media queries._

### Fixed Column Counts with `data-cols`

For more explicit control, you can use the `data-cols="N"` attribute to specify a target number of columns. This works by dynamically calculating an appropriate `--grid-min-item-size` to achieve the desired column count.

```html
<!-- This grid will aim for a 4-column layout -->
<div class="grid gap-4" data-cols="4">
	<div class="card">1</div>
	<div class="card">2</div>
	<div class="card">3</div>
	<div class="card">4</div>
	<div class="card">5</div>
	<!-- Wraps to the next row -->
</div>
```

_This still wraps gracefully on smaller screens when the calculated minimum size can no longer be maintained._

### Spanning Columns and Rows

You can make an item span multiple tracks using the `data-span` and `data-row-span` attributes. This is perfect for featured items or creating asymmetrical layouts.

```html
<div class="grid gap-4" data-cols="3">
	<!-- This item will take up the space of 2 columns -->
	<div class="card" data-span="2">Featured Item</div>
	<div class="card">Regular Item</div>
	<div class="card">Another Regular</div>
	<div class="card">And Another</div>
</div>
```

### Dense Packing

When using spans, the default grid algorithm might leave gaps. By adding the `.grid--dense` class, you instruct the grid to use a "dense" packing algorithm. This will cause later items in the grid to backfill any empty slots, creating a "masonry" or "Tetris-like" effect.

```html
<div class="grid grid--dense gap-4" data-cols="4">
	<div class="card" data-span="2">Wide Item</div>
	<div class="card" data-row-span="2">Tall Item</div>
	<div class="card">Small Item 1</div>
	<div class="card">Small Item 2</div>
	<div class="card">Small Item 3 (might backfill a gap)</div>
</div>
```

---

## 3. Subgrid

Subgrid is a powerful feature that allows a nested grid to align with its parent's grid tracks. This is invaluable for creating components like cards where you want the internal elements to align perfectly across multiple cards, even if the cards themselves span different numbers of columns.

To use it, the direct child of the main grid must become a grid container itself and inherit the parent's tracks.

**CSS Setup:**

```scss
/* In your component's CSS */
.subgrid-card {
	display: grid;
	/* This card's columns will be a subgrid of its parent */
	grid-template-columns: subgrid;

	/* The card itself must span columns in the parent grid */
	grid-column: span 2; /* Or whatever is needed */

	/* You can also target all direct children to align them */
	> * {
		grid-column: 1 / -1; /* Default to full span within the subgrid */
	}
}
```

**HTML Example:**

```html
<div class="grid gap-4" data-cols="3">
	<article class="card">
		<h3>Standard Card</h3>
		<p>This content is aligned internally.</p>
	</article>

	<!-- This card spans 2 parent columns and creates a subgrid -->
	<article class="card subgrid-card" data-span="2">
		<!-- This title can span the full 2 columns of the subgrid -->
		<h3 class="subgrid-title" style="grid-column: 1 / -1;">Subgrid Card</h3>

		<!-- This div is placed in the first track of the subgrid -->
		<div class="card">
			<h4>Sub-item A</h4>
			<p>Aligns with parent grid column 2.</p>
		</div>

		<!-- This div is placed in the second track of the subgrid -->
		<div class="card">
			<h4>Sub-item B</h4>
			<p>Aligns with parent grid column 3.</p>
		</div>
	</article>
</div>
```

---

## 4. Container Queries in Practice

Container queries make your components robust and independent of the viewport.

**Example: A Card That Changes Layout**

Let's define a card that is normally a flex column, but switches to a horizontal layout when it has enough space.

**CSS Setup:**

```scss
/* The component itself is a container */
.cq-card {
	container-type: inline-size;
	container-name: card; /* Naming is optional but good practice */
}

.cq-card__content {
	display: flex;
	flex-direction: column; /* Default: vertical stack */
	gap: 1rem;
}

/* When the container named 'card' is at least 30rem wide... */
@container card (min-width: 30rem) {
	.cq-card__content {
		flex-direction: row; /* Switch to horizontal layout */
		align-items: center;
	}
}
```

**HTML Usage:**

Now, place this card inside different grid layouts.

```html
<!-- In a narrow column, the card will be vertical -->
<div class="grid" data-cols="4">
	<div class="cq-card">...</div>
</div>

<!-- In a wide column, the card will switch to its horizontal layout -->
<div class="grid" data-cols="2">
	<div class="cq-card">...</div>
</div>
```

---

## 5. Other Layouts

### Flexbox Grid (`.flex-grid`)

Use `.flex-grid` for simpler, wrapping layouts where two-dimensional alignment isn't necessary. `data-cols` on a flex-grid works by setting the `flex-basis` of the children.

```html
<div class="flex-grid gap-4" data-cols="3">
	<div class="card">Item A</div>
	<div class="card">Item B</div>
	<div class="card">Item C</div>
	<div class="card">Item D</div>
</div>
```

_Items will try to form rows of 3, but will wrap and grow to fill any remaining space on the last row._

#### Spanning in Flexbox Grids

Similar to the CSS Grid engine, you can use `data-span="N"` on a direct child of a `.flex-grid` that has a `data-cols` attribute. This adjusts the `flex-basis` of the item to make it occupy the space of `N` columns.

This is useful for creating layouts where most items are uniform, but some need to be wider.

```html
<div class="flex-grid gap-4" data-cols="4">
	<div class="card" data-span="2">This item spans 2 columns.</div>
	<div class="card">Item B</div>
	<div class="card">Item C</div>
	<div class="card">Item D</div>
	<div class="card" data-span="3">This one spans 3.</div>
	<div class="card">Item F</div>
</div>
```

### Sidebar Layout

A common page layout pattern. It's a simple, explicit two-column grid that collapses to a single column on narrow screens thanks to its container query.

```html
<div class="sidebar-grid__container">
	<div class="sidebar-grid gap-6">
		<main>Main Content</main>
		<aside>Sidebar</aside>
	</div>
</div>
```
