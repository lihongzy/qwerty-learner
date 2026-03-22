import * as Progress from '@radix-ui/react-progress'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import bookCover from '@/assets/book-cover.png'
import { currentDictIdAtom } from '@/shared/state'
import type { Dictionary } from '@/shared/types/resource'
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { calcChapterCount } from '@/shared/utils'
import DictDetail from './DictDetail'
import { useDictStats } from './hooks/useDictStats'

interface Props {
  dictionary: Dictionary
}

export default function DictionaryComponent({ dictionary }: Props) {
  const currentDictID = useAtomValue(currentDictIdAtom)
  const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true })
  const dictStats = useDictStats(dictionary.id, isIntersecting)
  const chapterCount = useMemo(() => calcChapterCount(dictionary.length), [dictionary.length])
  const isSelected = currentDictID === dictionary.id
  const progress = useMemo(
    () => (dictStats ? Math.ceil((dictStats.exercisedChapterCount / chapterCount) * 100) : 0),
    [chapterCount, dictStats],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={ref}
          className={`my-focus-ring group relative flex min-h-[12rem] cursor-pointer overflow-hidden rounded-[var(--radius-md)] border p-5 text-left shadow-[var(--shadow-soft)] transition-colors duration-200 ${
            isSelected
              ? 'border-[var(--accent-primary)] bg-[linear-gradient(180deg,var(--accent-primary-soft),var(--bg-panel))]'
              : 'border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] hover:border-[var(--accent-primary)]'
          }`}
          role="button"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_28%)] opacity-80" />

          <div className="relative flex h-full w-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[1.25rem] font-semibold tracking-tight text-[var(--text-strong)]">{dictionary.name}</h1>
                <Tooltip content={dictionary.description}>
                  <p className="mt-2 truncate text-sm text-[var(--text-muted)]">{dictionary.description}</p>
                </Tooltip>
              </div>
              <img src={bookCover} className={`h-14 w-14 shrink-0 ${isSelected ? 'opacity-45' : 'opacity-22'}`} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="my-control-shell px-3 py-2">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Words</div>
                <div className="mt-1 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-base font-semibold text-[var(--text-strong)]">
                  {dictionary.length}
                </div>
              </div>
              <div className="my-control-shell px-3 py-2">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Chapters</div>
                <div className="mt-1 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-base font-semibold text-[var(--text-strong)]">
                  {chapterCount}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Progress</span>
                <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace]">{progress}%</span>
              </div>
              <Progress.Root
                value={progress}
                max={100}
                className="h-2 w-full overflow-hidden rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)]"
              >
                <Progress.Indicator
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-cool))]"
                  style={{ width: `calc(${progress}%)` }}
                />
              </Progress.Root>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[min(92vh,56rem)] w-[min(72rem,calc(100vw-1.5rem))] max-w-none p-0">
        <DictDetail dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}
