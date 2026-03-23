import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import clsx from 'clsx'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import IconKeyboard from '~icons/ic/round-keyboard'
import IconX from '~icons/tabler/x'

const triggerClassName =
  'flex items-center justify-center rounded-md p-0.5 text-lg text-text-muted outline-none transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary'

export default function HandPositionIllustration() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(triggerClassName, isOpen && 'bg-accent-primary text-white')}
      >
        <IconKeyboard className="my-icon" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-bg-overlay" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-app-lg border border-border-main bg-bg-panel-strong p-6 shadow-app-panel outline-none">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-accent-primary-soft hover:text-text-strong"
            >
              <IconX className="h-5 w-5" />
            </button>

            <Dialog.Title className="text-center text-xl font-medium leading-6 text-text-strong">
              推荐打字指法图示
            </Dialog.Title>

            <div className="mt-8">
              <img className="block w-full rounded-app-md" src={standTypingHandPosition} alt="标准打字手型图示" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
