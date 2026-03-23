import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/shared/state'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { useAtomValue } from 'jotai'
import { Dialog } from 'radix-ui'
import { useContext, useMemo, useState } from 'react'
import ListIcon from '~icons/tabler/list'
import IconX from '~icons/tabler/x'
import { WordCard } from './WordCard'

const triggerClassName =
  'inline-flex items-center justify-center rounded-r-app-md border border-l-0 border-border-main bg-bg-panel px-2.5 py-3 text-accent-primary shadow-app-soft transition-colors duration-200 hover:border-accent-primary hover:bg-accent-primary-soft hover:text-text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40'

const drawerContentClassName =
  'fixed left-0 top-0 z-50 flex h-full w-[min(36rem,90vw)] flex-col overflow-hidden border-r border-border-main bg-bg-panel-strong shadow-app-panel outline-none will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-700 data-[state=closed]:duration-400 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:ease-[cubic-bezier(0.4,0,1,1)] data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-6 data-[state=open]:slide-in-from-left-6'

export const WordList = () => {
  const { state, dispatch } = useContext(TypingContext)!
  const [isOpen, setIsOpen] = useState(false)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentChapter = useAtomValue(currentChapterAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const currentDictTitle = useMemo(() => {
    if (isReviewMode) {
      return `${currentDictInfo.name} · 复习词单`
    }

    return `${currentDictInfo.name} · 第 ${currentChapter + 1} 章`
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
      <div className="fixed left-0 top-1/2 z-20 -translate-y-1/2">
        <Tooltip content="单词列表" placement="right">
          <button type="button" onClick={openModal} className={triggerClassName}>
            <ListIcon className="h-6 w-6" />
          </button>
        </Tooltip>
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-bg-overlay will-change-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-600 data-[state=closed]:duration-300 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:ease-[cubic-bezier(0.4,0,1,1)] data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <Dialog.Content className={drawerContentClassName}>
            <div className="relative flex items-center justify-between gap-4 border-b border-border-main px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="truncate text-lg font-semibold tracking-tight text-text-strong">
                  {currentDictTitle}
                </Dialog.Title>
                <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                  <span>当前章节单词总览</span>
                  <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-text-main">
                    {state.chapterData.words?.length ?? 0}
                  </span>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-app-sm border border-border-main bg-bg-elevated text-text-muted transition-colors duration-150 hover:border-accent-primary hover:text-text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40"
                  title="关闭单词列表"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden px-3 py-3">
              <div className="h-full min-h-0 overflow-y-auto pr-2">
                <div className="flex w-full flex-col gap-2">
                  {state.chapterData.words?.map((word, index) => (
                    <WordCard key={`${word.name}_${index}`} word={word} isActive={state.chapterData.index === index} />
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
