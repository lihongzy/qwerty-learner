import { KEY_SOUND_URL_PREFIX, keySoundResources } from '@/shared/resources/soundResource'
import type { SoundResource } from '@/shared/resources/soundResource'
import { hintSoundsConfigAtom, keySoundsConfigAtom, pronunciationConfigAtom } from '@/features/typing/state'
import { Howl, Howler } from 'howler'
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

function playKeySoundResource(soundResource: SoundResource, volume = 1) {
  const path = KEY_SOUND_URL_PREFIX + soundResource.filename
  const sound = new Howl({
    src: path,
    format: ['wav'],
    volume,
  })

  Howler.volume(1)
  sound.play()
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col items-start gap-5 rounded-2xl border border-stone-200 bg-white/85 px-6 py-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/85">
      <span className="text-left text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</span>
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
      <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className="switch-root">
        <Switch.Thumb aria-hidden="true" className="switch-thumb" />
      </Switch.Root>
      <span className="text-right text-xs font-normal leading-tight text-gray-600 dark:text-gray-300">{statusLabel}</span>
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
    <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5 dark:border-gray-700 dark:bg-gray-900/70">
      <span className="text-left text-base font-medium text-gray-700 dark:text-gray-200">{label}</span>
      <div className="flex h-5 w-full items-center justify-between">
        <Slider.Root value={[value]} min={min} max={max} step={step} className="slider" onValueChange={onValueChange} disabled={disabled}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb />
        </Slider.Root>
        <span className="ml-4 w-12 text-xs font-normal text-gray-600 dark:text-gray-300">{valueText}</span>
      </div>
    </div>
  )
}

const soundSelectTriggerClassName =
  'flex h-12 w-72 items-center justify-between rounded-xl border border-stone-200 bg-white px-4 text-left text-base font-medium text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.08)] outline-none transition-colors hover:border-indigo-300 focus:border-indigo-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white/90 dark:disabled:bg-gray-800 dark:disabled:text-gray-500'

const soundSelectContentClassName =
  'z-[200] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-stone-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:border-gray-600 dark:bg-gray-700'

const soundSelectItemClassName =
  'relative grid cursor-pointer grid-cols-[20px_1fr] items-center gap-3 rounded-lg px-4 py-3 text-base text-slate-800 outline-none transition-colors data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900 dark:text-white/90 dark:data-[highlighted]:bg-gray-600'

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
        volume: (value[0] ?? 0) / 100,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationTransVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        transVolume: (value[0] ?? 0) / 100,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationRate = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        rate: value[0] ?? 1,
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
        volume: (value[0] ?? 0) / 100,
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
        volume: (value[0] ?? 0) / 100,
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

            <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5 dark:border-gray-700 dark:bg-gray-900/70">
              <span className="text-left text-base font-medium text-gray-700 dark:text-gray-200">按键音效</span>

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
                          <span className="inline-flex h-5 w-5 items-center justify-center text-indigo-500">
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
                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-500 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-gray-300 dark:hover:text-indigo-300 dark:disabled:text-gray-500"
                title="试听当前按键音"
              >
                <IconEar className="h-4 w-4 transition-transform group-hover:rotate-[-12deg]" />
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
