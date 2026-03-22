import { useContext } from 'react'
import { TypingContext } from '@/features/typing/store'
import InfoBox from './InfoBox'

export default function Speed() {
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <div className="pointer-events-none mb-6 w-full max-w-5xl px-4">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))] px-3 py-3 shadow-[var(--shadow-panel)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.28)] to-transparent" />

        <div className="relative mb-3 flex items-center justify-between gap-4 px-2 pt-1">
          <div>
            <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--text-faint)]">LIVE METRICS</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">当前练习状态一览</div>
          </div>
          <div className="hidden rounded-full border border-[var(--border-soft)] bg-[var(--bg-ghost)] px-3 py-1 text-[0.72rem] font-medium text-[var(--text-muted)] sm:inline-flex">
            实时更新
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-2 md:grid-cols-5">
          <InfoBox info={`${minutesString}:${secondsString}`} description="时间" emphasis="primary" />
          <InfoBox info={`${inputNumber}`} description="输入数" />
          <InfoBox info={`${state.timerData.wpm}`} description="WPM" emphasis="accent" />
          <InfoBox info={`${state.chapterData.correctCount}`} description="正确数" />
          <InfoBox info={`${state.timerData.accuracy}%`} description="正确率" emphasis="success" />
        </div>
      </div>
    </div>
  )
}