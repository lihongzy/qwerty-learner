import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import type { ColumnDef, SortDirection } from '@tanstack/react-table'
import DeleteIcon from '~icons/weui/delete-filled'
import PhArrowsDownUpFill from '~icons/ph/arrows-down-up-fill'
import type { TErrorWordData } from '../hooks/useErrorWords'

export type ErrorColumn = {
  word: string
  trans: string
  errorCount: number
  errorChar: string[]
}

const sortButtonClassName =
  'my-focus-ring text-text-main hover:text-accent-primary inline-flex items-center rounded-md px-1 py-1 text-sm font-medium transition-colors duration-150'

function getSortLabel(label: string, sorting: false | SortDirection) {
  if (!sorting) {
    return `${label}，当前未排序`
  }

  return sorting === 'desc' ? `${label}，当前降序` : `${label}，当前升序`
}

export const errorColumns = (onDelete: (word: string) => Promise<void>): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: 'word',
    size: 120,
    header: ({ column }) => {
      const sorting = column.getIsSorted()

      return (
        <button
          type="button"
          className={sortButtonClassName}
          aria-label={getSortLabel('单词', sorting)}
          onClick={() => column.toggleSorting(sorting === 'asc')}
        >
          单词
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </button>
      )
    },
  },
  {
    accessorKey: 'trans',
    size: 420,
    header: '释义',
  },
  {
    accessorKey: 'errorCount',
    size: 90,
    header: ({ column }) => {
      const sorting = column.getIsSorted()

      return (
        <button
          type="button"
          className={sortButtonClassName}
          aria-label={getSortLabel('错误次数', sorting)}
          onClick={() => column.toggleSorting(sorting === 'asc')}
        >
          错误次数
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-accent-warn font-['IBM_Plex_Mono','JetBrains_Mono',monospace] font-semibold">
          {row.original.errorCount}
        </span>
      )
    },
  },
  {
    accessorKey: 'errorChar',
    header: '易错键',
    size: 140,
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1.5">
          {(row.getValue('errorChar') as string[]).map((char, index) => (
            <kbd
              className="border-border-main bg-bg-ghost text-text-main inline-flex min-w-6 items-center justify-center rounded-md border px-2 py-0.5 text-xs"
              key={`${char}-${index}`}
            >
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
    size: 48,
    cell: ({ row }) => {
      return (
        <Tooltip content="删除记录">
          <button
            type="button"
            aria-label={`删除 ${row.original.word} 的错词记录`}
            className="my-focus-ring border-border-soft bg-bg-ghost text-text-muted hover:border-state-error hover:text-state-error inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-150"
            onClick={() => void onDelete(row.original.word)}
          >
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
      trans: item.originData.trans.join('; '),
      errorCount: item.errorCount,
      errorChar: item.errorChar,
    }
  })
}
