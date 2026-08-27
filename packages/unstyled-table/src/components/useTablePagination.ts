import { useMemo, useState } from 'react';

export function useTablePagination<T>({
  data,
  paginated,
  pageSize = 10,
  page,
  defaultPage,
  onPageChange,
}: {
  data: T[];
  paginated?: boolean;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
}) {
  const isControlled = page !== undefined;
  const [internalPage, setInternalPage] = useState(defaultPage ?? 1);
  const rawPage = isControlled ? page : internalPage;

  const totalPages = paginated
    ? Math.max(1, Math.ceil(data.length / pageSize))
    : 1;
  // clamps automatically when data shrinks (e.g. filtering) out from under
  // a page that's no longer valid — no extra state/effect needed
  const currentPage = Math.min(rawPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!paginated) return data;
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [paginated, pageSize, data, currentPage]);

  const goToPage = (nextPage: number) => {
    if (!isControlled) {
      setInternalPage(nextPage);
    }
    onPageChange?.(nextPage);
  };
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
}
