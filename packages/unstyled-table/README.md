# @asnewyla/unstyled-table

Unstyled, accessible table primitive. Renders rows and columns from plain
data, with single-column sorting and client-side global search, without
imposing any visual styling.

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
```

### Props

| Prop | Type | Default |
|---|---|---|
| `columns` | `TableColumn<T>[]` | — |
| `data` | `T[]` | — |
| `sort` / `defaultSort` | `{ key: keyof T; direction: 'asc' \| 'desc' } \| null` | — |
| `onSortChange` | `(sort: SortState<T> \| null) => void` | — |
| `filterable` | `boolean` | `false` |

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

### Accessibility

Renders a real semantic `<table>`/`<thead>`/`<tbody>` — row/column-header/
cell roles all come from the native elements, not ARIA overrides. Sortable
headers use a real `<button>` (keyboard-reachable, Enter/Space activates
for free) with `aria-sort` on the parent `<th>` reflecting the current
state (`"ascending"`, `"descending"`, or `"none"`).

### Not yet supported

This primitive is still growing. Not implemented yet:

- **Row selection** — no built-in checkbox column or selected-state
  tracking.
- **Pagination** — no built-in page-size/page-index controls; all of
  `data` renders at once.
- **Native form participation** — nothing here submits through
  `FormData`.

## License

MIT
