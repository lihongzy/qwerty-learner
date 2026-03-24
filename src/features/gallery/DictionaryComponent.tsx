import * as Progress from '@radix-ui/react-progress'
import clsx from 'clsx'
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
          className={clsx(
            'my-focus-ring group relative flex min-h-[12rem] cursor-pointer overflow-hidden rounded-app-md border p-5 text-left shadow-app-soft transition-colors duration-200',
            isSelected
              ? 'border-accent-primary bg-accent-primary-soft'
              : 'border-border-main bg-bg-panel hover:border-accent-primary',
          )}
          role="button"
        >
          <div className="relative flex h-full w-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-text-strong text-[1.25rem] font-semibold tracking-tight">{dictionary.name}</h1>
                <Tooltip content={dictionary.description}>
                  <p className="text-text-muted mt-2 truncate text-sm">{dictionary.description}</p>
                </Tooltip>
              </div>
              <img src={bookCover} className={`h-14 w-14 shrink-0 ${isSelected ? 'opacity-45' : 'opacity-22'}`} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-app-md border border-border-main bg-bg-elevated px-3 py-2">
                <div className="text-text-faint text-xs">词数</div>
                <div className="text-text-strong mt-1 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-base font-semibold">
                  {dictionary.length}
                </div>
              </div>
              <div className="rounded-app-md border border-border-main bg-bg-elevated px-3 py-2">
                <div className="text-text-faint text-xs">章节</div>
                <div className="text-text-strong mt-1 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-base font-semibold">
                  {chapterCount}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-text-muted mb-1.5 flex items-center justify-between text-xs">
                <span>进度</span>
                <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace]">{progress}%</span>
              </div>
              <Progress.Root value={progress} max={100} className="bg-bg-ghost h-1.5 w-full overflow-hidden rounded-full">
                <Progress.Indicator className="bg-accent-primary h-full rounded-full" style={{ width: `${progress}%` }} />
              </Progress.Root>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[min(92vh,56rem)] w-[56rem] max-w-none p-0">
        <DictDetail dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}
