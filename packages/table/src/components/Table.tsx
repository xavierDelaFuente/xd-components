import {
  UnstyledTable,
  type UnstyledTableProps,
} from '@asnewyla/unstyled-table';
import { type ForwardedRef, forwardRef } from 'react';
import './Table.css';

export type TableProps<T> = UnstyledTableProps<T>;

function TableInner<T>(
  { className, ...rest }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  return (
    <UnstyledTable
      {...rest}
      className={className ? `xd-table ${className}` : 'xd-table'}
      ref={ref}
    />
  );
}

export const Table = forwardRef(TableInner) as <T>(
  props: TableProps<T> & { ref?: ForwardedRef<HTMLTableElement> },
) => React.ReactElement;
