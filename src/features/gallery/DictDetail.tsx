import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/shared/state'
import { useDeleteWordRecord } from '@/shared/lib/db'
import type { Dictionary } from '@/shared/types/resource'
import range from '@/shared/utils/range'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import clsx from 'clsx'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Tabs, ToggleGroup } from 'radix-ui'
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
  'my-focus-ring inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 disabled:cursor-default disabled:opacity-100'

export default function DictDetail({ dictionary: dict }: { dictionary: Dictionary }) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const navigate = useNavigate()
  const { deleteWordRecord } = useDeleteWordRecord()
  const [reload, setReload] = useState(false)
  const chapterScrollViewportRef = useRef<HTMLDivElement>(null)

  const chapter = useMemo(() => (dict.id === currentDictId ? currentChapter : 0), [currentChapter, currentDictId, dict.id])
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload)
  const tableData = useMemo(() => getRowsFromErrorWordData(errorWordData), [errorWordData])

  const statCards = useMemo(
    () => [
      {
        label: '章节',
        value: dict.chapterCount,
        tone: 'text-text-strong',
      },
      {
        label: '词数',
        value: dict.length,
        tone: 'text-text-strong',
      },
      {
        label: '错词',
        value: errorWordData.length,
        tone: errorWordData.length > 0 ? 'text-accent-warn' : 'text-text-strong',
      },
      {
        label: '当前章节',
        value: dict.id === currentDictId && chapter >= 0 ? chapter + 1 : '-',
        tone: dict.id === currentDictId && chapter >= 0 ? 'text-accent-primary' : 'text-text-strong',
      },
    ],
    [chapter, currentDictId, dict.chapterCount, dict.id, dict.length, errorWordData.length],
  )

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

  const getTabClassName = useCallback(
    (tab: Tab) =>
      clsx(
        tabButtonClassName,
        curTab === tab
          ? 'border-accent-primary bg-accent-primary-soft text-text-strong'
          : 'border-border-main bg-bg-panel text-text-muted hover:border-accent-primary hover:text-text-main',
      ),
    [curTab],
  )

  return (
    <div className="text-text-main flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-border-main flex flex-col gap-1.5 border-b px-4 pb-2 pt-2.5 sm:px-5">
        <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="my-panel px-4 py-2.5">
            <div className="flex h-full flex-col gap-1">
              {dict.id === currentDictId && (
                <div className="text-accent-primary text-xs font-medium">当前练习词库</div>
              )}

              <div className="space-y-0.5">
                <h3 className="text-text-strong max-w-3xl text-[1.28rem] font-semibold tracking-tight sm:text-[1.45rem]">
                  {dict.name}
                </h3>
                <p className="text-text-muted max-w-3xl text-[0.82rem] leading-5">{dict.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-2">
            {statCards.map((item) => (
              <div key={item.label} className="rounded-app-md border border-border-main bg-bg-elevated px-3 py-1.5">
                <div className="text-text-faint text-xs">{item.label}</div>
                <div className={`mt-0.5 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-sm font-semibold ${item.tone}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-control-shell flex flex-wrap items-center justify-end gap-1.5 px-1.5 py-1.5">
          <ToggleGroup.Root type="single" value={curTab} onValueChange={handleTabChange} className="flex flex-wrap gap-1.5">
            <ToggleGroup.Item value={Tab.Chapters} disabled={curTab === Tab.Chapters} className={getTabClassName(Tab.Chapters)}>
              <MajesticonsPaperFoldTextLine className="mr-1.5" />
              章节
            </ToggleGroup.Item>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroup.Item value={Tab.Errors} disabled={curTab === Tab.Errors} className={getTabClassName(Tab.Errors)}>
                  <IcOutlineCollectionsBookmark className="mr-1.5" />
                  错词
                </ToggleGroup.Item>
                <ToggleGroup.Item value={Tab.Review} disabled={curTab === Tab.Review} className={getTabClassName(Tab.Review)}>
                  <PajamasReviewList className="mr-1.5" />
                  复习
                </ToggleGroup.Item>
              </>
            )}
          </ToggleGroup.Root>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-3 sm:px-5">
        <Tabs.Root value={curTab} className="flex h-full min-h-0 w-full flex-col overflow-hidden">
          <Tabs.Content value={Tab.Chapters} className="flex h-0 min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
            <div className="my-panel flex h-0 min-h-0 flex-1 flex-col p-2">
              <ScrollArea.Root className="h-full min-h-0 flex-1 overflow-hidden">
                <ScrollArea.Viewport ref={chapterScrollViewportRef} className="h-full min-h-0 w-full pr-1">
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {range(0, dict.chapterCount, 1).map((index) => (
                      <Chapter
                        key={`${dict.id}-${index}`}
                        index={index}
                        checked={chapter === index}
                        dictID={dict.id}
                        onChange={onChangeChapter}
                        scrollContainerRef={chapterScrollViewportRef}
                      />
                    ))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="flex w-2 touch-none select-none" orientation="vertical">
                  <ScrollArea.Thumb className="bg-border-main relative flex-1 rounded-full" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </Tabs.Content>
          <Tabs.Content value={Tab.Errors} className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
            <div className="my-panel min-h-0 flex-1 overflow-hidden p-2.5">
              <ErrorTable data={tableData} isLoading={isLoading} error={error} onDelete={onDelete} />
            </div>
          </Tabs.Content>
          <Tabs.Content value={Tab.Review} className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
            <div className="my-panel min-h-0 flex-1 overflow-hidden">
              <ReviewDetail errorData={errorWordData} dict={dict} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
