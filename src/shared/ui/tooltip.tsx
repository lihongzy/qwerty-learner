import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import React from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps = React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>

const TooltipContent = ({ className, sideOffset = 4, ...props }: TooltipContentProps) => (
  <TooltipPrimitive.Content
    sideOffset={sideOffset}
    className={clsx(
      'z-50 overflow-hidden rounded-md border border-slate-100 bg-white px-2 py-[4px] text-sm text-slate-700 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
      className,
    )}
    {...props}
  />
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

type TooltipHintProps = {
  children: React.ReactNode
  content: string
  className?: string
  placement?: 'top' | 'bottom'
}

const TooltipHint = ({ children, content, className, placement = 'top' }: TooltipHintProps) => {
  const side = placement === 'bottom' ? 'bottom' : 'top'

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={clsx('inline-flex', className)}>{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={8}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipHint }
