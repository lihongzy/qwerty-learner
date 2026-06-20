import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/app/stores/theme';
import { useWindowSize } from 'usehooks-ts';
import purple from './purple.json';
echarts.registerTheme('purple', purple);
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

interface LineChartsProps {
  title: string;
  data: [string, number][];
  name: string;
  suffix?: string;
}

export const LineCharts = ({ data, title, suffix, name }: LineChartsProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const isOpenDarkMode = useThemeStore((s) => s.isOpenDarkMode);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!chartRef.current || !data.length) return;
    let chart = echarts.getInstanceByDom(chartRef.current);
    chart?.dispose();
    chart = echarts.init(chartRef.current, isOpenDarkMode ? 'purple' : 'light');

    chart.setOption({
      color: [isOpenDarkMode ? '#22d3ee' : '#0d9488'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: isOpenDarkMode ? 'rgba(9, 18, 24, 0.96)' : 'rgba(255, 255, 255, 0.98)',
        borderColor: isOpenDarkMode ? 'rgba(103, 232, 249, 0.16)' : 'rgba(18, 50, 58, 0.14)',
        textStyle: { color: isOpenDarkMode ? '#d7f4f7' : '#18323a' },
      },
      grid: { left: '8%', right: '4%', top: '14%', bottom: '12%' },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: isOpenDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(18, 50, 58, 0.12)' } },
        axisLabel: { color: isOpenDarkMode ? '#8aa7af' : '#607780' },
        axisPointer: {
          label: {
            color: isOpenDarkMode ? '#d7f4f7' : '#18323a',
            backgroundColor: isOpenDarkMode ? '#12313a' : '#d7f4f7',
            formatter: (params: { seriesData: [{ data: [string, number] }] }) => params.seriesData[0].data[0],
          },
        },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: isOpenDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(18, 50, 58, 0.08)' } },
        axisLabel: {
          color: isOpenDarkMode ? '#8aa7af' : '#607780',
          formatter: (value: number) => value + (suffix || ''),
        },
        axisLine: { show: false },
      },
      series: [
        {
          name,
          type: 'line',
          smooth: true,
          data,
          emphasis: { focus: 'series' },
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 3 },
          areaStyle: { color: isOpenDarkMode ? 'rgba(34,211,238,0.16)' : 'rgba(13,148,136,0.12)' },
        },
      ],
    });
  }, [data, title, suffix, name, isOpenDarkMode]);

  useEffect(() => {
    if (!chartRef.current) return;
    echarts.getInstanceByDom(chartRef.current)?.resize();
  }, [width, height]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <div className="text-xl font-semibold">{title}</div>
      </div>
      <div style={{ width: '100%', height: '100%' }} ref={chartRef} className="line-chart min-h-0 flex-grow" />
    </div>
  );
};
