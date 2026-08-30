import { Button } from '@asnewyla/button';
import {
  type RowId,
  type TableColumn,
  UnstyledTable,
} from '@asnewyla/unstyled-table';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

interface Person {
  id: string;
  name: string;
  role: string;
  age: number;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Mathematician', age: 36 },
  { id: '2', name: 'Alan Turing', role: 'Computer Scientist', age: 41 },
  { id: '3', name: 'Grace Hopper', role: 'Rear Admiral', age: 85 },
  { id: '4', name: 'Katherine Johnson', role: 'Physicist', age: 101 },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
];

// Genuinely unstyled — no CSS at all, and `UnstyledTable` exposes no
// per-cell styling hook (no className/style on individual <th>/<td>). This
// <style> block, scoped to a wrapper class, exists only so rows/columns are
// visible in Storybook — it is not part of the package. A real consumer
// styles it exactly this way: plain CSS descendant selectors from the
// outside, same as `@asnewyla/table` (the styled sibling) does internally.
function DemoStyles() {
  return (
    <style>{`
      .unstyled-table-demo table { border-collapse: collapse; min-width: 480px; }
      .unstyled-table-demo th, .unstyled-table-demo td { border: 1px solid #94a3b8; padding: 6px 10px; text-align: left; }
      .unstyled-table-demo th[aria-sort] button { all: unset; cursor: pointer; font-weight: inherit; }
      .unstyled-table-demo input[aria-label="Search table"] { margin-bottom: 8px; padding: 6px 10px; border: 1px solid #94a3b8; }
      .unstyled-table-demo button[data-pagination-action] { padding: 4px 10px; margin: 8px 4px 8px 0; border: 1px solid #94a3b8; cursor: pointer; }
      .unstyled-table-demo button[data-pagination-action]:disabled { cursor: not-allowed; opacity: 0.5; }
    `}</style>
  );
}

const meta: Meta<typeof UnstyledTable<Person>> = {
  title: 'Primitives/UnstyledTable',
  component: UnstyledTable,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="unstyled-table-demo">
        <DemoStyles />
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns.map((column) => ({ ...column, sortable: false }))}
      getRowKey={(row) => row.id}
    />
  ),
};

export const Sortable: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
    />
  ),
};

export const Filterable: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      filterable
    />
  ),
};

export const Selectable: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      selectable
      defaultSelected={['2']}
    />
  ),
};

export const Paginated: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      paginated
      pageSize={2}
    />
  ),
};

// Sorting, filtering, selection, and pagination together — the full
// feature set this primitive supports.
export const FullFeatured: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      filterable
      selectable
      paginated
      pageSize={2}
    />
  ),
};

export const CustomCellRendering: StoryObj = {
  render: () => (
    <UnstyledTable
      data={people}
      columns={[
        { key: 'name', header: 'Name', sortable: true },
        { key: 'role', header: 'Role', sortable: true },
        {
          key: 'age',
          header: 'Age',
          sortable: true,
          render: (row) => `${row.age} yrs`,
        },
      ]}
      getRowKey={(row) => row.id}
    />
  ),
};

// `UnstyledTable` never mutates `data` — it only ever renders whatever
// array it's given, regardless of what's selected. "Delete selected" is
// entirely the consumer's responsibility: this demo component owns both
// `data` and `selected` in its own state and computes the next `data`
// array itself on delete. `selected`/`onSelectionChange` already put that
// state one level up, in whatever component renders <UnstyledTable> — a
// sibling toolbar (the count + button below) reads it directly as a normal
// prop, no context needed, since nothing outside this component's own
// subtree needs it.
function BulkDeleteDemo() {
  const [data, setData] = useState(people);
  const [selected, setSelected] = useState<RowId[]>([]);

  const handleDelete = () => {
    setData((current) => current.filter((row) => !selected.includes(row.id)));
    setSelected([]);
  };

  return (
    <div>
      <p>
        {selected.length} selected{' '}
        <Button
          size="sm"
          variant="destructive"
          disabled={selected.length === 0}
          onClick={handleDelete}
        >
          Delete selected
        </Button>
      </p>
      <UnstyledTable
        data={data}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
      />
    </div>
  );
}

export const BulkDeleteSelectedRows: StoryObj = {
  render: () => <BulkDeleteDemo />,
};
