import { Button } from '@asnewyla/button';
import { Table } from '@asnewyla/table';
import type { RowId, TableColumn } from '@asnewyla/unstyled-table';
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

// Same TS2742 constraint as UnstyledTable's own story: an explicit
// annotation instead of `satisfies`, since Table<Person>'s inferred type
// can't be named without referencing an unexported library type.
const meta: Meta<typeof Table<Person>> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Table
      data={people}
      columns={columns.map((column) => ({ ...column, sortable: false }))}
      getRowKey={(row) => row.id}
    />
  ),
};

export const Sortable: StoryObj = {
  render: () => (
    <Table data={people} columns={columns} getRowKey={(row) => row.id} />
  ),
};

export const Filterable: StoryObj = {
  render: () => (
    <Table
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      filterable
    />
  ),
};

export const Selectable: StoryObj = {
  render: () => (
    <Table
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
    <Table
      data={people}
      columns={columns}
      getRowKey={(row) => row.id}
      paginated
      pageSize={2}
    />
  ),
};

// Sorting, filtering, selection, and pagination together — the full
// feature set, styled, all at once.
export const FullFeatured: StoryObj = {
  render: () => (
    <Table
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

// Same bulk-delete pattern as UnstyledTable's own story: `Table` never
// mutates `data`, so "delete selected" is entirely the consumer's own
// state, one level up.
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
      <Table
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
