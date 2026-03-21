import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import IconKeyboard from '~icons/ic/round-keyboard'
import IconX from '~icons/tabler/x'

const triggerClassName =
  'flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white'

export default function HandPositionIllustration() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${triggerClassName} ${isOpen ? 'bg-indigo-500 text-white' : ''}`}
        aria-label="查看推荐打字指法图示"
        title="查看推荐打字指法图示"
      >
        <IconKeyboard className="icon" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white p-6 shadow-xl outline-none dark:bg-gray-800">
            <button type="button" onClick={() => setIsOpen(false)} title="关闭对话框">
              <IconX className="absolute right-7 top-5 cursor-pointer text-gray-400" />
            </button>

            <Dialog.Title className="text-center text-xl font-medium leading-6 text-gray-800 dark:text-gray-200">
              推荐打字指法图示
            </Dialog.Title>

            <div className="mt-8">
              <img className="block w-full" src={standTypingHandPosition} alt="标准打字手型图示" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
