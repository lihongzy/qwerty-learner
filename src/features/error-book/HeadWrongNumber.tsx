import clsx from 'clsx'
import type { FC } from 'react'
import { useCallback } from 'react'
import DownIcon from '~icons/fa/sort-down'
import UPIcon from '~icons/fa/sort-up'

type IHeadWrongNumberProps = {
  className?: string
  sortType: ISortType
  setSortType: (sortType: ISortType) => void
}

export type ISortType = 'asc' | 'desc' | 'none'

const HeadWrongNumber: FC<IHeadWrongNumberProps> = ({ className, sortType, setSortType }) => {
  const onClick = useCallback(() => {
    const sortTypes: Record<ISortType, ISortType> = {
      asc: 'desc',
      desc: 'none',
      none: 'asc',
    }

    setSortType(sortTypes[sortType])
  }, [setSortType, sortType])

  return (
    <button
      type="button"
      className={clsx(
        'my-focus-ring inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-transparent px-2 py-1 text-left text-sm font-medium text-[var(--text-main)] transition-colors duration-150 hover:border-[var(--border-main)] hover:bg-[var(--bg-ghost)]',
        className,
      )}
      onClick={onClick}
    >
      错误次数
      <span className="flex flex-col items-center justify-center text-[11px] leading-none">
        <UPIcon className={clsx('-mb-1', sortType === 'asc' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-faint)]')} />
        <DownIcon className={clsx(sortType === 'desc' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-faint)]')} />
      </span>
    </button>
  )
}

export default HeadWrongNumber
