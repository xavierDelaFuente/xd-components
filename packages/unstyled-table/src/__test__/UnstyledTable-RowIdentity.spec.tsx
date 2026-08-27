import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import { getSortButton } from '../test-utils';
import type { Person } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledTable row identity', () => {
  // deliberately not sorted, so triggering a sort actually reorders rows
  const unsortedPeople: Person[] = [
    { id: '2', name: 'Bob', age: 41 },
    { id: '1', name: 'Ada', age: 36 },
  ];

  const columnsWithInput: TableColumn<Person>[] = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'age',
      header: 'Note',
      render: (row) => <input aria-label={`Note for ${row.name}`} />,
    },
  ];

  it('keeps each row’s own DOM state attached to that row when a sort reorders the rows', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={columnsWithInput} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Note for Bob' }),
      'bob-note',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Note for Ada' }),
      'ada-note',
    );

    // sorting ascending by name reorders the rows: Ada first, then Bob
    await user.click(getSortButton('Name'));

    expect(screen.getByRole('textbox', { name: 'Note for Ada' })).toHaveValue(
      'ada-note',
    );
    expect(screen.getByRole('textbox', { name: 'Note for Bob' })).toHaveValue(
      'bob-note',
    );
  });
});
