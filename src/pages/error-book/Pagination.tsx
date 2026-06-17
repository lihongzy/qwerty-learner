import type { FC } from 'react'
import { useCallback } from 'react'
import NextIcon from '~icons/ooui/next-ltr'
import PrevIcon from '~icons/ooui/next-rtl'

type IPaginationProps = {
  className?: string
  page: number
  setPage: (page: number) => void
  totalPages: number
}

export const ITEM_PER_PAGE = 20

const buttonClassName =
  'my-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] text-[var(--text-main)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-40'

const Pagination: FC<IPaginationProps> = ({ className, page, setPage, totalPages }) => {
  const nextPage = useCallback(() => {
    setPage(page + 1)
  }, [page, setPage])

  const prevPage = useCallback(() => {
    setPage(page - 1)
  }, [page, setPage])

  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ''}`}>
      <button className={buttonClassName} onClick={prevPage} disabled={page <= 1}>
        <PrevIcon />
      </button>
      <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-sm text-[var(--text-main)]">{`${page} / ${totalPages}`}</span>
      <button className={buttonClassName} onClick={nextPage} disabled={page >= totalPages}>
        <NextIcon />
      </button>
    </div>
  )
}

export default Pagination
