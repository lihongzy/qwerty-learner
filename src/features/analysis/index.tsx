import { Layout } from '@/app/layout/Layout'
import dayjs from 'dayjs'
import { ScrollArea } from 'radix-ui'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import IconArrowLeft from '~icons/tabler/arrow-left'
import HeatmapCharts from './components/HeatmapCharts'
import { useWordStats } from './hooks/useWordStatus'
import { LineCharts } from './components/LineCharts'
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts'

type SummaryCardProps = {
  label: string
  value: string
  helper: string
}

const SummaryCard = ({ label, value, helper }: SummaryCardProps) => (
  <section className="my-panel relative overflow-hidden px-5 py-4">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.12),transparent_32%)]" />
    <div className="relative">
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">{label}</div>
      <div className="mt-3 font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[2rem] font-semibold tracking-tight text-[var(--text-strong)]">
        {value}
      </div>
      <div className="mt-2 text-sm text-[var(--text-muted)]">{helper}</div>
    </div>
  </section>
)

const AnalysisPanel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`my-panel relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 ${className}`}>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_24%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_16%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_24%)]" />
    <div className="relative h-full">{children}</div>
  </section>
)

const AnalysisPage = () => {
  const navigate = useNavigate()
  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } = useWordStats(
    dayjs().subtract(1, 'year').unix(),
    dayjs().unix(),
  )

  const summary = useMemo(() => {
    const totalSessions = exerciseRecord.reduce((acc, item) => acc + item.count, 0)
    const totalWords = wordRecord.reduce((acc, item) => acc + item.count, 0)
    const latestWpm = wpmRecord.length > 0 ? wpmRecord[wpmRecord.length - 1][1] : 0
    const latestAccuracy = accuracyRecord.length > 0 ? accuracyRecord[accuracyRecord.length - 1][1] : 0

    return {
      totalSessions,
      totalWords,
      latestWpm,
      latestAccuracy,
    }
  }, [accuracyRecord, exerciseRecord, wordRecord, wpmRecord])

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[var(--text-faint)]">
                Progress Review
              </span>
              <div>
                <h1 className="text-[2rem] font-semibold tracking-tight text-[var(--text-strong)] sm:text-[2.35rem]">练习分析</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-[0.95rem]">
                  从年度练习次数、词量变化、速度趋势和键位错误分布里，快速定位你的练习节奏与薄弱点。
                </p>
              </div>
            </div>

            <button type="button" className="my-btn-secondary my-focus-ring inline-flex gap-2 self-start px-4 sm:self-auto" onClick={onBack}>
              <IconArrowLeft className="h-4.5 w-4.5" />
              返回练习
            </button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="练习次数" value={`${summary.totalSessions}`} helper="过去一年累计开始的练习轮次" />
            <SummaryCard label="练习词量" value={`${summary.totalWords}`} helper="过去一年输入完成的词条总数" />
            <SummaryCard label="最近 WPM" value={`${summary.latestWpm}`} helper="最新记录的瞬时速度表现" />
            <SummaryCard label="最近正确率" value={`${summary.latestAccuracy}%`} helper="最近一次完成章节时的准确率" />
          </div>

          <ScrollArea.Root className="flex-1 overflow-y-auto">
            <ScrollArea.Viewport className="h-full w-full pb-4 [&>div]:!block">
              {isEmpty ? (
                <section className="my-panel-strong grid min-h-[26rem] place-content-center px-6 text-center">
                  <div className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.72rem] font-medium uppercase tracking-[0.26em] text-[var(--text-faint)]">
                    No Data Yet
                  </div>
                  <div className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">暂无练习数据</div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                    先开始一轮练习。完成后这里会显示年度热力图、速度曲线和键位错误分析。
                  </p>
                </section>
              ) : (
                <div className="grid gap-4 pb-4 xl:grid-cols-2">
                  <AnalysisPanel>
                    <HeatmapCharts title="过去一年练习次数热力图" data={exerciseRecord} />
                  </AnalysisPanel>
                  <AnalysisPanel>
                    <HeatmapCharts title="过去一年练习词量热力图" data={wordRecord} />
                  </AnalysisPanel>
                  <AnalysisPanel className="h-[24rem]">
                    <LineCharts title="过去一年 WPM 趋势" name="WPM" data={wpmRecord} />
                  </AnalysisPanel>
                  <AnalysisPanel className="h-[24rem]">
                    <LineCharts title="过去一年正确率趋势" name="正确率 (%)" data={accuracyRecord} suffix="%" />
                  </AnalysisPanel>
                  <AnalysisPanel className="h-[28rem] xl:col-span-2">
                    <KeyboardWithBarCharts title="按键错误次数分布" name="错误次数" data={wrongTimeRecord} />
                  </AnalysisPanel>
                </div>
              )}
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical" />
          </ScrollArea.Root>
        </div>
      </div>
    </Layout>
  )
}

export default AnalysisPage
