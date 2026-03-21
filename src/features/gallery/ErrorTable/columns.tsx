import type { ColumnDef } from '@tanstack/react-table'
import DeleteIcon from '~icons/weui/delete-filled'
import PhArrowsDownUpFill from '~icons/ph/arrows-down-up-fill'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import type { TErrorWordData } from '../hooks/useErrorWords'

export type ErrorColumn = {
  word: string
  trans: string
  errorCount: number
  errorChar: string[]
}

export const errorColumns = (onDelete: (word: string) => Promise<void>): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: 'word',
    size: 100,
    header: ({ column }) => {
      return (
        <button
          type="button"
          className="inline-flex items-center p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          单词
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </button>
      )
    },
  },
  {
    accessorKey: 'trans',
    size: 500,
    header: '释义',
  },
  {
    accessorKey: 'errorCount',
    size: 40,
    header: ({ column }) => {
      return (
        <button
          type="button"
          className="inline-flex items-center p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          错误次数
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </button>
      )
    },
    cell: ({ row }) => {
      return <span className="flex justify-center">{row.original.errorCount}</span>
    },
  },
  {
    accessorKey: 'errorChar',
    header: '易错字母',
    size: 100,
    cell: ({ row }) => {
      return (
        <div>
          {(row.getValue('errorChar') as string[]).map((char, index) => (
            <kbd className="mr-1 inline-flex justify-center" key={`${char}-${index}`}>
              {char}
            </kbd>
          ))}
        </div>
      )
    },
  },
  {
    id: 'delete',
    header: '',
    size: 40,
    cell: ({ row }) => {
      return (
        <Tooltip content="删除记录">
          <button type="button" className="cursor-pointer" onClick={() => void onDelete(row.original.word)}>
            <DeleteIcon />
          </button>
        </Tooltip>
      )
    },
  },
]

export function getRowsFromErrorWordData(data: TErrorWordData[]): ErrorColumn[] {
  return data.map((item) => {
    return {
      word: item.word,
      trans: item.originData.trans.join('；') ?? '',
      errorCount: item.errorCount,
      errorChar: item.errorChar,
    }
  })
}
