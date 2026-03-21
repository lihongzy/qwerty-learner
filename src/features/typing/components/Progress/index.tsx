import clsx from 'clsx'
import { useContext, useEffect, useState } from 'react'
import { TypingContext } from '@/features/typing/store'

export const Progress = ({ className }: { className?: string }) => {
  const { state } = useContext(TypingContext)!
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const colorSwitcher: Record<number, string> = {
    0: 'bg-indigo-200',
    1: 'bg-indigo-300',
    2: 'bg-indigo-400',
  }

  useEffect(() => {
    const newProgress = Math.floor((state.chapterData.index / state.chapterData.words.length) * 100)
    setProgress(newProgress)
    setPhase(Math.floor(newProgress / 33.4))
  }, [state.chapterData.index, state.chapterData.words.length])

  return (
    <div className={clsx('relative w-1/4 pt-1', className)}>
      <div className="mb-4 flex h-2 overflow-hidden rounded-xl bg-indigo-100 text-xs transition-all duration-300">
        <div
          style={{ width: `${progress}%` }}
          className={clsx(
            'flex flex-col justify-center whitespace-nowrap rounded-xl text-center text-white shadow-none transition-all duration-300',
            colorSwitcher[phase] ?? 'bg-indigo-200',
          )}
        />
      </div>
    </div>
  )
}


