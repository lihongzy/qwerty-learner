import { errorColumns } from './columns'
import type { ErrorColumn } from './columns'
import LoadingUI from '@/shared/components/Loading'
import type { SortingState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

interface DataTableProps {
  data: ErrorColumn[]
  isLoading: boolean
  error: unknown
  onDelete: (word: string) => Promise<void>
}

export function ErrorTable({ data, isLoading, error, onDelete }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo(() => errorColumns(onDelete), [onDelete])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    autoResetPageIndex: true,
  })

  const getAriaSort = (sortingState: false | 'asc' | 'desc') => {
    if (sortingState === 'asc') {
      return 'ascending'
    }

    if (sortingState === 'desc') {
      return 'descending'
    }

    return 'none'
  }

  return (
    <div className="my-control-shell h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-bg-panel sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-border-main border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="text-text-main px-3 py-2.5 text-left text-sm font-medium"
                      aria-sort={header.column.getCanSort() ? getAriaSort(header.column.getIsSorted()) : undefined}
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="w-full">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-border-soft text-text-muted border-b text-sm last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="px-3 py-2.5 align-top"
                        {...{
                          style: {
                            width: cell.column.getSize(),
                          },
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="text-text-muted min-h-full py-10 text-center align-middle">
                  {isLoading ? <LoadingUI /> : error ? '加载失败，请稍后再试。' : '暂时还没有错词记录，先练一轮再来看看。'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
