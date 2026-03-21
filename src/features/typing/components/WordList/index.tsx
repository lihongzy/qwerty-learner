import { SimpleTooltip as Tooltip } from '@/shared/ui/tooltip'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/shared/state'
import { useAtomValue } from 'jotai'
import { useContext, useMemo, useState } from 'react'
import { Dialog, ScrollArea } from 'radix-ui'
import IconX from '~icons/tabler/x'
import ListIcon from '~icons/tabler/list'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { WordCard } from './WordCard'

const triggerClassName =
  'fixed left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-xl border border-l-0 border-indigo-100 bg-white/90 px-2.5 py-3 text-indigo-500 shadow-[0_12px_28px_rgba(79,70,229,0.12)] backdrop-blur-sm transition-colors duration-300 hover:bg-indigo-500 hover:text-white focus:outline-none dark:border-indigo-900/60 dark:bg-gray-900/90 dark:text-white dark:hover:bg-indigo-700'

const drawerContentClassName =
  'fixed left-0 top-0 z-50 flex h-full w-[min(34rem,88vw)] flex-col border-r border-stone-200 bg-stone-50 shadow-[0_24px_48px_rgba(15,23,42,0.18)] outline-none dark:border-gray-700 dark:bg-gray-900'

export const WordList = () => {
  const { state, dispatch } = useContext(TypingContext)!
  const [isOpen, setIsOpen] = useState(false)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentChapter = useAtomValue(currentChapterAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const currentDictTitle = useMemo(() => {
    if (isReviewMode) {
      return `${currentDictInfo.name} Review`
    }

    return `${currentDictInfo.name} Chapter ${currentChapter + 1}`
  }, [currentChapter, currentDictInfo.name, isReviewMode])

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
  }

  return (
    <>
      <Tooltip content="Word list" placement="top" className="!absolute left-5 top-1/2 z-20">
        <button type="button" onClick={openModal} className={triggerClassName}>
          <ListIcon className="h-6 w-6" />
        </button>
      </Tooltip>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" />

          <Dialog.Content className={drawerContentClassName}>
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-gray-700">
              <Dialog.Title className="text-lg font-semibold tracking-wide text-slate-800 dark:text-gray-50">
                {currentDictTitle}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-stone-200 hover:text-slate-700 dark:hover:bg-gray-800 dark:hover:text-white"
                  title="Close word list"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
              <ScrollArea.Viewport className="h-full w-full px-3 py-3">
                <div className="flex h-full w-full flex-col gap-1">
                  {state.chapterData.words?.map((word, index) => (
                    <WordCard key={`${word.name}_${index}`} word={word} isActive={state.chapterData.index === index} />
                  ))}
                </div>
              </ScrollArea.Viewport>

              <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical" />
            </ScrollArea.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}


