import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { isOpenDarkModeAtom } from '@/app/state/theme'
import { useWindowSize } from 'usehooks-ts'
import purple from './purple.json'
echarts.registerTheme('purple', purple)
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

interface LineChartsProps {
  title: string
  data: [string, number][]
  name: string
  suffix?: string
}
export const LineCharts = ({ data, title, suffix, name }:LineChartsProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  const { width, height } = useWindowSize()
 useEffect(() => {
    if (!chartRef.current || !data.length) return

    let chart = echarts.getInstanceByDom(chartRef.current)
    chart?.dispose()

    chart = echarts.init(chartRef.current, isOpenDarkMode ? 'purple' : 'light')

    const option = {
      tooltip: { trigger: 'axis' },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
      },
      xAxis: {
        type: 'time',
        axisPointer: {
          label: {
            formatter: function (params: { seriesData: [{ data: [string, number] }] }) {
              return params.seriesData[0].data[0]
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (value: number) => value + (suffix || '') },
      },
      series: [
        {
          name,
          type: 'line',
          smooth: true,
          data: data,
          emphasis: { focus: 'series' },
        },
      ],
    }

    chart.setOption(option)
  }, [data, title, suffix, name, isOpenDarkMode])

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.getInstanceByDom(chartRef.current)
    chart?.resize()
  }, [width, height, chartRef])

  return (
    <div className="flex h-full flex-col">
      <div className="text-center text-xl font-bold text-gray-600 dark:text-white">{title}</div>
      <div style={{ width: '100%', height: '100%' }} ref={chartRef} className="line-chart flex-grow"></div>
    </div>
  )
}
