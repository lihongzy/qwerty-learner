import { Layout } from '@/app/layout/Layout';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import IconArrowLeft from '~icons/tabler/arrow-left';
import HeatmapCharts from './components/HeatmapCharts';
import { useWordStats } from './hooks/useWordStatus';
import { LineCharts } from './components/LineCharts';
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts';

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <span className="text-sm">
    <span className="text-muted-foreground">{label}：</span>
    <span className="font-mono font-semibold">{value}</span>
  </span>
);

const AnalysisPanel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-lg border p-5 ${className}`}>{children}</section>
);

const AnalysisPage = () => {
  const navigate = useNavigate();
  const onBack = useCallback(() => navigate('/'), [navigate]);

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } = useWordStats(
    dayjs().subtract(1, 'year').unix(),
    dayjs().unix(),
  );

  const summary = useMemo(() => {
    const totalSessions = exerciseRecord.reduce((acc, item) => acc + item.count, 0);
    const totalWords = wordRecord.reduce((acc, item) => acc + item.count, 0);
    const latestWpm = wpmRecord.length > 0 ? wpmRecord[wpmRecord.length - 1][1] : 0;
    const latestAccuracy = accuracyRecord.length > 0 ? accuracyRecord[accuracyRecord.length - 1][1] : 0;
    return { totalSessions, totalWords, latestWpm, latestAccuracy };
  }, [accuracyRecord, exerciseRecord, wordRecord, wpmRecord]);

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col overflow-y-auto px-4 pt-6 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">练习分析</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                从年度练习次数、词量变化、速度趋势和键位错误分布里，快速定位你的练习节奏与薄弱点。
              </p>
            </div>
            <Button variant="outline" onClick={onBack} className="self-start sm:self-auto">
              <IconArrowLeft />
              返回练习
            </Button>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <SummaryCard label="练习次数" value={`${summary.totalSessions}`} />
            <SummaryCard label="练习词量" value={`${summary.totalWords}`} />
            <SummaryCard label="最近 WPM" value={`${summary.latestWpm}`} />
            <SummaryCard label="最近正确率" value={`${summary.latestAccuracy}%`} />
          </div>

          <div className="min-h-0 flex-1 overflow-auto pb-4">
            {isEmpty ? (
              <section className="grid min-h-104 place-content-center rounded-xl border px-6 text-center">
                <div className="text-muted-foreground font-mono text-xs font-medium tracking-[0.26em] uppercase">
                  No Data Yet
                </div>
                <div className="mt-4 text-3xl font-semibold">暂无练习数据</div>
                <p className="text-muted-foreground mt-3 max-w-md text-sm">
                  先开始一轮练习。完成后这里会显示年度热力图、速度曲线和键位错误分析。
                </p>
              </section>
            ) : (
              <div className="grid gap-4 pb-4">
                <AnalysisPanel>
                  <HeatmapCharts title="过去一年练习次数热力图" data={exerciseRecord} />
                </AnalysisPanel>
                <AnalysisPanel>
                  <HeatmapCharts title="过去一年练习词量热力图" data={wordRecord} />
                </AnalysisPanel>
                <AnalysisPanel className="h-96">
                  <LineCharts title="过去一年 WPM 趋势" name="WPM" data={wpmRecord} />
                </AnalysisPanel>
                <AnalysisPanel className="h-96">
                  <LineCharts title="过去一年正确率趋势" name="正确率 (%)" data={accuracyRecord} suffix="%" />
                </AnalysisPanel>
                <AnalysisPanel className="h-112">
                  <KeyboardWithBarCharts title="按键错误次数分布" name="错误次数" data={wrongTimeRecord} />
                </AnalysisPanel>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisPage;
