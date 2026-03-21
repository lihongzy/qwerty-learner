import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'
import AdvancedSetting from './AdvancedSetting'
import DataSetting from './DataSetting'
import SoundSetting from './SoundSetting'
import ViewSetting from './ViewSetting'
import { Dialog, Tabs } from 'radix-ui'
import { useContext, useState } from 'react'
import IconCog6Tooth from '~icons/heroicons/cog-6-tooth-solid'
import IconEye from '~icons/heroicons/eye-solid'
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal'
import IconDatabaseCog from '~icons/tabler/database-cog'
import IconEar from '~icons/tabler/ear'
import IconX from '~icons/tabler/x'
import clsx from 'clsx'

const triggerClassName =
  'flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white'

const tabTriggerClassName =
  'flex h-14 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-left ring-0 outline-none transition-colors'

const tabItems = [
  { value: 'sound', label: 'Sound', icon: IconEar, panel: <SoundSetting /> },
  { value: 'advanced', label: 'Advanced', icon: IconAdjustmentsHorizontal, panel: <AdvancedSetting /> },
  { value: 'view', label: 'Display', icon: IconEye, panel: <ViewSetting /> },
  { value: 'data', label: 'Data', icon: IconDatabaseCog, panel: <DataSetting /> },
] as const

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useContext(TypingContext)!

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`${triggerClassName} ${isOpen ? 'bg-indigo-500 text-white' : ''}`}
        title="Open settings"
      >
        <IconCog6Tooth className="icon" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/25" />

          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[50rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-xl outline-none dark:bg-gray-800">
            <div className="relative flex h-22 items-end justify-between rounded-t-lg border-b border-neutral-100 bg-stone-50 px-6 py-3 dark:border-neutral-700 dark:bg-gray-900">
              <Dialog.Title className="text-3xl font-bold text-gray-600 dark:text-gray-200">Settings</Dialog.Title>
              <button type="button" onClick={closeModal} title="Close settings">
                <IconX className="absolute right-7 top-5 cursor-pointer text-gray-400" />
              </button>
            </div>

            <Tabs.Root defaultValue="sound" orientation="vertical">
              <div className="flex h-[30rem] w-full">
                <Tabs.List
                  aria-label="Setting categories"
                  className="flex h-full w-52 flex-col items-start space-y-3 border-r border-neutral-100 bg-stone-50 px-6 py-3 dark:border-transparent dark:bg-gray-900"
                >
                  {tabItems.map(({ value, label, icon: Icon }) => (
                    <Tabs.Trigger
                      key={value}
                      value={value}
                      className={clsx(
                        tabTriggerClassName,
                        'text-neutral-500 dark:text-neutral-300',
                        'data-[state=active]:bg-gray-200/50 dark:data-[state=active]:bg-gray-800',
                      )}
                    >
                      <Icon className="mr-2 text-neutral-500 dark:text-neutral-300" />
                      <span>{label}</span>
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                <div className="h-full w-full flex-1">
                  {tabItems.map(({ value, panel }) => (
                    <Tabs.Content key={value} value={value} className="flex h-full focus:outline-none">
                      {panel}
                    </Tabs.Content>
                  ))}
                </div>
              </div>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

