import { wordDictationConfigAtom } from '@/store'
import type { WordDictationType } from '@/typings'
import { useAtom } from 'jotai'
import { Popover, Select, Switch } from 'radix-ui'
import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconEyeSlash from '~icons/heroicons/eye-slash-solid'
import IconEye from '~icons/heroicons/eye-solid'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  { name: 'Hide all letters', type: 'hideAll' },
  { name: 'Hide vowels', type: 'hideVowel' },
  { name: 'Hide consonants', type: 'hideConsonant' },
  { name: 'Hide random letters', type: 'randomHide' },
]

const triggerClassName =
  'flex items-center justify-center rounded p-[2px] text-lg outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white data-[state=open]:bg-indigo-500 data-[state=open]:text-white'

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
          {checked ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  )
}

export default function WordDictationSwitcher() {
  const [wordDictationConfig, setWordDictationConfig] = useAtom(wordDictationConfigAtom)

  const currentType = useMemo(
    () => wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0],
    [wordDictationConfig.type],
  )

  const onToggleWordDictation = useCallback(
    (checked?: boolean) => {
      setWordDictationConfig((old) => {
        const nextIsOpen = checked ?? !old.isOpen
        return {
          ...old,
          isOpen: nextIsOpen,
          openBy: nextIsOpen ? 'user' : old.openBy,
        }
      })
    },
    [setWordDictationConfig],
  )

  const onChangeWordDictationType = useCallback(
    (value: string) => {
      setWordDictationConfig((old) => ({
        ...old,
        type: value as WordDictationType,
      }))
    },
    [setWordDictationConfig],
  )

  useHotkeys(
    'ctrl+v',
    () => {
      onToggleWordDictation()
    },
    { enableOnFormTags: true, preventDefault: true },
    [onToggleWordDictation],
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`${triggerClassName} ${wordDictationConfig.isOpen ? 'text-indigo-500' : 'text-gray-500'}`}
          type="button"
          aria-label="Toggle dictation mode"
          title="Toggle dictation mode"
          onFocus={(e) => e.currentTarget.blur()}
        >
          {wordDictationConfig.isOpen ? <IconEye className="icon" /> : <IconEyeSlash className="icon" />}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="center"
          className="shadow-upper z-30 w-60 select-none rounded-xl bg-white p-4 drop-shadow outline-none dark:bg-gray-800"
        >
          <div className="flex flex-col gap-4">
            <SettingRow label="Dictation mode" checked={wordDictationConfig.isOpen} onCheckedChange={onToggleWordDictation} />

            {wordDictationConfig.isOpen && (
              <div className="flex w-full flex-col items-start gap-2">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Mode</span>

                <Select.Root value={currentType.type} onValueChange={onChangeWordDictationType}>
                  <Select.Trigger className={selectTriggerClassName} aria-label="Select dictation mode">
                    <Select.Value placeholder="Select dictation mode" />
                    <Select.Icon>
                      <IconChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content position="popper" sideOffset={6} className={selectContentClassName}>
                      <Select.Viewport className={selectViewportClassName}>
                        {wordDictationTypeList.map((item) => (
                          <Select.Item key={item.type} value={item.type} className={selectItemClassName}>
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
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
