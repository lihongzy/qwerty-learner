import clsx from 'clsx'
import { useContext, useEffect, useMemo, useState } from 'react'
import { TypingContext } from '@/features/typing/store'

export const Progress = ({ className }: { className?: string }) => {
  const { state } = useContext(TypingContext)!
  const [progress, setProgress] = useState(0)

  const totalWords = state.chapterData.words.length
  const currentIndex = state.chapterData.index

  useEffect(() => {
    if (totalWords === 0) {
      setProgress(0)
      return
    }

    const newProgress = Math.min(100, Math.max(0, Math.floor((currentIndex / totalWords) * 100)))
    setProgress(newProgress)
  }, [currentIndex, totalWords])

  const progressTone = useMemo(() => {
    if (progress >= 67) {
      return 'bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-cool))]'
    }

    if (progress >= 34) {
      return 'bg-[linear-gradient(90deg,var(--accent-primary),rgba(45,212,191,0.92))]'
    }

    return 'bg-[linear-gradient(90deg,rgba(13,148,136,0.72),rgba(45,212,191,0.72))]'
  }, [progress])

  return (
    <div className={clsx('relative w-full max-w-xs pt-1', className)}>
      <div className="mb-2 flex items-center justify-between gap-3 text-[0.72rem] font-medium text-[var(--text-muted)]">
        <span className="tracking-[0.16em] text-[var(--text-faint)]">PROGRESS</span>
        <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[var(--text-main)]">
          {totalWords === 0 ? '0/0' : `${Math.min(currentIndex + 1, totalWords)}/${totalWords}`}
        </span>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_58%)]" />
        <div
          style={{ width: `${progress}%` }}
          className={clsx('h-full rounded-full transition-[width] duration-300 ease-out', progressTone)}
        />
      </div>
    </div>
  )
}
