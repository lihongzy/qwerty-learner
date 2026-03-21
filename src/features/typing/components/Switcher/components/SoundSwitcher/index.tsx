import { hintSoundsConfigAtom, keySoundsConfigAtom } from '@/features/typing/state'
import { useAtom } from 'jotai'
import { Popover, Switch } from 'radix-ui'
import { useCallback } from 'react'
import IconSpeakerWave from '~icons/heroicons/speaker-wave-solid'

const triggerClassName =
  'flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white data-[state=open]:bg-indigo-500 data-[state=open]:text-white'

const switchRootClassName =
  'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-3 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none data-[state=checked]:bg-indigo-400'

const switchThumbClassName =
  'pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-[25px]'

type SettingRowProps = {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const SettingRow = ({ label, checked, onCheckedChange }: SettingRowProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">{label}</span>
      <div className="flex w-full items-center justify-between">
        <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className={switchRootClassName}>
          <Switch.Thumb className={switchThumbClassName} />
        </Switch.Root>
        <span className="text-right text-xs font-normal leading-tight text-gray-600 dark:text-white dark:text-opacity-60">
          {checked ? '开启' : '关闭'}
        </span>
      </div>
    </div>
  )
}

export default function SoundSwitcher() {
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onChangeKeySound = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setKeySoundsConfig],
  )

  const onChangeHintSound = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setHintSoundsConfig],
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={triggerClassName}
          onFocus={(e) => e.currentTarget.blur()}
          aria-label="声音设置"
          title="声音设置"
        >
          <IconSpeakerWave className="my-icon" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="center"
          className="z-30 w-60 select-none rounded-xl bg-white p-4 shadow-[0_-12px_30px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.14)] outline-none dark:bg-gray-800"
        >
          <div className="flex flex-col gap-4">
            <SettingRow label="按键音" checked={keySoundsConfig.isOpen} onCheckedChange={onChangeKeySound} />
            <SettingRow label="提示音" checked={hintSoundsConfig.isOpen} onCheckedChange={onChangeHintSound} />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
