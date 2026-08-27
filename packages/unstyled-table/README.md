# @asnewyla/unstyled-table

Unstyled, accessible table primitive. Renders rows and columns from plain
data, with single-column sorting, client-side global search, row
selection, and pagination, without imposing any visual styling.

## Install

```bash
npm install @asnewyla/unstyled-table
```

## Usage

```tsx
import { UnstyledTable } from '@asnewyla/unstyled-table';

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: 'Ada Lovelace', age: 36 },
  { name: 'Alan Turing', age: 41 },
];

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age' },
];

// Plain rendering
<UnstyledTable data={people} columns={columns} />

// With a search box (client-side, filters across every column's value)
<UnstyledTable data={people} columns={columns} filterable />

// Controlled sort
<UnstyledTable
  data={people}
  columns={columns}
  sort={sort}
  onSortChange={setSort}
/>

// A custom cell renderer per column
const columnsWithRender = [
  { key: 'name', header: 'Name' },
  { key: 'age', header: 'Age', render: (row) => `${row.age} yrs` },
];

// Row selection (controlled) — see "Row identity" below for getRowKey
<UnstyledTable
  data={people}
  columns={columns}
  getRowKey={(row) => row.id}
  selectable
  selected={selected}
  onSelectionChange={setSelected}
/>

// Pagination — fixed page size, no built-in page-size selector
<UnstyledTable
  data={people}
  columns={columns}
  paginated
  pageSize={10}
/>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `columns` | `TableColumn<T>[]` | — |
| `data` | `T[]` | — |
| `sort` / `defaultSort` | `{ key: keyof T; direction: 'asc' \| 'desc' } \| null` | — |
| `onSortChange` | `(sort: SortState<T> \| null) => void` | — |
| `filterable` | `boolean` | `false` |
| `getRowKey` | `(row: T) => RowId` (`RowId = string \| number`) | — |
| `selectable` | `boolean` | `false` |
| `selected` / `defaultSelected` | `RowId[]` | — |
| `onSelectionChange` | `(selected: RowId[]) => void` | — |
| `paginated` | `boolean` | `false` |
| `pageSize` | `number` | `10` |
| `page` / `defaultPage` | `number` | — |
| `onPageChange` | `(page: number) => void` | — |

Also accepts every native `<table>` attribute (`className`, `style`, `id`,
etc.) via passthrough — `UnstyledTable` composes
`ComponentPropsWithoutRef<'table'>` like every other primitive in this
library.

`TableColumn<T>`:

| Field | Type | Default |
|---|---|---|
| `key` | `keyof T` | — |
| `header` | `string` | — |
| `render` | `(row: T) => ReactNode` | — |
| `sortable` | `boolean` | `false` |

Uncontrolled by default — pass `sort` + `onSortChange` to control the sort
state yourself. `render` overrides how a cell displays a column's value;
without it, a cell just shows `String(row[column.key])`.

### Sorting

Only one column can be sorted at a time. Clicking a `sortable` column's
header cycles ascending → descending → unsorted; clicking a different
sortable column resets to ascending on that column instead. Non-sortable
columns render as plain `<th>` text — no button, no `aria-sort`.

### Filtering

`filterable` renders a single `<input aria-label="Search table">` above
the table. Typing filters `data` client-side by a case-insensitive
substring match against every column's raw value (`row[column.key]`, not
its rendered output) — there's no async/remote search, matching the same
client-side-only scope as `@asnewyla/unstyled-select`'s search. Filtering
is always applied before sorting.

### Row identity and selection

`getRowKey` gives each row a stable identity — used both for React's own
`key` (so a row's DOM state, like an uncontrolled input inside a custom
`render`, stays attached to that row across a sort/filter reorder) and for
tracking `selected`. Without it, identity falls back to
`JSON.stringify(row)`, which works as long as rows are unique by content.

`selectable` adds a checkbox column: a per-row checkbox plus a "select
all" checkbox in the header (`aria-label="Select all rows"`, native
`indeterminate` when some but not all *currently rendered* rows are
selected). `UnstyledTable` never mutates `data` — deleting/exporting/
acting on a selection is entirely the consumer's job, using `selected` +
whatever action they wire up next to the table (see the
`BulkDeleteSelectedRows` Storybook story).

### Pagination

`paginated` slices the final (filtered, then sorted) row set into pages of
`pageSize` rows and renders a footer below the table: a
`<button aria-label="Previous page">`, a plain-text `"Page X of Y"`
indicator, and a `<button aria-label="Next page">` — both buttons use
native `disabled` on the first/last page rather than just visual styling.
There's no built-in page-size selector; `pageSize` is a fixed prop. The
current page clamps automatically if the underlying row count shrinks out
from under it (e.g. filtering down to fewer rows/pages than the page you
were on) — this happens on every render as a plain derived value, not via
an effect, so it can't ever momentarily show a page that no longer exists.

### Accessibility

Renders a real semantic `<table>`/`<thead>`/`<tbody>` — row/column-header/
cell roles all come from the native elements, not ARIA overrides. Sortable
headers use a real `<button>` (keyboard-reachable, Enter/Space activates
for free) with `aria-sort` on the parent `<th>` reflecting the current
state (`"ascending"`, `"descending"`, or `"none"`).

### Not yet supported

This primitive is still growing. Not implemented yet:

- **Native form participation** — nothing here submits through
  `FormData`.

## License

MIT
