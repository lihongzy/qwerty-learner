import { isOpenDarkModeAtom } from '@/app/state/theme'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import type { Activity, DayName } from 'react-activity-calendar'
import { ActivityCalendar } from 'react-activity-calendar'
import { useWindowSize } from 'usehooks-ts'

interface HeatmapChartsProps {
  title: string
  data: Activity[]
}

type CalendarConfig = {
  blockSize: number
  blockRadius: number
  fontSize: number
  padding: string
  showWeekdayLabels: boolean | DayName[]
}

export default function HeatmapCharts({ data, title }: HeatmapChartsProps) {
  const isOpenDarkMode = useAtomValue(isOpenDarkModeAtom)
  const { width = 0 } = useWindowSize()

  const calendarConfig = useMemo<CalendarConfig>(() => {
    if (width < 768) {
      return {
        blockSize: 11,
        blockRadius: 3,
        fontSize: 11,
        padding: '16px 8px 8px 8px',
        showWeekdayLabels: false,
      }
    }

    if (width < 1280) {
      return {
        blockSize: 14,
        blockRadius: 4,
        fontSize: 13,
        padding: '20px 12px 12px 12px',
        showWeekdayLabels: ['mon', 'wed', 'fri'],
      }
    }

    return {
      blockSize: 16,
      blockRadius: 5,
      fontSize: 14,
      padding: '24px 16px 12px 16px',
      showWeekdayLabels: true,
    }
  }, [width])

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden">
      <div className="mb-4 flex w-full items-start justify-between gap-4">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">Heatmap</div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-strong)]">{title}</div>
        </div>
      </div>

      <div className="flex w-full justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-ghost)]">
        <ActivityCalendar
          fontSize={calendarConfig.fontSize}
          blockSize={calendarConfig.blockSize}
          blockRadius={calendarConfig.blockRadius}
          style={{
            padding: calendarConfig.padding,
            color: isOpenDarkMode ? '#d7f4f7' : '#18323a',
          }}
          colorScheme={isOpenDarkMode ? 'dark' : 'light'}
          data={data}
          theme={{
            light: ['#dcefed', '#0d9488'],
            dark: ['rgba(255,255,255,0.06)', '#22d3ee'],
          }}
          tooltips={{
            activity: {
              text: (activity) => `${activity.date} 练习 ${activity.count} 次`,
            },
          }}
          showWeekdayLabels={calendarConfig.showWeekdayLabels}
          labels={{
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekdays: ['日', '一', '二', '三', '四', '五', '六'],
            totalCount: '过去一年总计 {{count}} 次',
            legend: {
              less: '少',
              more: '多',
            },
          }}
        />
      </div>
    </div>
  )
}
