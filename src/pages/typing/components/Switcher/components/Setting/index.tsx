import { TypingContext, TypingStateActionType } from '@/pages/typing/store'
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
  'flex items-center justify-center rounded-md p-0.5 text-lg text-text-muted outline-none transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary'

const tabTriggerClassName =
  'flex h-14 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-left ring-0 outline-none transition-colors'

const tabItems = [
  { value: 'sound', label: '声音', icon: IconEar, panel: <SoundSetting /> },
  { value: 'advanced', label: '高级', icon: IconAdjustmentsHorizontal, panel: <AdvancedSetting /> },
  { value: 'view', label: '显示', icon: IconEye, panel: <ViewSetting /> },
  { value: 'data', label: '数据', icon: IconDatabaseCog, panel: <DataSetting /> },
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
        className={clsx(triggerClassName, isOpen && 'bg-accent-primary text-white')}
      >
        <IconCog6Tooth className="my-icon" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-bg-overlay" />

          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[50rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-app-lg border border-border-main bg-bg-panel-strong p-0 shadow-app-panel outline-none">
            <div className="relative flex items-end justify-between border-b border-border-main bg-bg-elevated px-6 py-4">
              <Dialog.Title className="text-2xl font-semibold text-text-strong">设置</Dialog.Title>
              <button
                type="button"
                onClick={closeModal}      
                className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-accent-primary-soft hover:text-text-strong"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <Tabs.Root defaultValue="sound" orientation="vertical">
              <div className="flex h-[30rem] w-full">
                <Tabs.List
        
                  className="flex h-full w-52 flex-col items-start gap-3 border-r border-border-main bg-bg-elevated px-6 py-4"
                >
                  {tabItems.map(({ value, label, icon: Icon }) => (
                    <Tabs.Trigger
                      key={value}
                      value={value}
                      className={clsx(
                        tabTriggerClassName,
                        'text-text-muted hover:bg-accent-primary-soft hover:text-text-strong',
                        'data-[state=active]:bg-accent-primary-soft data-[state=active]:text-accent-primary',
                      )}
                    >
                      <Icon className="mr-2" />
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
