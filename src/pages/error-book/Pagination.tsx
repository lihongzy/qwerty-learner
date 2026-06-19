import NextIcon from '~icons/ooui/next-ltr';
import PrevIcon from '~icons/ooui/next-rtl';

export const ITEM_PER_PAGE = 20;

type Props = {
  className?: string;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
};

const btnClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40';

export default function Pagination({ className, page, setPage, totalPages }: Props) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ''}`}>
      <button className={btnClass} onClick={() => setPage(page - 1)} disabled={page <= 1}>
        <PrevIcon />
      </button>
      <span className="font-mono text-sm">
        {page} / {totalPages}
      </span>
      <button className={btnClass} onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
        <NextIcon />
      </button>
    </div>
  );
}
