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
  'my-focus-ring fixed left-0 top-1/2 z-20 inline-flex -translate-y-1/2 items-center justify-center rounded-r-[var(--radius-md)] border border-l-0 border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] px-2.5 py-3 text-[var(--accent-primary)] shadow-[var(--shadow-soft)] backdrop-blur-md transition-colors duration-200 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-soft)] hover:text-[var(--text-strong)]'

const drawerContentClassName =
  'fixed left-0 top-0 z-50 flex h-full w-[min(36rem,90vw)] flex-col overflow-hidden border-r border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))] shadow-[var(--shadow-panel)] outline-none'

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
      <Tooltip content="单词列表" placement="top" className="!absolute left-5 top-1/2 z-20">
        <button type="button" onClick={openModal} className={triggerClassName}>
          <ListIcon className="h-6 w-6" />
        </button>
      </Tooltip>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[var(--bg-overlay)] backdrop-blur-sm" />

          <Dialog.Content className={drawerContentClassName}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_16%),radial-gradient(circle_at_top_right,rgba(103,232,249,0.1),transparent_26%)]" />

            <div className="relative flex items-center justify-between gap-4 border-b border-[var(--border-main)] px-5 py-4">
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--text-faint)]">WORD LIST</div>
                <Dialog.Title className="mt-1 truncate text-lg font-semibold tracking-tight text-[var(--text-strong)]">
                  {currentDictTitle}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={closeModal}
                  className="my-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-main)] bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--text-strong)]"
                  title="关闭单词列表"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative border-b border-[var(--border-soft)] px-5 py-3">
              <div className="flex items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
                <span>当前章节单词总览</span>
                <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[var(--text-main)]">
                  {state.chapterData.words?.length ?? 0}
                </span>
              </div>
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