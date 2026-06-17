import clsx from 'clsx'
import { useContext } from 'react'
import { TypingContext } from '@/pages/typing/store'

export const Progress = ({ className }: { className?: string }) => {
  const { state } = useContext(TypingContext)!

  const totalWords = state.chapterData.words.length
  const currentIndex = state.chapterData.index
  const progress = totalWords === 0 ? 0 : Math.min(100, Math.max(0, Math.floor(((currentIndex + 1) / totalWords) * 100)))

  return (
    <div className={clsx('relative w-full max-w-sm px-4', className)}>
      <div className="text-text-muted mb-1.5 text-right text-xs">
        {totalWords === 0 ? '0/0' : `${Math.min(currentIndex + 1, totalWords)}/${totalWords}`}
      </div>

      <div className="bg-bg-elevated relative h-1.5 overflow-hidden rounded-full">
        <div
          style={{ width: `${progress}%` }}
          className={clsx('bg-accent-primary h-full rounded-full transition-[width] duration-300 ease-out', progress < 34 && 'opacity-70')}
        />
      </div>
    </div>
  )
}
