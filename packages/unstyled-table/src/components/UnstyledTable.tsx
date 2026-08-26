import { type ForwardedRef, forwardRef, type ReactNode } from 'react';

export type TableColumn<T> = {
    key: keyof T;
    header: string;
    render?: (row: T) => ReactNode;
}

export type UnstyledTableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
}

function TableHeader<T>({ column }: { column: TableColumn<T> }) {
    return (
        <th>
            {column.header}
        </th>
    )
}

function Header<T>({ columns }: { columns: TableColumn<T>[] }) {
    return (
        <tr>
            {
                columns.map((column) => {
                    return <TableHeader key={String(column.key)} column={column} />
                })
            }
        </tr>
    )
}

function Body<T>({ columns, data }: { columns: TableColumn<T>[]; data: T[] }) {
    return (
        <>
            {data.map((row, index) => (
                <tr key={index}>
                    {columns.map((column) => (
                        <td key={String(column.key)}>
                            {column.render ? column.render(row) : String(row[column.key])}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}

function UnstyledTableInner<T>(
    { columns, data }: UnstyledTableProps<T>,
    ref: ForwardedRef<HTMLTableElement>,
) {
    return (
        <table ref={ref}>
            <thead>
                <Header columns={columns} />
            </thead>
            <tbody>
                <Body columns={columns} data={data} />
            </tbody>
        </table>
    )
}

export const UnstyledTable = forwardRef(UnstyledTableInner) as <T, >(
    props: UnstyledTableProps<T> & { ref?: ForwardedRef<HTMLTableElement> },
) => React.ReactElement;
