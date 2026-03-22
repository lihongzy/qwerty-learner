import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/shared/state'
import { useDeleteWordRecord } from '@/shared/lib/db'
import type { Dictionary } from '@/shared/types/resource'
import range from '@/shared/utils/range'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Tabs, ToggleGroup } from 'radix-ui'
import IcOutlineCollectionsBookmark from '~icons/ic/outline-collections-bookmark'
import MajesticonsPaperFoldTextLine from '~icons/majesticons/paper-fold-text-line'
import PajamasReviewList from '~icons/pajamas/review-list'
import SolarNotebookMinimalisticBold from '~icons/solar/notebook-minimalistic-bold'
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

  const chapter = useMemo(() => (dict.id === currentDictId ? currentChapter : 0), [currentChapter, currentDictId, dict.id])
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload)
  const tableData = useMemo(() => getRowsFromErrorWordData(errorWordData), [errorWordData])

  const statCards = useMemo(
    () => [
      {
        label: '章节',
        value: dict.chapterCount,
        tone: 'text-[var(--text-strong)]',
      },
      {
        label: '词数',
        value: dict.length,
        tone: 'text-[var(--text-strong)]',
      },
      {
        label: '错词',
        value: errorWordData.length,
        tone: errorWordData.length > 0 ? 'text-[var(--accent-warn)]' : 'text-[var(--text-strong)]',
      },
      {
        label: '当前章节',
        value: dict.id === currentDictId && chapter >= 0 ? chapter + 1 : '-',
        tone: dict.id === currentDictId && chapter >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--text-strong)]',
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

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden text-[var(--text-main)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_48%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_32%)]" />

      <div className="relative flex flex-col gap-3 border-b border-[var(--border-main)] px-4 pb-3 pt-4 sm:px-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="my-panel relative overflow-hidden px-4 py-4">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.08),transparent_42%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_30%)]" />
            <div className="relative flex h-full flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-main)] bg-[var(--bg-panel)] px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--text-faint)]">
                  <SolarNotebookMinimalisticBold className="h-4 w-4 text-[var(--accent-primary)]" />
                  词典详情
                </span>
                {dict.id === currentDictId && (
                  <span className="inline-flex rounded-full border border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] px-2.5 py-1 text-[0.72rem] font-medium text-[var(--accent-primary)]">
                    当前练习词库
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="max-w-3xl text-[1.55rem] font-semibold tracking-tight text-[var(--text-strong)] sm:text-[1.8rem]">
                  {dict.name}
                </h3>
                <p className="max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{dict.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-2">
            {statCards.map((item) => (
              <div key={item.label} className="my-control-shell px-3 py-2.5">
                <div className="text-[0.66rem] font-semibold tracking-[0.1em] text-[var(--text-faint)]">{item.label}</div>
                <div className={`mt-1.5 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] font-semibold ${item.tone}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-control-shell flex flex-wrap items-center justify-between gap-2 px-2.5 py-2.5">
          <div className="text-sm text-[var(--text-muted)]">章节选择、错词记录与复习入口</div>
          <ToggleGroup.Root type="single" value={curTab} onValueChange={handleTabChange} className="flex flex-wrap gap-2">
            <ToggleGroup.Item
              value={Tab.Chapters}
              disabled={curTab === Tab.Chapters}
              className={`${tabButtonClassName} ${
                curTab === Tab.Chapters
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-strong)] shadow-[0_10px_24px_rgba(13,148,136,0.12)]'
                  : 'border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--text-main)]'
              }`}
            >
              <MajesticonsPaperFoldTextLine className="mr-1.5" />
              章节
            </ToggleGroup.Item>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroup.Item
                  value={Tab.Errors}
                  disabled={curTab === Tab.Errors}
                  className={`${tabButtonClassName} ${
                    curTab === Tab.Errors
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-strong)] shadow-[0_10px_24px_rgba(13,148,136,0.12)]'
                      : 'border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <IcOutlineCollectionsBookmark className="mr-1.5" />
                  错词
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value={Tab.Review}
                  disabled={curTab === Tab.Review}
                  className={`${tabButtonClassName} ${
                    curTab === Tab.Review
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-strong)] shadow-[0_10px_24px_rgba(13,148,136,0.12)]'
                      : 'border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--text-main)]'
                  }`}
                >
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
            <div className="my-panel flex h-0 min-h-0 flex-1 flex-col  p-2.5">
              <ScrollArea.Root className="h-full min-h-0 flex-1 overflow-hidden">
                <ScrollArea.Viewport className="h-full min-h-0 w-full pr-2">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {range(0, dict.chapterCount, 1).map((index) => (
                      <Chapter key={`${dict.id}-${index}`} index={index} checked={chapter === index} dictID={dict.id} onChange={onChangeChapter} />
                    ))}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="flex w-2.5 touch-none select-none bg-transparent" orientation="vertical">
                  <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[linear-gradient(180deg,var(--accent-primary-soft),rgba(34,211,238,0.35))]" />
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
