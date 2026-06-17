import DropdownExport from './DropdownExport';
import ErrorRow from './ErrorRow';
import type { ISortType } from './HeadWrongNumber';
import HeadWrongNumber from './HeadWrongNumber';
import Pagination, { ITEM_PER_PAGE } from './Pagination';
import RowDetail from './RowDetail';
import { useErrorBookStore } from './store';
import type { groupedWordRecords } from './type';
import { db, useDeleteWordRecord } from '@/shared/lib/db';
import type { WordRecord } from '@/shared/lib/db/record';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import IconArrowLeft from '~icons/tabler/arrow-left';

type SummaryCardProps = {
  label: string;
  value: string;
};

const SummaryCard = ({ label, value }: SummaryCardProps) => (
  <section className="my-panel px-4 py-3">
    <div className="flex items-end justify-between gap-3">
      <div className="text-text-faint text-xs font-medium">{label}</div>
      <div className="text-text-strong font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.25rem] leading-none font-semibold tracking-tight">
        {value}
      </div>
    </div>
  </section>
);

export function ErrorBook() {
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.ceil(groupedRecords.length / ITEM_PER_PAGE), [groupedRecords.length]);
  const [sortType, setSortType] = useState<ISortType>('asc');
  const navigate = useNavigate();
  const currentRowDetail = useErrorBookStore((state) => state.currentRowDetail);
  const { deleteWordRecord } = useDeleteWordRecord();

  const onBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages],
  );

  const setSort = useCallback(
    (nextSortType: ISortType) => {
      setSortType(nextSortType);
      setPage(1);
    },
    [setPage],
  );

  const sortedRecords = useMemo(() => {
    if (sortType === 'none') return groupedRecords;
    return [...groupedRecords].sort((a, b) => {
      if (sortType === 'asc') {
        return a.wrongCount - b.wrongCount;
      }

      return b.wrongCount - a.wrongCount;
    });
  }, [groupedRecords, sortType]);

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;
    return sortedRecords.slice(start, end);
  }, [currentPage, sortedRecords]);

  const summary = useMemo(() => {
    const totalWrongCount = groupedRecords.reduce((acc, item) => acc + item.wrongCount, 0);
    const dictionaryCount = new Set(groupedRecords.map((item) => item.dict)).size;

    return {
      totalWrongCount,
      dictionaryCount,
    };
  }, [groupedRecords]);

  useEffect(() => {
    db.wordRecords
      .where('wrongCount')
      .above(0)
      .toArray()
      .then((records) => {
        const groupMap = new Map<string, groupedWordRecords>();

        records.forEach((record) => {
          const key = `${record.dict}::${record.word}`;
          const existingGroup = groupMap.get(key);

          if (existingGroup) {
            existingGroup.records.push(record as WordRecord);
            existingGroup.wrongCount += record.wrongCount;
            return;
          }

          groupMap.set(key, {
            word: record.word,
            dict: record.dict,
            records: [record as WordRecord],
            wrongCount: record.wrongCount,
          });
        });

        setGroupedRecords(Array.from(groupMap.values()));
      });
  }, []);

  const handleDelete = async (word: string, dict: string) => {
    const deletedCount = await deleteWordRecord(word, dict);
    if (!deletedCount) return;

    setGroupedRecords((prev) => {
      const nextRecords = prev.filter((item) => !(item.word === word && item.dict === dict));
      const nextTotalPages = Math.max(1, Math.ceil(nextRecords.length / ITEM_PER_PAGE));

      setCurrentPage((prevPage) => Math.min(prevPage, nextTotalPages));

      return nextRecords;
    });
  };

  return (
    <>
      <div
        className={`flex h-screen min-h-0 w-full flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 lg:px-8 ${currentRowDetail ? 'blur-sm' : ''}`}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-text-strong text-[1.75rem] font-semibold tracking-tight sm:text-[2rem]">错题本</h1>
                <p className="text-text-muted mt-1 max-w-2xl text-sm leading-6">
                  查看高频错误单词、按错误次数排序并导出记录，优先清理最容易反复出错的词条。
                </p>
              </div>
            </div>

            <button
              type="button"
              className="my-btn-secondary my-focus-ring inline-flex gap-2 self-start px-4 sm:self-auto"
              onClick={onBack}
            >
              <IconArrowLeft className="h-4.5 w-4.5" />
              返回练习
            </button>
          </div>

          <div className="mb-3 grid gap-2 md:grid-cols-4">
            <SummaryCard label="错题条目" value={`${groupedRecords.length}`} />
            <SummaryCard label="总错误次数" value={`${summary.totalWrongCount}`} />
            <SummaryCard label="涉及词典" value={`${summary.dictionaryCount}`} />
            <SummaryCard label="当前页" value={`${currentPage}/${Math.max(totalPages, 1)}`} />
          </div>

          <section className="my-panel flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-text-strong text-base font-semibold tracking-tight">
                    按单词与词典聚合的错误记录
                  </div>
                </div>
                <div className="text-text-muted text-xs sm:text-sm">点击任意行查看详细统计与发音信息</div>
              </div>

              <div className="border-border-main bg-bg-panel text-text-main rounded-app-md sticky top-0 z-10 mb-2 grid grid-cols-[1.3fr_2.8fr_0.9fr_1.1fr_auto] items-center gap-3 border px-4 py-2.5 text-sm font-medium">
                <span>单词</span>
                <span>释义</span>
                <HeadWrongNumber className="justify-self-start" sortType={sortType} setSortType={setSort} />
                <span>词典</span>
                <DropdownExport renderRecords={sortedRecords} />
              </div>

              <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
                <ScrollArea.Viewport className="h-full min-h-0">
                  <div className="flex flex-col gap-2 pb-1">
                    {renderRecords.map((record) => (
                      <ErrorRow key={`${record.dict}-${record.word}`} record={record} onDelete={handleDelete} />
                    ))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="flex touch-none bg-transparent select-none" orientation="vertical" />
              </ScrollArea.Root>
            </div>
          </section>

          <Pagination className="pt-3" page={currentPage} setPage={setPage} totalPages={Math.max(totalPages, 1)} />
        </div>
      </div>
      {currentRowDetail && <RowDetail currentRowDetail={currentRowDetail} allRecords={sortedRecords} />}
    </>
  );
}

export default ErrorBook;
