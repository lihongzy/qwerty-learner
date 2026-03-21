import { useContext } from 'react'
import { TypingContext } from '@/pages/Typing/store'
import InfoBox from './InfoBox'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <div className="pointer-events-none mb-6 w-full max-w-5xl px-4">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1118]/72 px-3 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)] before:content-['']">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          <InfoBox info={`${minutesString}:${secondsString}`} description="时间" />
          <InfoBox info={inputNumber + ''} description="输入数" />
          <InfoBox info={state.timerData.wpm + ''} description="WPM" />
          <InfoBox info={state.chapterData.correctCount + ''} description="正确数" />
          <InfoBox info={state.timerData.accuracy + '%'} description="正确率" />
        </div>
      </div>
    </div>
  )
}


