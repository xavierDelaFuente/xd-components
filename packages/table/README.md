# @asnewyla/table

Styled table built on `@asnewyla/unstyled-table`. A thin wrapper — it adds
CSS and nothing else: same props, same behavior, same DOM, just styled.

## Install

```bash
npm install @asnewyla/table
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/table/styles.css';
```

## Usage

```tsx
import { Table } from '@asnewyla/table';

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', age: 36 },
  { id: '2', name: 'Alan Turing', age: 41 },
];

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age' },
];

<Table data={people} columns={columns} getRowKey={(row) => row.id} />

// Filtering, selection, pagination — all straight from the primitive
<Table
  data={people}
  columns={columns}
  getRowKey={(row) => row.id}
  filterable
  selectable
  paginated
  pageSize={10}
/>
```

### Props

Every prop is `@asnewyla/unstyled-table`'s own `UnstyledTableProps<T>` —
see its README for the full sorting/filtering/selection/pagination API.
This package adds no props of its own; `className` merges with the base
`xd-table` class (base class first) the same way every styled component
in this library does.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-border: #cbd5e1;
  --xd-color-surface: #ffffff;
}
```

Pagination footer alignment defaults to right (`flex-end`) and isn't a
component prop — override `--xd-table-pagination-justify` from any
ancestor, either globally or per table:

```css
/* every <Table> on the page */
:root {
  --xd-table-pagination-justify: center;
}
```

```tsx
// just this one — wrap it in something that sets the variable
<div style={{ '--xd-table-pagination-justify': 'space-between' } as CSSProperties}>
  <Table data={data} columns={columns} paginated />
</div>
```

Accepts any `justify-content` value: `flex-start`, `center`, `flex-end`,
`space-between`, `space-around`, `space-evenly`.

### Not yet supported

Inherits `@asnewyla/unstyled-table`'s own limitations — see its README:
no native `FormData` form participation.

The search input and pagination controls render as siblings of the
`<table>` element, not inside a shared wrapper — `className` only reaches
the `<table>` itself. This package's CSS still styles all of it (the
pagination controls via an adjacent-sibling selector, the search input via
its own `aria-label`), but the search input's styling isn't scoped to any
one `<Table>` instance — it will also match any other element on the page
an app happens to give the same `aria-label="Search table"`.

Pagination buttons render as icons (CSS-drawn chevrons, no icon asset),
keyed off a `data-pagination-action` attribute the primitive sets on each
button. Requires `@asnewyla/unstyled-table` to have shipped first/last
page navigation and that attribute — on an older primitive version the
buttons still work, just as blank icon-shaped buttons.

## License

MIT
