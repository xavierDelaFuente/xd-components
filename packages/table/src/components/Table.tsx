import { TableColumn, UnstyledTable } from "@asnewyla/unstyled-table"
import React, { forwardRef } from "react";

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  id?: string;
}

function TableInner<T>({ data, columns, className, id, ...rest }: TableProps<T>, ref: React.ForwardedRef) {
  return (
    <UnstyledTable
      {...rest}
      id={id || 'table'}
      data={data}
      columns={columns}
      className={className ? `${className} xd-table` : 'xd-table'}
      ref={ref}
    />
  )
}

export const Table = forwardRef(TableInner)