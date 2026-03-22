import clsx from 'clsx'
import { type ElementType, type ReactNode, type SVGProps } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog'

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
    <Dialog open={openState} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-lg p-0" showCloseButton={false}>
        <div className="px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div
              className={clsx(
                iconClassName,
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11',
              )}
            >
              <Icon className="h-5 w-5 stroke-current sm:h-5.5 sm:w-5.5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold leading-6 text-text-strong">{title}</DialogTitle>
              <div className="mt-3 text-left">{children}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border-soft px-5 py-3 sm:px-6">
          <button
            type="button"
            className={clsx(
              buttonClassName,
              'inline-flex w-full justify-center rounded-app-sm px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40 sm:ml-auto sm:w-auto',
            )}
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
