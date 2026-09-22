# 📐 The Auto-Grid System: A Deep Dive

Welcome to the detailed documentation for the Auto-Grid system. This guide provides an in-depth look at how to build modern, intrinsically responsive layouts using this powerful set of CSS classes and conventions.

The system is built on two core layout engines—CSS Grid and Flexbox—and enhanced with custom properties, data attributes, and container queries to create layouts that adapt to their available space without relying on traditional media query breakpoints.

The system lives entirely in `src/styles/compositions/grid.css`. There is no build step and no Sass — everything here is authored directly in modern CSS (`@layer`, nesting, `@container`, `@supports`). A reference-only `grid.scss` file documents the original Sass version this was ported from, but it is not compiled or used anywhere in the app.

---

## 1. Core Concepts

### Layout Engines

The system offers two distinct layout "engines." You choose one by applying its class to a container element.

- **`.grid` (CSS Grid):** The primary and most powerful engine. It's best for two-dimensional layouts, creating responsive column grids, and handling complex scenarios like item spanning and "dense" packing. It uses `display: grid`.
- **`.flex-grid` (Flexbox):** A simpler engine for one-dimensional layouts. It's ideal for creating rows of items that wrap gracefully and share space equally. It uses `display: flex` with `flex-wrap: wrap`.

### Custom Properties (CSS Variables)

The grid's behavior is controlled by a set of CSS custom properties. You can set these inline via a `style` attribute or in your own CSS.

- `--gutter`: The space between grid or flex items. Defaults to `1rem`. Utility classes `.gap-0`, `.gap-2`, `.gap-4`, `.gap-6`, `.gap-8` set this for you.
- `--grid-min-item-size`: The minimum desired width for an item in a `.grid`. The grid will create as many columns of this width as can fit. Defaults to `16rem`.
- `--grid-placement`: Controls the algorithm for placing items. Can be `auto-fit` (default, collapses empty tracks) or `auto-fill` (preserves empty tracks). `.grid--fit` / `.grid--fill` set this for you.

### Container Queries

Instead of reacting to the viewport's width, our components can react to the width of their parent container. This requires a query container somewhere up the tree — an ancestor element with `container-type: inline-size` set on it.

You almost never need to add this yourself: **`.container`** (from `src/styles/compositions/container.css`, the class you already use to wrap page sections) sets `container-type: inline-size` as part of what it does. So any `.grid` nested inside a `.container` automatically gets the responsive tuning described below — no extra wrapper class needed.

Two more specific container classes exist for their own layouts:

- `.sidebar-grid__container` — collapses `.sidebar-grid` to one column under 48rem.
- `.masonry__container` — adjusts `.masonry-grid`'s column count based on its own width.

> Container queries are a general CSS pattern, not something unique to this system. If you need a component that changes its *own* internal layout based on its own width (rather than reflowing a grid of siblings), just add `container-type: inline-size` to that component's own CSS and write an `@container` rule for it — see [§4](#4-container-queries-in-practice) for a worked example. This grid system doesn't ship a bundled "container query card" utility, since that's app-specific styling, not a grid concern.

---

## 2. The `.grid` Engine in Detail

The `.grid` class is the heart of the system. Its default behavior is to create as many columns as can fit in the available space.

### The Auto-Grid Formula

The magic behind the auto-responsive grid is this line:

```css
grid-template-columns: repeat(
  var(--grid-placement, auto-fit),
  minmax(min(var(--grid-min-item-size, 16rem), 100%), 1fr)
);
```

- `repeat(auto-fit, ...)`: Creates as many columns as will fit, and collapses any empty column tracks, allowing filled tracks to expand and take up the remaining space.
- `minmax(min(16rem, 100%), 1fr)`: Each column will be at least `16rem` wide (or whatever `--grid-min-item-size` is set to) — but never wider than the container itself. If there's extra space, all columns share it equally (because of `1fr`).

The `min(..., 100%)` wrapper is what makes this overflow-safe: without it, a grid with a large `--grid-min-item-size` (e.g. `data-cols="2"` on a very narrow container) can force a track wider than its parent, causing horizontal scroll. Clamping the minimum to `100%` means the track can always shrink to fit, even on very small viewports.

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

For more explicit control, you can use the `data-cols="N"` attribute (`N` from 1–14) to specify a target number of columns. This works by dynamically calculating an appropriate `--grid-min-item-size` to achieve the desired column count.

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

#### How `data-cols` sizing actually works

There are two layers to this, and browser support determines which one wins:

1. **Enumerated fallback (works everywhere).** `grid.css` defines an explicit `--grid-min-item-size` rule for every `[data-cols="N"]` from 1 to 14, interpolating linearly from `16rem` (2 columns) down to `4rem` (14 columns) — mirroring the math the old Sass `@for` loop used to generate. This is what every browser uses today.
2. **Progressive enhancement (Chromium today).** A `@supports (top: attr(data-cols type(<number>)))` block reads the `data-cols` attribute directly as a number and computes the same formula with no upper cap, so `data-cols="20"` would just work without needing a 15th enumerated rule. Browsers that don't yet support typed `attr()` silently ignore this block and fall back to the enumerated rules above.

Either way, the markup you write is identical — just `data-cols="N"`. No inline custom property is required.

### Spanning Columns and Rows

You can make an item span multiple tracks using the `data-span` and `data-row-span` attributes (also 1–14). This is perfect for featured items or creating asymmetrical layouts.

```html
<div class="grid gap-4" data-cols="3">
  <!-- This item will take up the space of 2 columns -->
  <div class="card" data-span="2">Featured Item</div>
  <div class="card">Regular Item</div>
  <div class="card">Another Regular</div>
  <div class="card">And Another</div>
</div>
```

Because `.grid` uses real CSS Grid, `grid-column: span N` works correctly regardless of `data-cols` — a `data-span="4"` item always spans 4 tracks, even a full row, without needing any pairing rule. (This is not true for `.flex-grid` — see [§5](#spanning-in-flexbox-grids).)

### Automatic Responsive Tuning

Any `.grid` nested inside a query container (in practice, almost always your `.container`) automatically gets two adjustments as the container narrows — no extra class or setup required:

- Under **50rem**, `--grid-min-item-size` shrinks to `14rem`, allowing items to pack a bit tighter before wrapping.
- Under **30rem**, every `data-span`/`data-row-span` collapses to `1`, so spanning items stop stealing width/height on very small containers and just stack normally.

**Example: Just works inside `.container`**

```html
<div class="container" data-type="wide">
  <div class="grid gap-4" data-cols="3">
    <div class="card" data-span="2">Featured Item</div>
    <div class="card">Regular Item</div>
    <div class="card">Another Regular</div>
  </div>
</div>
```

_As the `.container` narrows past 50rem and then 30rem, the grid retunes itself automatically — the featured item's `data-span="2"` collapses to `1` once things get tight, without you writing a single media or container query._

If you ever put a `.grid` inside something that **isn't** already a query container (e.g. a bare `<div>` with no `.container`), just set `container-type: inline-size` on that wrapper yourself for these rules to take effect:

```html
<div style="container-type: inline-size">
  <div class="grid gap-4" data-cols="4">
    ...
  </div>
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

There are two subgrid-related utilities:

- **`.grid--subgrid-rows`** — a modifier for the *parent* `.grid` itself (`grid-template-rows: subgrid`), used when the parent grid is nested inside another grid and needs to inherit row tracks.
- **`.subgrid-card`** — for a *child item* inside a `.grid`, so its own internal content inherits the parent's column tracks (`grid-template-columns: subgrid`).

To use `.subgrid-card`, the item must become a grid container itself and span the columns it wants to inherit.

**CSS Setup:**

```css
.subgrid-card {
  display: grid;
  /* This card's columns will be a subgrid of its parent */
  grid-template-columns: subgrid;

  /* The card itself must span columns in the parent grid */
  grid-column: span 2; /* Or whatever is needed */
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

Container queries make your components robust and independent of the viewport. This grid system relies on `.container` (or `.sidebar-grid__container` / `.masonry__container` for those specific layouts) to establish the query container for reflowing the grid itself, but for a component that changes its *own* internal layout, you write your own small container query — it doesn't need to live in `grid.css`.

**Example: A Card That Changes Layout**

Let's define a card that is normally a flex column, but switches to a horizontal layout when it has enough space. This is scoped locally to wherever the card is used (e.g. an Astro component's own `<style>` block), not part of the shared grid utilities:

**CSS Setup:**

```css
/* The component itself is a container */
.my-card {
  container-type: inline-size;
  container-name: my-card; /* Naming is optional but good practice */
}

.my-card__content {
  display: flex;
  flex-direction: column; /* Default: vertical stack */
  gap: 1rem;
}

/* When the container named 'my-card' is at least 25rem wide... */
@container my-card (min-width: 25rem) {
  .my-card__content {
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
  <div class="my-card">...</div>
</div>

<!-- In a wide column, the card will switch to its horizontal layout -->
<div class="grid" data-cols="2">
  <div class="my-card">...</div>
</div>
```

See `src/pages/demo/grid-demo.astro` for a working, self-contained version of this pattern (`.demo-cq-card`).

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

Unlike `.grid`, flexbox has no native concept of "span N tracks" — `flex-basis` is just a size, not a track count. So `.flex-grid` needs an explicit `flex-basis` override for every valid `(data-cols, data-span)` pairing where `2 <= data-span <= data-cols`, including the case where `data-span` equals `data-cols` (a full-width row). `grid.css` enumerates all of these from `data-cols="2"` through `data-cols="14"`.

```html
<div class="flex-grid gap-4" data-cols="4">
  <div class="card" data-span="2">This item spans 2 columns.</div>
  <div class="card">Item B</div>
  <div class="card">Item C</div>
  <div class="card">Item D</div>
  <div class="card" data-span="4">This one spans the full row.</div>
  <div class="card">Item F</div>
</div>
```

> If you only pair `data-span` with a `data-cols` value that isn't set on the same element (e.g. `data-span="5"` inside a `data-cols="3"` flex-grid), there's no matching rule, and the item silently falls back to the plain `[data-cols="3"] > *` sizing instead of spanning. Only use `data-span` values from `2` up to and including the element's own `data-cols`.

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

### Masonry Grid (`.masonry-grid`)

A CSS `column-count`-based masonry layout (items flow top-to-bottom per column, not left-to-right like `.grid`). Wrap it in `.masonry__container` to have the column count respond to its own width via container queries instead of a fixed value.

```html
<div class="masonry__container">
  <div class="masonry-grid gap-4">
    <div class="card">Item A</div>
    <div class="card">Item B (taller)</div>
    <div class="card">Item C</div>
  </div>
</div>
```

---

## 6. Naming Conventions

To keep the system predictable as it grows, every class and attribute follows one of these rules. When adding something new, match it to the closest rule below rather than inventing a new pattern.

**1. Engine classes (`.grid`, `.flex-grid`) are the two things you choose between.** Everything else exists to configure or extend one of these two.

**2. BEM modifiers (`--modifier`) attach to the *same element* as the engine class, and describe a variant of that engine's behavior.**

- `.grid--dense`, `.grid--subgrid-rows`, `.grid--fit`, `.grid--fill` all go on the element that also has `.grid`.
- If you're tempted to add a new modifier, ask: does this change how the engine element itself behaves? If yes, it's a `--modifier` on that same element. If it describes a *different* element (a child, a wrapper), it's not a modifier — see rule 3.

**3. Standalone classes name a distinct role for a *different* element, not a variant of the engine.**

- `.subgrid-card` goes on a *child item* inside `.grid` — it isn't a modifier of the grid, it declares that this particular item behaves differently (it's a subgrid). That's why it isn't `.grid--subgrid-card`.
- `.card` (used throughout the demos) similarly names a role, not a modifier of anything.

**4. `data-*` attributes configure a value along a spectrum, not a boolean state.** `data-cols`, `data-span`, `data-row-span` all take a number and scale linearly. If a future attribute is a true on/off toggle instead of a value, prefer a class (rule 2) over a data attribute — that's why "dense packing" is `.grid--dense`, not `data-dense="true"`.

**5. Container-query wrapper classes end in `__container` and name what they wrap.** `.sidebar-grid__container` wraps `.sidebar-grid`; `.masonry__container` wraps `.masonry-grid`. In most cases you won't need one of these at all — see [Container Queries](#container-queries) above, since `.container` already covers the common case.

### A known, accepted limitation (not a naming issue)

`.flex-grid`'s `data-span` only works for values from `2` up to the element's own `data-cols` (see [§5](#spanning-in-flexbox-grids)). This isn't a naming inconsistency — `data-span` means the same thing in both `.grid` and `.flex-grid` ("span N tracks"). It's a structural limit of flexbox itself: there's no native "span" concept, so `.flex-grid` has to precompute a `flex-basis` for every valid `(data-cols, data-span)` pair, and only valid pairs are covered. Using `data-span` outside that range doesn't error — it silently falls back to the default per-item width — so treat this as a rule to follow (keep `data-span <= data-cols`), not a bug to fix.

---

## 7. Changelog

- Restored `data-cols` / `data-span` / `data-row-span` support up to **14** (previously capped at 6 for `data-cols`/`--grid-min-item-size` and inconsistently at 6–12 elsewhere) when the SCSS system was ported to plain CSS.
- Restored the full `.flex-grid` child-sizing presets and `data-span` overrides, which were dropped entirely in the initial CSS port.
- Fixed a Sass-era off-by-one: the `data-span == data-cols` case (a fully-spanning flex item) was missing because the original loop used `to` (exclusive) instead of `through` (inclusive). Both `grid.scss` (reference) and `grid.css` now include this case for every column count.
- Added `minmax(min(var(--grid-min-item-size, 16rem), 100%), 1fr)` to prevent grid tracks from overflowing their container on narrow viewports.
- Added a `@supports (top: attr(data-cols type(<number>)))` progressive-enhancement layer that computes `--grid-min-item-size` directly from `data-cols` with no upper cap, for browsers that support typed `attr()`. Falls back to the enumerated presets everywhere else.
- Removed the `.cq-card` / `.cq-card__content` utility. It was a generic container-query example unrelated to subgrid or the grid engines, and is better expressed as component-local CSS (see [§4](#4-container-queries-in-practice)) than a shared grid utility. Existing usages were migrated to local, page-scoped equivalents.
- Moved `.flex-grid--playground` out of `grid.css`/`grid.scss` into `src/styles/pages/flex-grid-demo.css`. It only ever backed the interactive slider demo in `flex-grid-demo.astro` (not a reusable layout utility), so it didn't belong in the shared grid system. Also fixed a dangling `<link>` to a `grid-demo.css` file that never existed.
- Removed the `data-layout` attribute hook. It set `--grid-placement: auto-fit` (already the default) and was never referenced in any markup — dead API surface left over from an earlier iteration.
- Removed the `.grid-container` wrapper class. It only ever set `container-type: inline-size` and bundled two `@container` rules that retune `.grid` (`--grid-min-item-size` at 50rem, span collapse at 30rem) — but `.container` already sets `container-type: inline-size`, making `.grid-container` a redundant second "container" concept with a confusingly similar name. The two `@container` rules now live directly on `.grid` itself and apply automatically to any `.grid` nested inside an existing query container (almost always `.container`). Demo pages that used `.grid-container` without an existing `.container` wrapper were updated to set `container-type: inline-size` directly.
