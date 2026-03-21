import { Layout } from '@/components/Layout'
import dayjs from 'dayjs'
import { ScrollArea } from 'radix-ui'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import IconX from '~icons/tabler/x'
import HeatmapCharts from './components/HeatmapCharts'
import { useWordStats } from './hooks/useWordStatus'
import { LineCharts } from './components/LineCharts'
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } = useWordStats(
    dayjs().subtract(1, 'year').unix(),
    dayjs().unix(),
  )
  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col overflow-y-auto pt-20 pr-20 pl-20">
        <IconX className="absolute top-10 right-20 mr-2 h-7 w-7 cursor-pointer text-gray-400" onClick={onBack} />
        <ScrollArea.Root className="flex-1 overflow-y-auto">
          <ScrollArea.Viewport className="h-full w-full pb-10 [&>div]:!block">
            {isEmpty ? (
              <div className="align-items-center m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg shadow-lg dark:bg-gray-600">
                <div className="text-2xl text-gray-400">暂无练习数据</div>
              </div>
            ) : (
              <>
                <div className="dark:bg-opacity-50 mx-4 my-8 h-auto w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700">
                  <HeatmapCharts title="过去一年练习次数热力图" data={exerciseRecord} />
                </div>
                <div className="dark:bg-opacity-50 mx-4 my-8 h-auto w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700">
                  <HeatmapCharts title="过去一年练习词数热力图" data={wordRecord} />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts title="过去一年WPM趋势图" name="WPM" data={wpmRecord} />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts title="过去一年正确率趋势图" name="正确率(%)" data={accuracyRecord} suffix="%" />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <KeyboardWithBarCharts title="按键错误次数排行" name="错误次数" data={wrongTimeRecord} />
                </div>
              </>
            )}
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar className="flex touch-none bg-transparent select-none" orientation="vertical"></ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </Layout>
  )
}

export default AnalysisPage
