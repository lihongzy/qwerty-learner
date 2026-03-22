import { LoadingWordUI } from './LoadingWordUI'
import useGetWord from './hooks/useGetWord'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { idDictionaryMap } from '@/shared/resources/dictionary'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback } from 'react'
import DeleteIcon from '~icons/weui/delete-filled'

type IErrorRowProps = {
  record: groupedWordRecords
  onDelete: () => void
}

const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)
  const dictInfo = idDictionaryMap[record.dict]
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo)

  const onClick = useCallback(() => {
    setCurrentRowDetail(record)
  }, [record, setCurrentRowDetail])

  return (
    <li
      className="my-focus-ring grid w-full cursor-pointer grid-cols-[1.3fr_2.8fr_0.9fr_1.1fr_auto] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] px-4 py-3 text-[var(--text-main)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-[color:var(--accent-primary)] hover:bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))]"
      onClick={onClick}
    >
      <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.95rem] font-medium text-[var(--text-strong)]">{record.word}</span>
      <span className="min-w-0 text-sm leading-5 text-[var(--text-muted)]">
        {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
      </span>
      <span className="justify-self-start font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.95rem] font-semibold text-[var(--accent-warn)]">
        {record.wrongCount}
      </span>
      <span className="truncate text-sm text-[var(--text-muted)]">{dictInfo?.name}</span>
      <span
        className="justify-self-end"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Tooltip content="删除记录">
          <button
            type="button"
            className="my-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--bg-ghost)] text-[var(--text-muted)] transition-colors duration-150 hover:border-[color:var(--state-error)] hover:text-[var(--state-error)]"
          >
            <DeleteIcon />
          </button>
        </Tooltip>
      </span>
    </li>
  )
}

export default ErrorRow