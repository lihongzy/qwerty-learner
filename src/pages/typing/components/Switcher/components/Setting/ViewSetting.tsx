import { defaultFontSizeConfig } from '@/shared/constants';
import { useSharedPreferencesStore } from '@/shared/stores';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Slider from '@radix-ui/react-slider';
import { useCallback } from 'react';

function FontSizeBlock({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: [number]) => void;
}) {
  return (
    <div className="rounded-app-md border-border-main bg-bg-elevated flex w-full flex-col items-start gap-4 border px-5 py-5">
      <span className="text-text-main text-left text-base font-medium">{label}</span>
      <div className="flex h-5 w-full items-center justify-between">
        <Slider.Root
          value={[value]}
          min={min}
          max={max}
          step={step}
          className="my-slider"
          onValueChange={onValueChange}
        >
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="text-text-muted ml-4 w-12 text-xs font-normal">{value}px</span>
      </div>
    </div>
  );
}

export default function ViewSetting() {
  const fontSizeConfig = useSharedPreferencesStore((state) => state.fontSizeConfig);
  const setFontsizeConfig = useSharedPreferencesStore((state) => state.setFontSizeConfig);

  // 调整外语单词的显示字号。
  const onChangeForeignFontSize = useCallback(
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        foreignFont: value[0],
      }));
    },
    [setFontsizeConfig],
  );

  // 调整中文释义的显示字号。
  const onChangeTranslateFontSize = useCallback(
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        translateFont: value[0],
      }));
    },
    [setFontsizeConfig],
  );

  // 一键恢复到默认字号配置。
  const onResetFontSize = useCallback(() => {
    setFontsizeConfig({ ...defaultFontSizeConfig });
  }, [setFontsizeConfig]);

  return (
    <ScrollArea.Root className="flex-1 overflow-y-auto select-none">
      <ScrollArea.Viewport className="h-full w-full px-3">
        {/* 显示设置内容放在滚动区域内，避免面板高度不够时被截断。 */}
        <div className="flex w-full flex-col items-start gap-10 overflow-y-auto px-3 pt-8 pb-20">
          <section className="rounded-app-md border-border-main bg-bg-panel shadow-app-soft flex w-full flex-col items-start gap-6 border px-6 py-6">
            <span className="text-text-strong text-left text-xl font-semibold">字体设置</span>

            {/* 滑块值直接绑定到全局字号配置，拖动时实时更新界面。 */}
            <FontSizeBlock
              label="外语字体"
              value={fontSizeConfig.foreignFont}
              min={20}
              max={96}
              step={4}
              onValueChange={onChangeForeignFontSize}
            />

            {/* 中文释义字号范围更小，避免占用过多纵向空间。 */}
            <FontSizeBlock
              label="中文字体"
              value={fontSizeConfig.translateFont}
              min={14}
              max={60}
              step={4}
              onValueChange={onChangeTranslateFontSize}
            />
          </section>

          <button
            className="bg-accent-primary hover:bg-accent-primary-hover disabled:bg-bg-elevated disabled:text-text-faint ml-1 inline-flex items-center justify-center rounded-md px-5 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed"
            type="button"
            onClick={onResetFontSize}
            title="重置字体设置"
          >
            重置字体设置
          </button>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none bg-transparent select-none" orientation="vertical" />
    </ScrollArea.Root>
  );
}
