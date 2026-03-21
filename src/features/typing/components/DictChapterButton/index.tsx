import { SimpleTooltip as Tooltip } from '@/shared/ui/tooltip'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import { useAtom, useAtomValue } from 'jotai'
import { memo } from 'react'
import { Select } from 'radix-ui'
import { NavLink } from 'react-router'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

const triggerClassName =
  'flex h-10 min-w-[8rem] items-center justify-between gap-3 rounded-lg px-3 py-1 text-lg text-slate-700 transition-colors duration-300 ease-in-out outline-none hover:bg-indigo-400 hover:text-white dark:text-white/60 dark:hover:text-white'

const contentClassName =
  'z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-stone-200 bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:border-gray-700 dark:bg-gray-800'

const itemClassName =
  'relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-9 pr-8 text-sm text-slate-700 outline-none transition-colors data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900 dark:text-white/90 dark:data-[highlighted]:bg-gray-700 dark:data-[highlighted]:text-white'

const TOOLTIP_DICT = 'Dictionary'
const TOOLTIP_CHAPTER = 'Chapter'
const REVIEW_MODE_LABEL = 'Review'

const DictChapterButtonComponent = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const chapterIndexes = Array.from({ length: currentDictInfo.chapterCount }, (_, index) => index)
  const currentChapterLabel = `Chapter ${currentChapter + 1}`

  const handleChapterChange = (value: string) => {
    const nextChapter = Number(value)
    if (!Number.isNaN(nextChapter)) {
      setCurrentChapter(nextChapter)
    }
  }

  return (
    <>
      <Tooltip content={TOOLTIP_DICT}>
        <NavLink
          className="block rounded-lg px-3 py-1 text-lg text-slate-700 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white/60 dark:hover:text-white"
          to="/gallery"
        >
          {currentDictInfo.name}
          {isReviewMode ? ` ${REVIEW_MODE_LABEL}` : ''}
        </NavLink>
      </Tooltip>

      {!isReviewMode && (
        <Tooltip content={TOOLTIP_CHAPTER}>
          <Select.Root value={String(currentChapter)} onValueChange={handleChapterChange}>
            <Select.Trigger className={triggerClassName} aria-label={TOOLTIP_CHAPTER}>
              <Select.Value>{currentChapterLabel}</Select.Value>
              <Select.Icon>
                <IconChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content position="popper" side="bottom" align="start" sideOffset={8} className={contentClassName}>
                <Select.Viewport className="max-h-72 p-1">
                  {chapterIndexes.map((chapterIndex) => (
                    <Select.Item key={chapterIndex} value={String(chapterIndex)} className={itemClassName}>
                      <Select.ItemIndicator className="absolute left-3 inline-flex items-center text-indigo-500">
                        <IconCheck className="h-4 w-4" />
                      </Select.ItemIndicator>
                      <Select.ItemText>{`Chapter ${chapterIndex + 1}`}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Tooltip>
      )}
    </>
  )
}

export const DictChapterButton = memo(DictChapterButtonComponent)

