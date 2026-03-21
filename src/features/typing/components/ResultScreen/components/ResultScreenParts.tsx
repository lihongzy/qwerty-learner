import { flip, offset, shift, useFloating, useHover, useInteractions, useRole } from '@floating-ui/react'
import clsx from 'clsx'
import { useCallback, useMemo, useState } from 'react'
import type { ElementType, ReactNode, SVGAttributes } from 'react'
import { Avatar } from 'radix-ui'
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle-solid'
import IconHandThumbUp from '~icons/heroicons/hand-thumb-up-solid'
import IconHeart from '~icons/heroicons/heart-solid'
import laity from '@/assets/laity.png'
import type { WordWithIndex } from '@/shared/types'
import clamp from '@/shared/utils'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { usePronunciationSound } from '../../../hooks/usePronunciation'

export type ConclusionBarProps = {
  mistakeLevel: number
  mistakeCount: number
}

export type RemarkRingProps = {
  remark: string
  caption: string
  percentage?: number | null
}

type ResultScreenIconButtonProps = {
  title: string
  icon: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

type ConclusionConfig = {
  icon: ElementType<SVGAttributes<SVGSVGElement>>
  iconClassName: string
  panelClassName: string
  title: string
  description: (mistakeCount: number) => string
}

const resultScreenIconButtonClassName =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white'

const conclusionConfig: ConclusionConfig[] = [
  {
    icon: IconHeart,
    iconClassName: 'text-emerald-500',
    panelClassName:
      'border-emerald-200/80 bg-[linear-gradient(90deg,rgba(236,253,245,0.98),rgba(220,252,231,0.86))] dark:border-emerald-500/20 dark:bg-[linear-gradient(90deg,rgba(6,78,59,0.24),rgba(6,16,30,0.96))]',
    title: '表现稳定',
    description: (mistakeCount) =>
      mistakeCount > 0 ? `这一章只错了 ${mistakeCount} 个单词，整体节奏和准确率都很稳。` : '这一章没有出现错误，可以直接进入下一章。',
  },
  {
    icon: IconHandThumbUp,
    iconClassName: 'text-cyan-500',
    panelClassName:
      'border-cyan-200/80 bg-[linear-gradient(90deg,rgba(224,242,254,0.98),rgba(186,230,253,0.82))] dark:border-cyan-500/20 dark:bg-[linear-gradient(90deg,rgba(8,47,73,0.24),rgba(6,16,30,0.96))]',
    title: '继续巩固',
    description: () => '有少量错误，建议再练一轮，把拼写和节奏彻底压稳。',
  },
  {
    icon: IconExclamationTriangle,
    iconClassName: 'text-amber-500',
    panelClassName:
      'border-amber-200/80 bg-[linear-gradient(90deg,rgba(255,247,237,0.98),rgba(254,215,170,0.84))] dark:border-amber-500/20 dark:bg-[linear-gradient(90deg,rgba(120,53,15,0.24),rgba(6,16,30,0.96))]',
    title: '建议重练',
    description: () => '本章错误偏多，先重练一次再进下一章会更稳。',
  },
]

export function AuthorButton() {
  const handleOpenAuthorPage = useCallback(() => {
    window.open('https://github.com/lihongzy', '_blank')
  }, [])

  return (
    <Tooltip content="查看作者主页和更多项目">
      <button type="button" className="rounded-full" onClick={handleOpenAuthorPage}>
        <Avatar.Root className="relative flex h-7.5 w-7.5 shrink-0 overflow-hidden rounded-full shadow-md">
          <Avatar.Image className="aspect-square h-full w-full" src={laity} alt="Laity Homepage" />
          <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Laity
          </Avatar.Fallback>
        </Avatar.Root>
      </button>
    </Tooltip>
  )
}

export function ConclusionBar({ mistakeLevel, mistakeCount }: ConclusionBarProps) {
  const { icon: Icon, iconClassName, panelClassName, title, description } = conclusionConfig[mistakeLevel]

  return (
    <div className={clsx('flex items-center gap-3 rounded-[1rem] border px-3.5 py-2.5', panelClassName)}>
      <div className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 dark:bg-slate-950/45', iconClassName)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Session Note
        </div>
        <div className="mt-1 text-[0.92rem] font-medium leading-5 text-slate-800 dark:text-slate-100">{title}</div>
        <div className="text-[0.88rem] leading-5 text-slate-600 dark:text-slate-300">{description(mistakeCount)}</div>
      </div>
    </div>
  )
}

export function RemarkRing({ remark, caption, percentage = null }: RemarkRingProps) {
  const clipPath = useMemo((): string | undefined => {
    if (percentage === null || typeof window === 'undefined') {
      return undefined
    }

    const clamped = clamp(percentage, 0, 100)
    if (clamped === 100) {
      return undefined
    }

    const rootFontSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'))
    const radius = (rootFontSize * 4.9) / 2
    const alpha = Math.PI * 2 * (clamped / 100)
    const path = `M ${radius},0 A ${radius},${radius} 0 ${clamped > 50 ? 1 : 0},1 ${radius + Math.sin(alpha) * radius},${radius + -Math.cos(alpha) * radius} L ${radius},${radius} Z`

    return `path("${path}")`
  }, [percentage])

  return (
    <div className="relative flex min-h-[8.5rem] flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,250,0.96))] px-2.5 py-3 shadow-[0_12px_24px_rgba(148,163,184,0.12)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(8,15,26,0.96),rgba(4,9,18,0.98))] dark:shadow-[0_14px_28px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.45),transparent_22%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_22%)]" />

      <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[7px] border-slate-200 dark:border-slate-800" />
        {percentage !== null && (
          <div
            className="absolute inset-0 rounded-full border-[7px] border-cyan-500 dark:border-cyan-400"
            style={{ clipPath }}
            aria-hidden
          />
        )}
        <span className="text-[0.95rem] font-semibold tracking-tight text-slate-950 dark:text-white">{remark}</span>
      </div>

      <div className="mt-2.5 text-center">
        <div className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
          {caption}
        </div>
      </div>
    </div>
  )
}

export function ResultScreenIconButton({ title, icon, className = '', onClick, href }: ResultScreenIconButtonProps) {
  if (href) {
    return (
      <Tooltip content={title}>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`${resultScreenIconButtonClassName} ${className}`}
        >
          {icon}
        </a>
      </Tooltip>
    )
  }

  return (
    <Tooltip content={title}>
      <button type="button" className={`${resultScreenIconButtonClassName} ${className}`} onClick={onClick}>
        {icon}
      </button>
    </Tooltip>
  )
}

export function WordChip({ word }: { word: WordWithIndex }) {
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
        className="inline-flex h-10 w-fit max-w-full shrink-0 cursor-pointer select-all items-center justify-center rounded-xl border border-amber-300/50 bg-gradient-to-b from-white to-amber-50 px-3 py-0.5 shadow-sm shadow-slate-200/70 transition-all duration-150 hover:-translate-y-px hover:border-amber-400/70 hover:from-amber-50 hover:to-orange-100 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 dark:shadow-black/20 dark:hover:border-amber-500/40 dark:hover:from-slate-700 dark:hover:to-slate-800 md:h-11 md:px-4"
        {...getReferenceProps()}
        type="button"
        onClick={onClickWord}
        title={`朗读 ${word.name}`}
      >
        <span className="whitespace-nowrap font-mono text-[1.7rem] font-light leading-none text-slate-900 dark:text-slate-100 md:text-[2rem]">
          {word.name}
        </span>
      </button>
      {showTranslation && (
        <div
          ref={refs.setFloating}
          className="pointer-events-none flex max-w-xs items-center justify-center rounded-xl border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs text-slate-600 shadow-md backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-300"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          {...getFloatingProps()}
        >
          <span className="break-words whitespace-normal">{word.trans}</span>
        </div>
      )}
    </>
  )
}
