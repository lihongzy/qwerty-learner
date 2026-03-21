import { defaultFontSizeConfig } from '@/constants'
import { fontSizeConfigAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Slider from '@radix-ui/react-slider'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

function FontSizeBlock({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onValueChange: (value: [number]) => void
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5 dark:border-gray-700 dark:bg-gray-900/70">
      <span className="text-left text-base font-medium text-gray-700 dark:text-gray-200">{label}</span>
      <div className="flex h-5 w-full items-center justify-between">
        <Slider.Root value={[value]} min={min} max={max} step={step} className="slider" onValueChange={onValueChange}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="ml-4 w-12 text-xs font-normal text-gray-600 dark:text-gray-300">{value}px</span>
      </div>
    </div>
  )
}

export default function ViewSetting() {
  const [fontSizeConfig, setFontsizeConfig] = useAtom(fontSizeConfigAtom)

  // 调整外语单词的显示字号。
  const onChangeForeignFontSize = useCallback(
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        foreignFont: value[0],
      }))
    },
    [setFontsizeConfig],
  )

  // 调整中文释义的显示字号。
  const onChangeTranslateFontSize = useCallback(
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        translateFont: value[0],
      }))
    },
    [setFontsizeConfig],
  )

  // 一键恢复到默认字号配置。
  const onResetFontSize = useCallback(() => {
    setFontsizeConfig({ ...defaultFontSizeConfig })
  }, [setFontsizeConfig])

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        {/* 显示设置内容放在滚动区域内，避免面板高度不够时被截断。 */}
        <div className="flex w-full flex-col items-start gap-10 overflow-y-auto px-3 pb-20 pt-8">
          <section className="flex w-full flex-col items-start gap-6 rounded-2xl border border-stone-200 bg-white/80 px-6 py-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
            <span className="text-left text-xl font-semibold text-gray-800 dark:text-gray-100">字体设置</span>

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
            className="my-btn-primary ml-1 disabled:bg-gray-300 dark:disabled:bg-gray-600"
            type="button"
            onClick={onResetFontSize}
            title="重置字体设置"
          >
            重置字体设置
          </button>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
