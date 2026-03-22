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

  return (
    <div className="my-control-shell h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[var(--border-main)]">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-3 py-3 text-left text-sm font-medium text-[var(--text-main)]"
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
                  className="border-b border-[var(--border-soft)] text-sm text-[var(--text-muted)] last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="px-3 py-3 align-top"
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
                <td colSpan={table.getAllColumns().length} className="h-[22rem] text-center align-middle text-[var(--text-muted)]">
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
