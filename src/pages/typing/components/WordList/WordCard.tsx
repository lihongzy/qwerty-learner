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
      className={`group flex cursor-pointer select-text items-center gap-4 rounded-app-md border px-4 py-3 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40 ${
        isActive
          ? 'border-accent-primary bg-accent-primary-soft shadow-app-soft'
          : 'border-border-main bg-bg-panel hover:border-accent-primary hover:bg-bg-panel-strong'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="select-all font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] leading-6 text-text-strong">
          {['romaji', 'hapin'].includes(currentLanguage) ? word.notation || word.name : word.name}
        </p>
        <div className="mt-2 max-w-xl text-sm leading-6 text-text-muted">{word.trans.join('；')}</div>
      </div>

      <button
        type="button"
        onClick={handlePlay}
        className="shrink-0 p-1 text-text-muted transition-colors duration-150 hover:text-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40"
        aria-label={`播放 ${word.name} 发音`}
      >
        <WordPronunciationIcon word={word} lang={currentLanguage} className="h-8 w-8" ref={wordPronunciationIconRef} />
      </button>
    </div>
  )
}
