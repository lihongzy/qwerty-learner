import { useChapterStats } from './hooks/useChapterStats'
import clsx from 'clsx'
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import IconCheckCircle from '~icons/heroicons/check-circle-solid'

export default function Chapter({
  index,
  checked,
  dictID,
  onChange,
  scrollContainerRef,
}: {
  index: number
  checked: boolean
  dictID: string
  onChange: (index: number) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({})
  const isVisible = !!isIntersecting
  const chapterStatus = useChapterStats(index, dictID, isVisible)

  useEffect(() => {
    if (!checked || ref.current === null || scrollContainerRef.current === null) {
      return
    }

    const button = ref.current
    const container = scrollContainerRef.current
    const scrollTop = Math.max(button.offsetTop - container.offsetTop - 24, 0)

    container.scroll({
      top: scrollTop,
      behavior: 'smooth',
    })
  }, [checked, scrollContainerRef])

  return (
    <button
      type="button"
      tabIndex={-1}
      ref={(node) => {
        ref.current = node
        intersectionRef(node)
      }}
      className={clsx(
        'my-focus-ring rounded-app-md relative flex h-[5rem] w-full cursor-pointer flex-col justify-center overflow-hidden border px-4 py-3 transition-colors duration-150 sm:w-auto',
        checked ? 'border-accent-primary bg-accent-primary-soft' : 'border-border-main bg-bg-panel hover:border-accent-primary',
      )}
      onClick={() => onChange(index)}
    >
      <div className="text-text-strong mt-1 text-left text-sm font-semibold">第 {index + 1} 章</div>

      <p className="text-text-muted relative pt-1 text-left text-xs">
        {chapterStatus ? (chapterStatus.exerciseCount > 0 ? `已练习 ${chapterStatus.exerciseCount} 次` : '尚未练习') : '加载中...'}
      </p>
      {checked && <IconCheckCircle className="text-accent-primary absolute top-3 right-3 h-4.5 w-4.5" />}
    </button>
  )
}
