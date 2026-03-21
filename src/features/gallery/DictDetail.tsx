import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/shared/state'
import type { Dictionary } from '@/typings/resource'
import { useDeleteWordRecord } from '@/shared/lib/db'
import range from '@/utils/range'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ScrollArea, Tabs, ToggleGroup } from 'radix-ui'
import IcOutlineCollectionsBookmark from '~icons/ic/outline-collections-bookmark'
import MajesticonsPaperFoldTextLine from '~icons/majesticons/paper-fold-text-line'
import PajamasReviewList from '~icons/pajamas/review-list'
import Chapter from './Chapter'
import { ErrorTable } from './ErrorTable'
import { getRowsFromErrorWordData } from './ErrorTable/columns'
import useErrorWordData from './hooks/useErrorWords'
import { ReviewDetail } from './ReviewDetail'

enum Tab {
  Chapters = 'chapters',
  Errors = 'errors',
  Review = 'review',
}

const tabButtonClassName =
  'inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors disabled:cursor-default disabled:opacity-100'

export default function DictDetail({ dictionary: dict }: { dictionary: Dictionary }) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const navigate = useNavigate()
  const { deleteWordRecord } = useDeleteWordRecord()
  const [reload, setReload] = useState(false)

  const chapter = useMemo(() => (dict.id === currentDictId ? currentChapter : 0), [currentChapter, currentDictId, dict.id])
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload)
  const tableData = useMemo(() => getRowsFromErrorWordData(errorWordData), [errorWordData])

  const onDelete = useCallback(
    async (word: string) => {
      await deleteWordRecord(word, dict.id)
      setReload((old) => !old)
    },
    [deleteWordRecord, dict.id],
  )

  const onChangeChapter = useCallback(
    (index: number) => {
      setCurrentDictId(dict.id)
      setCurrentChapter(index)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
      navigate('/')
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo],
  )

  const handleTabChange = useCallback((value: string) => {
    if (value === '') {
      return
    }

    const nextTab = value as Tab
    setCurTab((old) => (old === nextTab ? old : nextTab))
  }, [])

  return (
    <div className="flex flex-col rounded-[4rem] px-4 py-3 pl-5 text-gray-800 dark:text-gray-300">
      <div className="relative flex h-40 flex-col gap-2">
        <h3 className="text-2xl font-semibold">{dict.name}</h3>
        <p className="mt-1">{dict.chapterCount} 章节</p>
        <p>共 {dict.length} 词</p>
        <p>{dict.description}</p>
        <div className="absolute bottom-5 right-4">
          <ToggleGroup.Root type="single" value={curTab} onValueChange={handleTabChange} className="flex flex-wrap gap-2">
            <ToggleGroup.Item
              value={Tab.Chapters}
              disabled={curTab === Tab.Chapters}
              className={`${tabButtonClassName} ${
                curTab === Tab.Chapters ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <MajesticonsPaperFoldTextLine className="mr-1.5 text-gray-500" />
              章节选择
            </ToggleGroup.Item>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroup.Item
                  value={Tab.Errors}
                  disabled={curTab === Tab.Errors}
                  className={`${tabButtonClassName} ${
                    curTab === Tab.Errors ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <IcOutlineCollectionsBookmark className="mr-1.5 text-gray-500" />
                  查看错题
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value={Tab.Review}
                  disabled={curTab === Tab.Review}
                  className={`${tabButtonClassName} ${
                    curTab === Tab.Review ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <PajamasReviewList className="mr-1.5 text-gray-500" />
                  错题回顾
                </ToggleGroup.Item>
              </>
            )}
          </ToggleGroup.Root>
        </div>
      </div>
      <div className="flex pl-0">
        <Tabs.Root value={curTab} className="h-[30rem] w-full">
          <Tabs.Content value={Tab.Chapters} className="h-full">
            <ScrollArea.Root className="h-[30rem] overflow-y-auto">
              <ScrollArea.Viewport className="h-full w-full pr-2">
                <div className="flex w-full flex-wrap gap-3">
                  {range(0, dict.chapterCount, 1).map((index) => (
                    <Chapter
                      key={`${dict.id}-${index}`}
                      index={index}
                      checked={chapter === index}
                      dictID={dict.id}
                      onChange={onChangeChapter}
                    />
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical" />
            </ScrollArea.Root>
          </Tabs.Content>
          <Tabs.Content value={Tab.Errors} className="h-full">
            <ErrorTable data={tableData} isLoading={isLoading} error={error} onDelete={onDelete} />
          </Tabs.Content>
          <Tabs.Content value={Tab.Review} className="h-full">
            <ReviewDetail errorData={errorWordData} dict={dict} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
