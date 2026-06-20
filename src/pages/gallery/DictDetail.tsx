import { usePracticeSessionStore } from '@/shared/stores';
import { useDeleteWordRecord } from '@/shared/lib/db';
import type { Dictionary } from '@/shared/types/resource';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import IcOutlineCollectionsBookmark from '~icons/ic/outline-collections-bookmark';
import MajesticonsPaperFoldTextLine from '~icons/majesticons/paper-fold-text-line';
import PajamasReviewList from '~icons/pajamas/review-list';
import Chapter from './Chapter';
import { ErrorTable } from './ErrorTable';
import { getRowsFromErrorWordData } from './ErrorTable/columns';
import useErrorWordData, { type TErrorWordData } from './hooks/useErrorWords';
import { ReviewDetail } from './ReviewDetail';

type Tab = 'chapters' | 'errors' | 'review';

const tabDefs = [
  { value: 'chapters' as Tab, label: '章节', Icon: MajesticonsPaperFoldTextLine },
  { value: 'errors' as Tab, label: '错词', Icon: IcOutlineCollectionsBookmark },
  { value: 'review' as Tab, label: '复习', Icon: PajamasReviewList },
];

export default function DictDetail({ dictionary: dict }: { dictionary: Dictionary }) {
  const currentChapter = usePracticeSessionStore((s) => s.currentChapter);
  const currentDictId = usePracticeSessionStore((s) => s.currentDictId);
  const setCurrentChapter = usePracticeSessionStore((s) => s.setCurrentChapter);
  const setCurrentDictId = usePracticeSessionStore((s) => s.setCurrentDictId);
  const setReviewModeInfo = usePracticeSessionStore((s) => s.setReviewModeInfo);
  const navigate = useNavigate();
  const { deleteWordRecord } = useDeleteWordRecord();
  const [curTab, setCurTab] = useState<Tab>('chapters');
  const [localErrorWordData, setLocalErrorWordData] = useState<TErrorWordData[]>([]);

  const chapter = dict.id === currentDictId ? currentChapter : 0;
  const { errorWordData, isLoading, error } = useErrorWordData(dict, false);
  const tableData = useMemo(() => getRowsFromErrorWordData(localErrorWordData), [localErrorWordData]);
  const hasErrors = localErrorWordData.length > 0;

  useEffect(() => {
    setLocalErrorWordData(errorWordData);
  }, [errorWordData]);

  // 错词被全部删除后，自动切回章节 tab
  useEffect(() => {
    if (!hasErrors && curTab !== 'chapters') setCurTab('chapters');
  }, [hasErrors, curTab]);

  const statCards = useMemo(
    () => [
      { label: '章节', value: dict.chapterCount },
      { label: '词数', value: dict.length },
      { label: '错词', value: localErrorWordData.length, warn: localErrorWordData.length > 0 },
      {
        label: '当前章节',
        value: dict.id === currentDictId && chapter >= 0 ? chapter + 1 : '-',
        highlight: dict.id === currentDictId && chapter >= 0,
      },
    ],
    [chapter, currentDictId, dict.chapterCount, dict.length, localErrorWordData.length],
  );

  const onDelete = useCallback(
    async (word: string) => {
      const deletedCount = await deleteWordRecord(word, dict.id);
      if (deletedCount) setLocalErrorWordData((prev) => prev.filter((item) => item.word !== word));
    },
    [deleteWordRecord, dict.id],
  );

  const onChangeChapter = useCallback(
    (index: number) => {
      setCurrentDictId(dict.id);
      setCurrentChapter(index);
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
      navigate('/');
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo],
  );

  const visibleTabs = hasErrors ? tabDefs : [tabDefs[0]];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex flex-col gap-2 border-b px-5 pt-3 pb-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            {dict.id === currentDictId && <div className="text-primary mb-1 text-xs font-medium">当前练习词库</div>}
            <h3 className="text-xl font-semibold">{dict.name}</h3>
            <p className="text-muted-foreground mt-0.5 text-sm">{dict.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {statCards.map((item) => (
              <div key={item.label} className="rounded-lg border px-3 py-1.5">
                <div className="text-muted-foreground text-xs">{item.label}</div>
                <div
                  className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${
                    item.warn ? 'text-destructive' : item.highlight ? 'text-primary' : ''
                  }`}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTabs.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCurTab(value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                curTab === value
                  ? 'border-primary bg-primary/10'
                  : 'text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-3 pb-4">
        {curTab === 'chapters' && (
          <div className="min-h-0 flex-1 overflow-auto rounded-lg border p-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: dict.chapterCount }, (_, i) => i).map((index) => (
                <Chapter
                  key={`${dict.id}-${index}`}
                  index={index}
                  checked={chapter === index}
                  dictID={dict.id}
                  onChange={onChangeChapter}
                />
              ))}
            </div>
          </div>
        )}
        {curTab === 'errors' && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border p-2.5">
            <ErrorTable data={tableData} isLoading={isLoading} error={error} onDelete={onDelete} />
          </div>
        )}
        {curTab === 'review' && (
          <div className="min-h-0 flex-1 overflow-hidden">
            <ReviewDetail errorData={localErrorWordData} dict={dict} />
          </div>
        )}
      </div>
    </div>
  );
}
