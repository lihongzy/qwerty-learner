import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/shared/state'
import { useAtom, useAtomValue } from 'jotai'
import { memo } from 'react'
import * as Select from '@radix-ui/react-select'
import { NavLink } from 'react-router'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

const triggerClassName =
  'flex h-10 min-w-[8rem] items-center justify-between gap-3 rounded-lg px-3 py-1 text-lg text-text-main transition-colors duration-300 ease-in-out outline-none hover:bg-accent-primary hover:text-white dark:text-text-muted dark:hover:text-bg-canvas'

const contentClassName =
  'z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border-main bg-bg-panel p-1 shadow-app-soft'

const itemClassName =
  'relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-9 pr-8 text-sm text-text-main outline-none transition-colors data-[highlighted]:bg-accent-primary-soft data-[highlighted]:text-text-strong dark:text-text-main dark:data-[highlighted]:bg-accent-primary-soft dark:data-[highlighted]:text-text-strong'

const TOOLTIP_DICT = '词典'
const TOOLTIP_CHAPTER = '章节'
const REVIEW_MODE_LABEL = '复习'

const DictChapterButtonComponent = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const chapterIndexes = Array.from({ length: currentDictInfo.chapterCount }, (_, index) => index)
  const currentChapterLabel = `第 ${currentChapter + 1} 章`

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
          className="block rounded-lg px-3 py-1 text-lg text-text-main transition-colors duration-300 ease-in-out hover:bg-accent-primary hover:text-white focus:outline-none dark:text-text-muted dark:hover:text-bg-canvas"
          to="/gallery"
        >
          {currentDictInfo.name}
          {isReviewMode ? ` ${REVIEW_MODE_LABEL}` : ''}
        </NavLink>
      </Tooltip>

      {!isReviewMode && (
        <Select.Root value={String(currentChapter)} onValueChange={handleChapterChange}>
          <Tooltip content={TOOLTIP_CHAPTER}>
            <Select.Trigger className={triggerClassName} aria-label={TOOLTIP_CHAPTER}>
              <Select.Value>{currentChapterLabel}</Select.Value>
              <Select.Icon>
                <IconChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
          </Tooltip>

          <Select.Portal>
            <Select.Content position="popper" side="bottom" align="start" sideOffset={8} className={contentClassName}>
              <Select.Viewport className="max-h-72 p-1">
                {chapterIndexes.map((chapterIndex) => (
                  <Select.Item key={chapterIndex} value={String(chapterIndex)} className={itemClassName}>
                    <Select.ItemIndicator className="absolute left-3 inline-flex items-center text-accent-primary">
                      <IconCheck className="h-4 w-4" />
                    </Select.ItemIndicator>
                    <Select.ItemText>{`第 ${chapterIndex + 1} 章`}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      )}
    </>
  )
}

export const DictChapterButton = memo(DictChapterButtonComponent)

