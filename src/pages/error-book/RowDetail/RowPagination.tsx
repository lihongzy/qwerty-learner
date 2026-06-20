import { useErrorBookStore } from '../store';
import type { groupedWordRecords } from '../type';
import { useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import NextIcon from '~icons/ooui/next-ltr';
import PrevIcon from '~icons/ooui/next-rtl';

type Props = {
  className?: string;
  allRecords: groupedWordRecords[];
};

const btnClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary';

export default function RowPagination({ className, allRecords }: Props) {
  const currentRowDetail = useErrorBookStore((s) => s.currentRowDetail);
  const setCurrentRowDetail = useErrorBookStore((s) => s.setCurrentRowDetail);

  const currentIndex = useMemo(() => {
    if (!currentRowDetail) return -1;
    return allRecords.findIndex((r) => r.word === currentRowDetail.word && r.dict === currentRowDetail.dict);
  }, [currentRowDetail, allRecords]);

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentRowDetail(allRecords[currentIndex - 1]);
  }, [currentIndex, allRecords, setCurrentRowDetail]);

  const next = useCallback(() => {
    if (currentIndex < allRecords.length - 1) setCurrentRowDetail(allRecords[currentIndex + 1]);
  }, [currentIndex, allRecords, setCurrentRowDetail]);

  useHotkeys(
    'left',
    (e) => {
      prev();
      e.stopPropagation();
    },
    { preventDefault: true },
  );
  useHotkeys(
    'right',
    (e) => {
      next();
      e.stopPropagation();
    },
    { preventDefault: true },
  );

  return (
    <div className={`flex items-center gap-2 select-none ${className ?? ''}`}>
      <button className={btnClass} onClick={prev} disabled={currentIndex <= 0}>
        <PrevIcon />
      </button>
      <span className="font-mono text-sm">
        {currentIndex + 1} / {allRecords.length}
      </span>
      <button className={btnClass} onClick={next} disabled={currentIndex >= allRecords.length - 1}>
        <NextIcon />
      </button>
    </div>
  );
}
