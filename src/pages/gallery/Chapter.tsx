import { useChapterStats } from './hooks/useChapterStats';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import IconCheckCircle from '~icons/heroicons/check-circle-solid';

export default function Chapter({
  index,
  checked,
  dictID,
  onChange,
}: {
  index: number;
  checked: boolean;
  dictID: string;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({});
  const chapterStatus = useChapterStats(index, dictID, !!isIntersecting);

  useEffect(() => {
    if (checked && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [checked]);

  return (
    <button
      type="button"
      tabIndex={-1}
      ref={(node) => {
        ref.current = node;
        intersectionRef(node);
      }}
      className={`relative flex h-20 w-full cursor-pointer flex-col justify-center overflow-hidden rounded-lg border px-4 py-3 transition-colors ${
        checked ? 'border-primary bg-primary/10' : 'hover:border-primary'
      }`}
      onClick={() => onChange(index)}
    >
      <div className="mt-1 text-left text-sm font-semibold">第 {index + 1} 章</div>
      <p className="text-muted-foreground relative pt-1 text-left text-xs">
        {chapterStatus
          ? chapterStatus.exerciseCount > 0
            ? `已练习 ${chapterStatus.exerciseCount} 次`
            : '尚未练习'
          : '加载中...'}
      </p>
      {checked && <IconCheckCircle className="text-primary absolute top-3 right-3 h-4.5 w-4.5" />}
    </button>
  );
}
