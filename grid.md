### Grid System Kitchen Sink

A practical, no-nonsense cookbbok for your SCSS grid utlities. This uide shows **what each class does, when to use it** and ready-to-paste HTML for real layouts. It assumes you have included the SCSS you shared. .grid, .flex-grid, .masonary-grid, gap-\*, etc.

## Qucik start - Core API

Base Grid

```
<div class="grid">
    <div>Item</div>
    <div>Item</div>
    <div>Item</div>
</div>
```

- Uses `repeat<var(--grid-placement, auto-fit), minmax(var(--grid-min-item-size, 16rem), 1fr))` under the hood.
  `code`
