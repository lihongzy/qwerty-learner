import { flip, offset, shift, useFloating, useHover, useInteractions, useRole } from '@floating-ui/react'
import { useCallback, useState } from 'react'
import type { WordWithIndex } from '@/shared/types'
import { usePronunciationSound } from '../../hooks/usePronunciation'

export default function WordChip({ word }: { word: WordWithIndex }) {
  const [showTranslation, setShowTranslation] = useState(false)
  const { x, y, strategy, refs, context } = useFloating({
    open: showTranslation,
    onOpenChange: setShowTranslation,
    middleware: [offset(4), shift(), flip()],
  })
  const hover = useHover(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role])
  const { play, stop } = usePronunciationSound(word.name, false)

  const onClickWord = useCallback(() => {
    stop()
    play()
  }, [play, stop])

  return (
    <>
      <button
        ref={refs.setReference}
        className="flex h-10 w-auto cursor-pointer select-all flex-row items-center justify-center rounded-xl border border-[rgba(200,104,43,0.26)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,241,232,0.92))] px-2 py-0.5 shadow-[var(--app-shadow-soft)] transition-all duration-150 hover:-translate-y-px hover:border-[rgba(200,104,43,0.42)] hover:bg-[linear-gradient(180deg,rgba(255,247,240,0.98),rgba(244,227,208,0.94))] dark:border-[rgba(255,225,189,0.14)] dark:bg-[linear-gradient(180deg,rgba(35,45,60,0.92),rgba(23,30,39,0.96))] dark:hover:border-[rgba(227,140,79,0.34)] dark:hover:bg-[linear-gradient(180deg,rgba(44,57,75,0.98),rgba(28,36,48,1))] md:h-12 md:px-5 md:py-1"
        {...getReferenceProps()}
        type="button"
        onClick={onClickWord}
        title={`朗读 ${word.name}`}
      >
        <span className="font-mono text-2xl font-light text-[var(--app-text)] dark:text-[#f3eadf] md:text-3xl">
          {word.name}
        </span>
      </button>
      {showTranslation && (
        <div
          ref={refs.setFloating}
          className="pointer-events-none flex items-center justify-center whitespace-nowrap rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-2.5 py-1.5 text-xs text-[var(--app-text-muted)] shadow-md backdrop-blur-[16px]"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          {...getFloatingProps()}
        >
          {word.trans}
        </div>
      )}
    </>
  )
}
