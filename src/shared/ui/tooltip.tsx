import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import React from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

type TooltipContentProps = React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>

const TooltipContent = ({ className, sideOffset = 4, ...props }: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={clsx(
        'z-[70] overflow-hidden rounded-app-sm border border-border-main bg-bg-panel-strong px-5 py-1 text-[11px] text-text-muted shadow-app-soft animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

type TooltipHintProps = {
  children: React.ReactNode
  content: string
  className?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const TooltipHint = ({ children, content, className, placement = 'top' }: TooltipHintProps) => {
  const side = placement

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={clsx('inline-flex', className)}>{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={5}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipHint }
