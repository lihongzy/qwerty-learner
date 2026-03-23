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
    <div className="pointer-events-none mb-4 w-full max-w-5xl px-4">
      <div className="relative border-t border-border-soft pt-2">
        <div className="mb-2 flex items-center justify-between gap-4 text-[11px] font-medium text-text-muted">
          <div className="tracking-[0.18em] text-text-faint">LIVE METRICS</div>
          <div className="hidden sm:inline-flex">实时更新</div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-5">
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
