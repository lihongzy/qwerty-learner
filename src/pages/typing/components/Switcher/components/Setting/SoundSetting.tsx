import { KEY_SOUND_URL_PREFIX, keySoundResources } from '@/shared/resources/soundResource'
import type { SoundResource } from '@/shared/resources/soundResource'
import { hintSoundsConfigAtom, keySoundsConfigAtom, pronunciationConfigAtom } from '@/pages/typing/state'
import { Howl } from 'howler'
import { useAtom } from 'jotai'
import { ScrollArea, Select, Slider, Switch } from 'radix-ui'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'
import IconEar from '~icons/tabler/ear'

function toFixedNumber(number: number, fractionDigits: number) {
  return Number((number ?? 0).toFixed(fractionDigits))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getSliderPercentValue(value: number[] | undefined) {
  return clamp((value?.[0] ?? 0) / 100, 0, 1)
}

let previewKeySound: Howl | null = null

function playKeySoundResource(soundResource: SoundResource, volume = 1) {
  // 试听时始终只保留一个实例，避免连续点击产生多份未释放的声音对象。
  previewKeySound?.stop()
  previewKeySound?.unload()

  previewKeySound = new Howl({
    src: [KEY_SOUND_URL_PREFIX + soundResource.filename],
    format: ['wav'],
    volume,
    onend: () => {
      previewKeySound?.unload()
      previewKeySound = null
    },
  })

  previewKeySound.play()
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col items-start gap-5 rounded-app-md border border-border-main bg-bg-panel px-6 py-6 shadow-app-soft">
      <span className="text-left text-xl font-semibold text-text-strong">{title}</span>
      {children}
    </section>
  )
}

function SettingSwitchRow({
  checked,
  onCheckedChange,
  statusLabel,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  statusLabel: string
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className="my-switch-root">
        <Switch.Thumb aria-hidden="true" className="my-switch-thumb" />
      </Switch.Root>
      <span className="text-right text-xs font-normal leading-tight text-text-muted">{statusLabel}</span>
    </div>
  )
}

function SliderBlock({
  label,
  value,
  min,
  max,
  step,
  valueText,
  disabled,
  onValueChange,
}: {
  label: string
  value: number
  min?: number
  max: number
  step: number
  valueText: string
  disabled?: boolean
  onValueChange: (value: number[]) => void
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-app-md border border-border-main bg-bg-elevated px-5 py-5">
      <span className="text-left text-base font-medium text-text-main">{label}</span>
      <div className="flex h-5 w-full items-center justify-between">
        <Slider.Root value={[value]} min={min} max={max} step={step} className="my-slider" onValueChange={onValueChange} disabled={disabled}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="ml-4 w-12 text-xs font-normal text-text-muted">{valueText}</span>
      </div>
    </div>
  )
}

const soundSelectTriggerClassName =
  'flex h-12 w-72 items-center justify-between rounded-app-md border border-border-main bg-bg-panel px-4 text-left text-base font-medium text-text-main shadow-app-soft outline-none transition-colors hover:border-accent-primary focus:border-accent-primary disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-faint'

const soundSelectContentClassName =
  'z-[200] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-app-md border border-border-main bg-bg-panel p-2 shadow-app-panel'

const soundSelectItemClassName =
  'relative grid cursor-pointer grid-cols-[20px_1fr] items-center gap-3 rounded-md px-4 py-3 text-base text-text-main outline-none transition-colors data-[highlighted]:bg-accent-primary-soft data-[highlighted]:text-text-strong'

export default function SoundSetting() {
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onTogglePronunciation = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setPronunciationConfig],
  )

  const onTogglePronunciationIsTransRead = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isTransRead: checked,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        volume: getSliderPercentValue(value),
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationTransVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        transVolume: getSliderPercentValue(value),
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationRate = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        rate: clamp(value[0] ?? 1, 0.5, 4),
      }))
    },
    [setPronunciationConfig],
  )

  const onToggleKeySounds = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setKeySoundsConfig],
  )

  const onChangeKeySoundsVolume = useCallback(
    (value: number[]) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        volume: getSliderPercentValue(value),
      }))
    },
    [setKeySoundsConfig],
  )

  const onChangeKeySoundsResource = useCallback(
    (key: string) => {
      const soundResource = keySoundResources.find((item) => item.key === key)
      if (!soundResource) {
        return
      }

      setKeySoundsConfig((prev) => ({
        ...prev,
        resource: soundResource,
      }))
    },
    [setKeySoundsConfig],
  )

  const onPlayKeySound = useCallback(() => {
    playKeySoundResource(keySoundsConfig.resource, keySoundsConfig.volume)
  }, [keySoundsConfig.resource, keySoundsConfig.volume])

  const onToggleHintSounds = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setHintSoundsConfig],
  )

  const onChangeHintSoundsVolume = useCallback(
    (value: number[]) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        volume: getSliderPercentValue(value),
      }))
    },
    [setHintSoundsConfig],
  )

  const canUseSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className="flex w-full flex-col items-start gap-10 overflow-y-auto px-3 pb-20 pt-8">
          <Section title="单词发音">
            <SettingSwitchRow
              checked={pronunciationConfig.isOpen}
              onCheckedChange={onTogglePronunciation}
              statusLabel={`发音已${pronunciationConfig.isOpen ? '开启' : '关闭'}`}
            />

            <SliderBlock
              label="音量"
              value={pronunciationConfig.volume * 100}
              max={100}
              step={10}
              disabled={!pronunciationConfig.isOpen}
              onValueChange={onChangePronunciationVolume}
              valueText={`${Math.floor(pronunciationConfig.volume * 100)}%`}
            />

            <SliderBlock
              label="倍速"
              value={pronunciationConfig.rate ?? 1}
              min={0.5}
              max={4}
              step={0.1}
              disabled={!pronunciationConfig.isOpen}
              onValueChange={onChangePronunciationRate}
              valueText={`${toFixedNumber(pronunciationConfig.rate, 2)}`}
            />
          </Section>

          {canUseSpeechSynthesis && (
            <Section title="释义发音">
              <SettingSwitchRow
                checked={pronunciationConfig.isTransRead}
                onCheckedChange={onTogglePronunciationIsTransRead}
                statusLabel={`发音已${pronunciationConfig.isTransRead ? '开启' : '关闭'}`}
              />

              <SliderBlock
                label="音量"
                value={pronunciationConfig.transVolume * 100}
                max={100}
                step={10}
                disabled={!pronunciationConfig.isTransRead}
                onValueChange={onChangePronunciationTransVolume}
                valueText={`${Math.floor(pronunciationConfig.transVolume * 100)}%`}
              />
            </Section>
          )}

          <Section title="按键音">
            <SettingSwitchRow
              checked={keySoundsConfig.isOpen}
              onCheckedChange={onToggleKeySounds}
              statusLabel={`发音已${keySoundsConfig.isOpen ? '开启' : '关闭'}`}
            />

            <SliderBlock
              label="音量"
              value={keySoundsConfig.volume * 100}
              min={1}
              max={100}
              step={10}
              disabled={!keySoundsConfig.isOpen}
              onValueChange={onChangeKeySoundsVolume}
              valueText={`${Math.floor(keySoundsConfig.volume * 100)}%`}
            />

            <div className="flex w-full flex-col items-start gap-4 rounded-app-md border border-border-main bg-bg-elevated px-5 py-5">
              <span className="text-left text-base font-medium text-text-main">按键音效</span>

              <Select.Root value={keySoundsConfig.resource.key} onValueChange={onChangeKeySoundsResource} disabled={!keySoundsConfig.isOpen}>
                <Select.Trigger className={soundSelectTriggerClassName} aria-label="选择按键音效">
                  <Select.Value placeholder="选择按键音效" />
                  <Select.Icon>
                    <IconChevronDown className="h-4 w-4" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    collisionPadding={12}
                    className={soundSelectContentClassName}
                  >
                    <Select.Viewport className="max-h-72 p-1">
                      {keySoundResources.map((keySoundResource) => (
                        <Select.Item key={keySoundResource.key} value={keySoundResource.key} className={soundSelectItemClassName}>
                          <span className="inline-flex h-5 w-5 items-center justify-center text-accent-primary">
                            <Select.ItemIndicator>
                              <IconCheck className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </span>
                          <Select.ItemText>{keySoundResource.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              <button
                type="button"
                onClick={onPlayKeySound}
                disabled={!keySoundsConfig.isOpen}
                className="group inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-accent-primary disabled:cursor-not-allowed disabled:text-text-faint"
                title="试听当前按键音"
              >
                <IconEar className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                <span>试听当前按键音</span>
              </button>
            </div>
          </Section>

          <Section title="效果音">
            <SettingSwitchRow
              checked={hintSoundsConfig.isOpen}
              onCheckedChange={onToggleHintSounds}
              statusLabel={`发音已${hintSoundsConfig.isOpen ? '开启' : '关闭'}`}
            />

            <SliderBlock
              label="音量"
              value={hintSoundsConfig.volume * 100}
              min={1}
              max={100}
              step={10}
              disabled={!hintSoundsConfig.isOpen}
              onValueChange={onChangeHintSoundsVolume}
              valueText={`${Math.floor(hintSoundsConfig.volume * 100)}%`}
            />
          </Section>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical" />
    </ScrollArea.Root>
  )
}
