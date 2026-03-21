import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import clsx from 'clsx'
import { type ElementType, Fragment, type ReactNode, type SVGProps } from 'react'

type InfoPanelProps = {
  openState: boolean
  onClose: () => void
  title: string
  icon: ElementType<SVGProps<SVGSVGElement>>
  iconClassName?: string
  buttonClassName?: string
  children: ReactNode
}

export const InfoPanel = ({
  openState,
  title,
  onClose,
  icon: Icon,
  iconClassName,
  buttonClassName,
  children,
}: InfoPanelProps) => {
  return (
    <Transition show={openState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop as="div" className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={clsx(
                        iconClassName,
                        'mx-auto flex h-12 shrink-0 items-center justify-center rounded-full dark:opacity-30 sm:mx-0 sm:h-10 sm:w-10',
                      )}
                    >
                      <Icon className="h-6 w-6 stroke-current dark:opacity-100" />
                    </div>
                    <div>
                      <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {title}
                      </DialogTitle>
                      <div className="mt-2">{children}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={clsx(
                      buttonClassName,
                      'mt-3 inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-[var(--app-shadow-soft)] transition-transform focus:outline-none hover:-translate-y-px sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
                    )}
                    onClick={onClose}
                  >
                    关闭
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
