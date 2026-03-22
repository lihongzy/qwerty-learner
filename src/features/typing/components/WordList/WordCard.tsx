import type { WordPronunciationIconRef } from '@/shared/components/WordPronunciationIcon'
import { WordPronunciationIcon } from '@/shared/components/WordPronunciationIcon'
import { currentDictInfoAtom } from '@/shared/state'
import type { Word } from '@/shared/types'
import { useAtomValue } from 'jotai'
import { useCallback, useRef } from 'react'

type WordCardProps = {
  word: Word
  isActive: boolean
}

export const WordCard = ({ word, isActive }: WordCardProps) => {
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)
  const currentLanguage = useAtomValue(currentDictInfoAtom).language

  const handlePlay = useCallback(() => {
    wordPronunciationIconRef.current?.play()
  }, [])

  return (
    <div
      className={`my-focus-ring group flex cursor-pointer select-text items-center gap-4 rounded-[var(--radius-md)] border px-4 py-3 transition-colors duration-150 ${
        isActive
          ? 'border-[var(--accent-primary)] bg-[linear-gradient(180deg,var(--accent-primary-soft),var(--bg-panel))] shadow-[0_12px_28px_rgba(13,148,136,0.08)]'
          : 'border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] hover:border-[var(--accent-primary)] hover:bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))]'
      }`}
      onClick={handlePlay}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--text-faint)]">WORD</div>
        <p className="mt-1 select-all font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] leading-6 text-[var(--text-strong)]">
          {['romaji', 'hapin'].includes(currentLanguage) ? word.notation : word.name}
        </p>
        <div className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">{word.trans.join('；')}</div>
      </div>

      <div className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--bg-ghost)] p-1 text-[var(--text-muted)] transition-colors duration-150 group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)]">
        <WordPronunciationIcon word={word} lang={currentLanguage} className="h-8 w-8" ref={wordPronunciationIconRef} />
      </div>
    </div>
  )
}