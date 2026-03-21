import * as Progress from '@radix-ui/react-progress'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import DictDetail from './DictDetail'
import { useDictStats } from './hooks/useDictStats'
import bookCover from '@/assets/book-cover.png'
import { currentDictIdAtom } from '@/shared/state'
import type { Dictionary } from '@/shared/types/resource'
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { calcChapterCount } from '@/shared/utils'

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
          className={`group flex h-36 w-80 cursor-pointer items-center justify-center overflow-hidden rounded-lg p-4 text-left shadow-lg focus:outline-none ${
            isSelected ? 'bg-indigo-400' : 'bg-zinc-50 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
          role="button"
        >
          <div className="relative ml-1 mt-2 flex h-full w-full flex-col items-start justify-start">
            <h1
              className={`mb-1.5 text-xl font-normal ${
                isSelected ? 'text-white' : 'text-gray-800 group-hover:text-indigo-400 dark:text-gray-200'
              }`}
            >
              {dictionary.name}
            </h1>
            <Tooltip content={dictionary.description}>
              <p className={`mb-1 max-w-full truncate whitespace-nowrap ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-200'}`}>
                {dictionary.description}
              </p>
            </Tooltip>

            <p className={`mb-0.5 font-bold ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-200'}`}>{dictionary.length} 词</p>
            <div className="flex w-full items-center pt-2">
              {progress > 0 && (
                <Progress.Root
                  value={progress}
                  max={100}
                  className={`mr-4 h-2 w-full rounded-full border bg-white ${isSelected ? 'border-indigo-600' : 'border-indigo-400'}`}
                >
                  <Progress.Indicator
                    className={`h-full rounded-full pl-0 ${isSelected ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                    style={{ width: `calc(${progress}%)` }}
                  />
                </Progress.Root>
              )}
              <img src={bookCover} className={`absolute right-3 top-3 w-16 ${isSelected ? 'opacity-50' : 'opacity-20'}`} />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[60rem] max-w-none !rounded-[20px]">
        <DictDetail dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}
