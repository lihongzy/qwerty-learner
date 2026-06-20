import { LoadingWordUI } from '../LoadingWordUI';
import useGetWord from '../hooks/useGetWord';
import { useErrorBookStore } from '../store';
import type { groupedWordRecords } from '../type';
import { WordPronunciationIcon, type WordPronunciationIconRef } from '@/shared/components/WordPronunciationIcon';
import { Letter, Phonetic } from '@/shared/components/word-display';
import { idDictionaryMap } from '@/shared/resources/dictionary';
import { useCallback, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconX from '~icons/tabler/x';
import HashtagIcon from '~icons/heroicons/chart-pie-20-solid';
import CheckCircle from '~icons/heroicons/check-circle-20-solid';
import ClockIcon from '~icons/heroicons/clock-20-solid';
import XCircle from '~icons/heroicons/x-circle-20-solid';
import DataTag from './DataTag';
import RowPagination from './RowPagination';

type Props = {
  currentRowDetail: groupedWordRecords;
  allRecords: groupedWordRecords[];
};

const RowDetail = ({ currentRowDetail, allRecords }: Props) => {
  const setCurrentRowDetail = useErrorBookStore((s) => s.setCurrentRowDetail);
  const dictInfo = idDictionaryMap[currentRowDetail.dict];
  const { word, isLoading, hasError } = useGetWord(currentRowDetail.word, dictInfo);
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);

  const rowDetailData = useMemo(() => {
    const records = currentRowDetail.records;
    const time = records.length > 0 ? records.reduce((acc, cur) => acc + cur.totalTime, 0) / records.length : 0;
    const correctCount = records.length;
    const wrongCount = currentRowDetail.wrongCount;
    return {
      time: `${(time / 1000).toFixed(2)}s`,
      sumCount: correctCount + wrongCount,
      correctCount,
      wrongCount,
    };
  }, [currentRowDetail.records, currentRowDetail.wrongCount]);

  const onClose = useCallback(() => setCurrentRowDetail(null), [setCurrentRowDetail]);

  useHotkeys(
    'esc',
    (e) => {
      onClose();
      e.stopPropagation();
    },
    { preventDefault: true },
  );
  useHotkeys('ctrl+j', () => wordPronunciationIconRef.current?.play(), [], {
    enableOnFormTags: true,
    preventDefault: true,
  });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-popover relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border px-6 py-6 shadow-lg">
        <button
          type="button"
          className="text-muted-foreground hover:border-primary hover:text-foreground absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          onClick={onClose}
        >
          <IconX className="h-5 w-5" />
        </button>

        <h2 className="pr-12 text-2xl font-semibold">错词详情</h2>

        <div className="mt-8 flex flex-col items-center">
          <div className="font-mono text-3xl font-semibold">
            {currentRowDetail.word.split('').map((char, index) => (
              <Letter key={`${index}-${char}`} letter={char} visible state="normal" />
            ))}
          </div>
          <div className="relative mt-3 flex min-h-8 items-center">
            {word ? <Phonetic word={word} /> : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            {word && (
              <WordPronunciationIcon
                lang={dictInfo.language}
                word={word}
                className="absolute top-1/2 -right-7 h-5 w-5 -translate-y-1/2"
                ref={wordPronunciationIconRef}
              />
            )}
          </div>
          <div className="mt-4 flex max-w-2xl items-center">
            <span className="text-muted-foreground text-center text-base leading-7">
              {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <DataTag icon={ClockIcon} name="平均用时" data={rowDetailData.time} />
          <DataTag icon={HashtagIcon} name="练习次数" data={rowDetailData.sumCount} />
          <DataTag icon={CheckCircle} name="正确次数" data={rowDetailData.correctCount} />
          <DataTag icon={XCircle} name="错误次数" data={rowDetailData.wrongCount} />
        </div>

        <RowPagination className="mt-6 self-center" allRecords={allRecords} />
      </div>
    </div>
  );
};

export default RowDetail;
