import { SimpleTooltip as Tooltip } from '@/shared/ui/tooltip'
import { LANG_PRON_MAP } from '@/shared/resources/soundResource'
import { currentDictInfoAtom, phoneticConfigAtom } from '@/shared/state'
import { pronunciationConfigAtom } from '@/features/typing/state'
import type { PronunciationType } from '@/shared/types'
import { useAtom, useAtomValue } from 'jotai'
import { Popover, Select, Switch } from 'radix-ui'
import { memo, useCallback, useEffect, useMemo } from 'react'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

const PRONUNCIATION_PHONETIC_MAP: Partial<Record<PronunciationType, PronunciationType>> = {
  us: 'us',
  uk: 'uk',
  romaji: 'romaji',
  zh: 'zh',
  ja: 'ja',
  de: 'de',
  hapin: 'hapin',
  kk: 'kk',
  id: 'id',
}

const switchRootClassName =
  'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-3 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none data-[state=checked]:bg-indigo-400'

const switchThumbClassName =
  'pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-[25px]'

const selectTriggerClassName =
  'flex h-10 w-36 items-center justify-between rounded-lg bg-white px-3 text-left text-sm text-gray-900 shadow-md transition-colors focus:outline-none dark:bg-gray-700 dark:text-white dark:text-opacity-80'

const selectContentClassName = 'z-30 overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-700'
const selectViewportClassName = 'p-1'

const selectItemClassName =
  'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-9 pr-8 text-sm text-gray-900 outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900 dark:text-white dark:text-opacity-80 dark:data-[highlighted]:bg-gray-600'

type SettingRowProps = {
  label: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
  checkedText: string
  uncheckedText: string
}

function SettingRow({ label, checked, onCheckedChange, checkedText, uncheckedText }: SettingRowProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-70">{label}</span>
      <div className="flex w-full items-center justify-between gap-3">
        <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className={switchRootClassName}>
          <Switch.Thumb className={switchThumbClassName} />
        </Switch.Root>
        <span className="text-right text-xs font-normal leading-tight text-gray-600 dark:text-white dark:text-opacity-60">
          {checked ? checkedText : uncheckedText}
        </span>
      </div>
    </div>
  )
}

const PronunciationSwitcherComponent = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [phoneticConfig, setPhoneticConfig] = useAtom(phoneticConfigAtom)

  const pronunciationList = useMemo(() => LANG_PRON_MAP[currentDictInfo.language].pronunciation, [currentDictInfo.language])

  useEffect(() => {
    const defaultPronIndex = currentDictInfo.defaultPronIndex ?? LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex
    const defaultPron = pronunciationList[defaultPronIndex]
    const currentPronIndex = pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type)

    if (currentPronIndex === -1 && defaultPron) {
      setPronunciationConfig((old) => ({
        ...old,
        type: defaultPron.pron,
        name: defaultPron.name,
      }))
    }
  }, [currentDictInfo.defaultPronIndex, currentDictInfo.language, pronunciationConfig.type, pronunciationList, setPronunciationConfig])

  useEffect(() => {
    const phoneticType = PRONUNCIATION_PHONETIC_MAP[pronunciationConfig.type]
    if (phoneticType) {
      setPhoneticConfig((old) => ({
        ...old,
        type: phoneticType,
      }))
    }
  }, [pronunciationConfig.type, setPhoneticConfig])

  const onChangePronunciationIsOpen = useCallback((value: boolean) => {
    setPronunciationConfig((old) => ({
      ...old,
      isOpen: value,
    }))
  }, [setPronunciationConfig])

  const onChangePronunciationIsTransRead = useCallback((value: boolean) => {
    setPronunciationConfig((old) => ({
      ...old,
      isTransRead: value,
    }))
  }, [setPronunciationConfig])

  const onChangePronunciationIsLoop = useCallback((value: boolean) => {
    setPronunciationConfig((old) => ({
      ...old,
      isLoop: value,
    }))
  }, [setPronunciationConfig])

  const onChangePhoneticIsOpen = useCallback((value: boolean) => {
    setPhoneticConfig((old) => ({
      ...old,
      isOpen: value,
    }))
  }, [setPhoneticConfig])

  const onChangePronunciationType = useCallback((value: string) => {
    const item = pronunciationList.find((pronunciationItem) => pronunciationItem.pron === value)
    if (item) {
      setPronunciationConfig((old) => ({
        ...old,
        type: item.pron,
        name: item.name,
      }))
    }
  }, [pronunciationList, setPronunciationConfig])

  const currentLabel = useMemo(() => {
    return pronunciationConfig.isOpen ? pronunciationConfig.name : '关闭'
  }, [pronunciationConfig.isOpen, pronunciationConfig.name])

  const canUseSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-8 min-w-[3rem] cursor-pointer items-center justify-center rounded-md px-2 text-sm transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none data-[state=open]:bg-indigo-400 data-[state=open]:text-white dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
          onFocus={(e) => {
            e.currentTarget.blur()
          }}
        >
          <Tooltip content="发音与音标">{currentLabel}</Tooltip>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="center"
          className="shadow-upper z-30 w-72 select-none rounded-2xl bg-white p-4 text-left shadow-xl outline-none dark:bg-gray-800"
        >
          <div className="flex flex-col gap-4">
            <SettingRow label="音标" checked={phoneticConfig.isOpen} onCheckedChange={onChangePhoneticIsOpen} checkedText="开启" uncheckedText="关闭" />
            <SettingRow label="单词发音" checked={pronunciationConfig.isOpen} onCheckedChange={onChangePronunciationIsOpen} checkedText="开启" uncheckedText="关闭" />

            {canUseSpeechSynthesis && (
              <SettingRow
                label="释义朗读"
                checked={pronunciationConfig.isTransRead}
                onCheckedChange={onChangePronunciationIsTransRead}
                checkedText="开启"
                uncheckedText="关闭"
              />
            )}

            {pronunciationConfig.isOpen && (
              <div className="flex flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-gray-700 dark:bg-gray-900/70">
                <SettingRow label="循环发音" checked={pronunciationConfig.isLoop} onCheckedChange={onChangePronunciationIsLoop} checkedText="开启" uncheckedText="关闭" />

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-70">发音类型</span>

                  <Select.Root value={pronunciationConfig.type} onValueChange={onChangePronunciationType}>
                    <Select.Trigger className={selectTriggerClassName} aria-label="发音类型">
                      <Select.Value placeholder="选择发音类型" />
                      <Select.Icon>
                        <IconChevronDown className="h-4 w-4" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content position="popper" sideOffset={6} className={selectContentClassName}>
                        <Select.Viewport className={selectViewportClassName}>
                          {pronunciationList.map((item) => (
                            <Select.Item key={item.pron} value={item.pron} className={selectItemClassName}>
                              <Select.ItemText>{item.name}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-3 inline-flex items-center">
                                <IconCheck className="h-4 w-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <span className="text-center text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">快捷键：Ctrl + J</span>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export const PronunciationSwitcher = memo(PronunciationSwitcherComponent)

export default PronunciationSwitcher

