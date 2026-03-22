import { useChapterStats } from './hooks/useChapterStats'
import { useEffect, useRef } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import IconCheckCircle from '~icons/heroicons/check-circle-solid'

export default function Chapter({
  index,
  checked,
  dictID,
  onChange,
}: {
  index: number
  checked: boolean
  dictID: string
  onChange: (index: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({})
  const isVisible = !!isIntersecting
  const chapterStatus = useChapterStats(index, dictID, isVisible)

  useEffect(() => {
    if (!checked || ref.current === null) {
      return
    }

    const button = ref.current
    const container = button.parentElement?.parentElement?.parentElement

    if (container === null || container === undefined) {
      return
    }

    container.scroll({
      top: button.offsetTop - container.offsetTop - 200,
      behavior: 'smooth',
    })
  }, [checked])

  return (
    <div
      ref={(node) => {
        ref.current = node
        intersectionRef(node)
      }}
      className={`my-focus-ring group relative flex h-[5.2rem] w-full cursor-pointer flex-col justify-center overflow-hidden rounded-[var(--radius-md)] border px-4 py-3 transition-colors duration-150 sm:w-auto ${
        checked
          ? 'border-[var(--accent-primary)] bg-[linear-gradient(180deg,var(--accent-primary-soft),var(--bg-panel))] shadow-[0_14px_28px_rgba(13,148,136,0.12)]'
          : 'border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-elevated))] hover:border-[var(--accent-primary)] hover:bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))]'
      }`}
      onClick={() => onChange(index)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_36%)] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="relative">
        <div className="text-[0.66rem] font-semibold tracking-[0.12em] text-[var(--text-faint)]">开始练习</div>
        <h1 className="mt-1 text-sm font-semibold text-[var(--text-strong)]">第 {index + 1} 章</h1>
      </div>
      <p className="relative pt-1 text-xs text-[var(--text-muted)]">
        {chapterStatus ? (chapterStatus.exerciseCount > 0 ? `已练习 ${chapterStatus.exerciseCount} 次` : '尚未练习') : '加载中...'}
      </p>
      {checked && <IconCheckCircle className="absolute -bottom-3 -right-3 h-12 w-12 text-[var(--accent-primary)] opacity-28" />}
    </div>
  )
}
