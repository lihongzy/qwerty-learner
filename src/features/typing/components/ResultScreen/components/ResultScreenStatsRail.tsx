import { RESULT_SCREEN_COPY } from '../copy'
import { RemarkRing } from './ResultScreenParts'

type ResultScreenStatsRailProps = {
  accuracy: number
  timeString: string
  wpm: number
}

export function ResultScreenStatsRail({ accuracy, timeString, wpm }: ResultScreenStatsRailProps) {
  return (
    <aside className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:grid-rows-3">
      <RemarkRing remark={`${accuracy}%`} caption={RESULT_SCREEN_COPY.metricAccuracy} percentage={accuracy} />
      <RemarkRing remark={timeString} caption={RESULT_SCREEN_COPY.metricTime} />
      <RemarkRing remark={`${wpm}`} caption={RESULT_SCREEN_COPY.metricWpm} />
    </aside>
  )
}
