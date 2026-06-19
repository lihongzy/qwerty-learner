import Keyboard from './keyboard';
import purple from './purple.json';
import { useThemeStore } from '@/app/stores/theme';
import { BarChart, MapChart } from 'echarts/charts';
import { GeoComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';
import { useWindowSize } from 'usehooks-ts';

echarts.use([
  BarChart,
  CanvasRenderer,
  GeoComponent,
  MapChart,
  ToolboxComponent,
  TooltipComponent,
  UniversalTransition,
  VisualMapComponent,
]);
echarts.registerTheme('purple', purple);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
echarts.registerMap('Keyboard', Keyboard as any);

const keyboardData = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').map((name) => ({ name, value: 0 }));

interface Props {
  title: string;
  data: { name: string; value: number }[];
  name: string;
  suffix?: string;
}

const KeyboardWithBarCharts = ({ data, title, suffix, name }: Props) => {
  const isOpenDarkMode = useThemeStore((s) => s.isOpenDarkMode);
  const chartRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const myData = keyboardData
      .map((item) => ({ ...item, value: data.find((e) => e.name === item.name)?.value || 0 }))
      .sort((a, b) => b.value - a.value);

    let chart = echarts.getInstanceByDom(chartRef.current);
    chart?.dispose();
    chart = echarts.init(chartRef.current, isOpenDarkMode ? 'purple' : 'light');

    const tooltipBase = {
      backgroundColor: isOpenDarkMode ? 'rgba(9, 18, 24, 0.96)' : 'rgba(255, 255, 255, 0.98)',
      borderColor: isOpenDarkMode ? 'rgba(103, 232, 249, 0.16)' : 'rgba(18, 50, 58, 0.14)',
      textStyle: { color: isOpenDarkMode ? '#d7f4f7' : '#18323a' },
    };

    const mapOption = {
      tooltip: { trigger: 'item', showDelay: 0, transitionDuration: 0.2, ...tooltipBase },
      toolbox: {
        feature: {
          myToBarChart: {
            show: true,
            title: '切换为柱状图',
            icon: 'path://M896 928 768 928C732.656 928 704 899.344 704 864L704 416C704 380.656 732.656 352 768 352L896 352C931.344 352 960 380.656 960 416L960 864C960 899.344 931.344 928 896 928ZM896 416 768 416 768 864 896 864 896 416ZM576 928 448 928C412.656 928 384 899.344 384 864L384 160C384 124.656 412.656 96 448 96L576 96C611.344 96 640 124.656 640 160L640 864C640 899.344 611.344 928 576 928ZM576 160 448 160 448 864 576 864 576 160ZM256 928 128 928C92.656 928 64 899.344 64 864L64 544C64 508.656 92.656 480 128 480L256 480C291.344 480 320 508.656 320 544L320 864C320 899.344 291.344 928 256 928ZM256 544 128 544 128 864 256 864 256 544Z',
            onclick: () => chart?.setOption(barOption, true),
          },
        },
      },
      visualMap: {
        left: 'right',
        min: 0,
        max: myData[0].value,
        inRange: { color: isOpenDarkMode ? ['rgba(255,255,255,0.08)', '#22d3ee'] : ['#dcefed', '#0d9488'] },
        text: ['高', '低'],
        textStyle: { color: isOpenDarkMode ? '#d7f4f7' : '#18323a' },
        calculable: false,
        handleStyle: { display: 'none' },
      },
      series: [
        {
          name,
          id: 'population',
          type: 'map',
          roam: false,
          zoom: 1,
          map: 'Keyboard',
          animationDurationUpdate: 1000,
          universalTransition: true,
          data: myData,
          label: { show: true, color: isOpenDarkMode ? '#d7f4f7' : '#18323a' },
          emphasis: { disabled: true },
        },
      ],
    };

    const barOption = {
      tooltip: { trigger: 'axis', ...tooltipBase },
      toolbox: {
        feature: {
          myToKeyboard: {
            show: true,
            title: '切换为键盘热力图',
            icon: 'path://M192 448h64v64H192zM384 448h64v64h-64zM576 448h64v64h-64zM768 448h64v64h-64zM192 320h64v64H192zM384 320h64v64h-64zM576 320h64v64h-64zM768 320h64v64h-64zM256 640h512v64H256z M1024 864H0V256h64v544h896V224H0V160h1024v704z',
            onclick: () => chart?.setOption(mapOption, true),
          },
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: isOpenDarkMode ? '#8aa7af' : '#607780',
          formatter: (value: number) => `${value}${suffix || ''}`,
        },
        splitLine: { lineStyle: { color: isOpenDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(18, 50, 58, 0.08)' } },
      },
      xAxis: {
        type: 'category',
        axisLabel: { rotate: 30, color: isOpenDarkMode ? '#8aa7af' : '#607780' },
        data: myData.map((item) => item.name),
      },
      animationDurationUpdate: 1000,
      series: {
        name,
        type: 'bar',
        id: 'population',
        data: myData.map((item) => item.value),
        color: isOpenDarkMode ? '#22d3ee' : '#0d9488',
        universalTransition: true,
      },
    };

    chart.setOption(mapOption);
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

export default KeyboardWithBarCharts;
