import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
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
  'my-focus-ring inline-flex items-center rounded-[var(--radius-sm)] px-1 py-1 text-sm font-medium text-[var(--text-main)] transition-colors duration-150 hover:text-[var(--accent-primary)]'

export const errorColumns = (onDelete: (word: string) => Promise<void>): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: 'word',
    size: 120,
    header: ({ column }) => {
      return (
        <button type="button" className={sortButtonClassName} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
      return (
        <button type="button" className={sortButtonClassName} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          错误次数
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] font-semibold text-[var(--accent-warn)]">
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
              className="inline-flex min-w-6 items-center justify-center rounded-[10px] border border-[var(--border-main)] bg-[var(--bg-ghost)] px-2 py-0.5 text-xs text-[var(--text-main)]"
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
            className="my-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--bg-ghost)] text-[var(--text-muted)] transition-colors duration-150 hover:border-[color:var(--state-error)] hover:text-[var(--state-error)]"
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
      trans: item.originData.trans.join('; ') ?? '',
      errorCount: item.errorCount,
      errorChar: item.errorChar,
    }
  })
}
