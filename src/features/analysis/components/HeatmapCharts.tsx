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
      <div className="mb-4 text-center text-xl font-bold text-gray-600 dark:text-white">{title}</div>
      <div className="flex w-full justify-center overflow-hidden rounded-2xl">
        <ActivityCalendar
          fontSize={calendarConfig.fontSize}
          blockSize={calendarConfig.blockSize}
          blockRadius={calendarConfig.blockRadius}
          style={{
            padding: calendarConfig.padding,
            color: isOpenDarkMode ? '#fff' : '#000',
          }}
          colorScheme={isOpenDarkMode ? 'dark' : 'light'}
          data={data}
          theme={{
            light: ['#f0f0f0', '#6366f1'],
            dark: ['hsl(0, 0%, 22%)', '#818cf8'],
          }}
          tooltips={{
            activity: {
              text: (activity) => `${activity.date} 练习 ${activity.count} 次`,
            },
          }}
          showWeekdayLabels={calendarConfig.showWeekdayLabels}
          labels={{
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
