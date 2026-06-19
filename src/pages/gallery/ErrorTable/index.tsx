import { errorColumns } from './columns';
import type { ErrorColumn } from './columns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface DataTableProps {
  data: ErrorColumn[];
  isLoading: boolean;
  error: unknown;
  onDelete: (word: string) => Promise<void>;
}

function getAriaSort(sortingState: false | 'asc' | 'desc') {
  if (sortingState === 'asc') return 'ascending';
  if (sortingState === 'desc') return 'descending';
  return 'none';
}

export function ErrorTable({ data, isLoading, error, onDelete }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => errorColumns(onDelete), [onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    autoResetPageIndex: true,
  });

  return (
    <TooltipProvider>
      <div className="h-full w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={header.column.getCanSort() ? getAriaSort(header.column.getIsSorted()) : undefined}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className="align-top" style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="text-muted-foreground py-10 text-center">
                  {isLoading ? (
                    <span className="text-muted-foreground">加载中...</span>
                  ) : error ? (
                    '加载失败，请稍后再试。'
                  ) : (
                    '暂时还没有错词记录，先练一轮再来看看。'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
