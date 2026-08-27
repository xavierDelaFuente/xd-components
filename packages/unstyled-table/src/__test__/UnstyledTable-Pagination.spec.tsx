import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledTable } from '../components';
import {
  getBodyRows,
  getFirstPageButton,
  getLastPageButton,
  getNextPageButton,
  getPreviousPageButton,
  getSearchInput,
} from '../test-utils';
import { columns, type Person } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledTable pagination', () => {
  const paginationPeople: Person[] = [
    { id: '1', name: 'Person A', age: 20 },
    { id: '2', name: 'Person B', age: 21 },
    { id: '3', name: 'Person C', age: 22 },
    { id: '4', name: 'Person D', age: 23 },
    { id: '5', name: 'Person E', age: 24 },
  ];

  it('renders every row when not paginated, regardless of data length', () => {
    render(<UnstyledTable data={paginationPeople} columns={columns} />);

    expect(getBodyRows()).toHaveLength(paginationPeople.length);
  });

  it('shows only the first pageSize rows on page 1 when paginated', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    const rows = getBodyRows();
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole('cell', { name: 'Person B' }),
    ).toBeInTheDocument();
  });

  it('shows a page indicator with the current page and total page count', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables the previous-page button on the first page', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(getPreviousPageButton()).toBeDisabled();
  });

  it('advances to the next page, uncontrolled, when next is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getNextPageButton());

    const rows = getBodyRows();
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Person C' }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole('cell', { name: 'Person D' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });

  it('goes back to the previous page when previous is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getNextPageButton());
    await user.click(getPreviousPageButton());

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
  });

  it('disables the next-page button on the last page', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );
    const next = getNextPageButton();

    await user.click(next);
    await user.click(next);

    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(1);
    expect(next).toBeDisabled();
  });

  it('supports controlled pagination via page + onPageChange, without updating internally', async () => {
    const handlePageChange = vi.fn();
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        page={1}
        onPageChange={handlePageChange}
      />,
    );

    await user.click(getNextPageButton());

    expect(handlePageChange).toHaveBeenCalledWith(2);
    // still page 1 — nothing fed the new page back in via props
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('reflects an externally-controlled page', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        page={2}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person C' }),
    ).toBeInTheDocument();
  });

  it('clamps back to the last valid page when filtering shrinks the row count below the current page, uncontrolled', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        filterable
      />,
    );

    await user.click(getNextPageButton());
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    // only "Person A" matches — down to 1 row, 1 page total
    await user.type(getSearchInput(), 'Person A');

    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
  });

  it('disables the first-page button on the first page', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(getFirstPageButton()).toBeDisabled();
  });

  it('disables the last-page button on the last page', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getLastPageButton());

    expect(getLastPageButton()).toBeDisabled();
  });

  it('jumps directly to the last page when last is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getLastPageButton());

    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(1);
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person E' }),
    ).toBeInTheDocument();
  });

  it('jumps directly back to the first page when first is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getLastPageButton());
    await user.click(getFirstPageButton());

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
  });

  it('supports controlled pagination when jumping to the last page, without updating internally', async () => {
    const handlePageChange = vi.fn();
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        page={1}
        onPageChange={handlePageChange}
      />,
    );

    await user.click(getLastPageButton());

    expect(handlePageChange).toHaveBeenCalledWith(3);
    // still page 1 — nothing fed the new page back in via props
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('marks each pagination button with a stable data-pagination-action hook for styling', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(getFirstPageButton()).toHaveAttribute(
      'data-pagination-action',
      'first',
    );
    expect(getPreviousPageButton()).toHaveAttribute(
      'data-pagination-action',
      'previous',
    );
    expect(getNextPageButton()).toHaveAttribute(
      'data-pagination-action',
      'next',
    );
    expect(getLastPageButton()).toHaveAttribute(
      'data-pagination-action',
      'last',
    );
  });
});
