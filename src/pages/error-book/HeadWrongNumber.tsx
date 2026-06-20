import { useCallback } from 'react';
import DownIcon from '~icons/fa/sort-down';
import UpIcon from '~icons/fa/sort-up';

export type ISortType = 'asc' | 'desc' | 'none';

type Props = {
  className?: string;
  sortType: ISortType;
  setSortType: (sortType: ISortType) => void;
};

const sortCycle: Record<ISortType, ISortType> = { asc: 'desc', desc: 'none', none: 'asc' };

export default function HeadWrongNumber({ className, sortType, setSortType }: Props) {
  const onClick = useCallback(() => setSortType(sortCycle[sortType]), [setSortType, sortType]);

  return (
    <button
      type="button"
      className={`text-muted-foreground hover:border-border hover:bg-muted inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm font-medium transition-colors ${className ?? ''}`}
      onClick={onClick}
    >
      错误次数
      <span className="flex flex-col items-center justify-center text-[11px] leading-none">
        <UpIcon className={`-mb-1 ${sortType === 'asc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
        <DownIcon className={sortType === 'desc' ? 'text-primary' : 'text-muted-foreground/40'} />
      </span>
    </button>
  );
}
