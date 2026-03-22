import { currentRowDetailAtom } from '../store'
import type { groupedWordRecords } from '../type'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import NextIcon from '~icons/ooui/next-ltr'
import PrevIcon from '~icons/ooui/next-rtl'

type IRowPaginationProps = {
  className?: string
  allRecords: groupedWordRecords[]
}

const navButtonClassName =
  'my-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)] text-[var(--text-main)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'

const RowPagination: FC<IRowPaginationProps> = ({ className, allRecords }) => {
  const [currentRowDetail, setCurrentRowDetail] = useAtom(currentRowDetailAtom)
  const currentIndex = useMemo(() => {
    if (!currentRowDetail) return -1
    return allRecords.findIndex((record) => record.word === currentRowDetail.word && record.dict === currentRowDetail.dict)
  }, [currentRowDetail, allRecords])

  const nextRowDetail = useCallback(() => {
    if (!currentRowDetail) return

    const index = currentIndex
    if (index === -1) return
    const nextIndex = index + 1
    if (nextIndex >= allRecords.length) return
    setCurrentRowDetail(allRecords[nextIndex])
  }, [currentRowDetail, currentIndex, allRecords, setCurrentRowDetail])

  const prevRowDetail = useCallback(() => {
    if (!currentRowDetail) return

    const index = currentIndex
    if (index === -1) return
    const prevIndex = index - 1
    if (prevIndex < 0) return
    setCurrentRowDetail(allRecords[prevIndex])
  }, [currentRowDetail, currentIndex, setCurrentRowDetail, allRecords])

  useHotkeys(
    'left',
    (e) => {
      prevRowDetail()
      e.stopPropagation()
    },
    {
      preventDefault: true,
    },
  )

  useHotkeys(
    'right',
    (e) => {
      nextRowDetail()
      e.stopPropagation()
    },
    {
      preventDefault: true,
    },
  )

  return (
    <div className={`flex select-none items-center gap-2 ${className ?? ''}`}>
      <button className={navButtonClassName} onClick={prevRowDetail} disabled={currentIndex <= 0}>
        <PrevIcon />
      </button>
      <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-sm text-[var(--text-main)]">{`${currentIndex + 1} / ${allRecords.length}`}</span>
      <button className={navButtonClassName} onClick={nextRowDetail} disabled={currentIndex >= allRecords.length - 1}>
        <NextIcon />
      </button>
    </div>
  )
}

export default RowPagination
