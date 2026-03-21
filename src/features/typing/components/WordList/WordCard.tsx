import type { WordPronunciationIconRef } from '@/components/WordPronunciationIcon'
import { WordPronunciationIcon } from '@/components/WordPronunciationIcon'
import { currentDictInfoAtom } from '@/store'
import type { Word } from '@/typings'
import { useAtomValue } from 'jotai'
import { useCallback, useRef } from 'react'

type WordCardProps = {
  word: Word
  isActive: boolean
}

export const WordCard = ({ word, isActive }: WordCardProps) => {
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)
  const currentLanguage = useAtomValue(currentDictInfoAtom).language

  // 点击整张卡片时，复用发音图标暴露出来的播放能力。
  const handlePlay = useCallback(() => {
    wordPronunciationIconRef.current?.play()
  }, [])

  return (
    <div
      className={`mb-2 flex cursor-pointer select-text items-center rounded-xl p-4 shadow focus:outline-none ${
        isActive ? 'bg-indigo-50 dark:bg-indigo-800 dark:bg-opacity-20' : 'bg-white dark:bg-gray-700 dark:bg-opacity-20'
      }`}
      onClick={handlePlay}
    >
      {/* 左侧展示单词和释义，当前语言为音标/假名类时优先展示 notation。 */}
      <div className="flex-1">
        <p className="select-all font-mono text-xl font-normal leading-6 dark:text-gray-50">
          {['romaji', 'hapin'].includes(currentLanguage) ? word.notation : word.name}
        </p>
        <div className="mt-2 max-w-sm font-sans text-sm text-gray-400">{word.trans.join('；')}</div>
      </div>

      {/* 右侧图标既可单独点击播放，也支持外层卡片统一触发。 */}
      <WordPronunciationIcon word={word} lang={currentLanguage} className="h-8 w-8" ref={wordPronunciationIconRef} />
    </div>
  )
}
