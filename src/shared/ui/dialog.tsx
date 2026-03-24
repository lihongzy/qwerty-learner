import type { ComponentPropsWithRef, HTMLAttributes } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { X } from 'lucide-react'

const overlayClassName =
  'fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] ' +
  'duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'

const contentClassName =
  'fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden ' +
  'rounded-app-lg border border-border-main bg-bg-panel-strong p-5 shadow-app-soft ' +
  'duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none ' +
  'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
  'data-[state=closed]:zoom-out-[0.995] data-[state=open]:zoom-in-[0.995]'

const closeButtonClassName =
  'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full ' +
  'text-text-faint transition-colors duration-150 hover:text-text-strong focus:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-accent-cool/40 disabled:pointer-events-none'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

type DialogOverlayProps = ComponentPropsWithRef<typeof DialogPrimitive.Overlay>

function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={clsx(overlayClassName, className)}
      {...props}
    />
  )
}

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

type DialogContentProps = ComponentPropsWithRef<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}

function DialogContent({ className, children, ref, showCloseButton = true, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      {/* 通用弹窗壳：负责定位、尺寸约束和基础表面，不承载具体业务布局。 */}
      <DialogPrimitive.Content
        ref={ref}
        className={clsx(contentClassName, className)}
        {...props}
      >
        <div className="relative min-h-0 w-full flex-1">{children}</div>
        {showCloseButton && (
          <DialogPrimitive.Close className={closeButtonClassName}>
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // 统一标题区的纵向节奏，避免各个弹窗自己拼标题布局。
  return <div className={clsx('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
}

DialogHeader.displayName = 'DialogHeader'

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  // 小屏按钮倒序堆叠，大屏回到右对齐横排。
  return <div className={clsx('flex flex-col-reverse gap-2.5 border-t border-border-soft pt-4 sm:flex-row sm:justify-end', className)} {...props} />
}

DialogFooter.displayName = 'DialogFooter'

type DialogTitleProps = ComponentPropsWithRef<typeof DialogPrimitive.Title>

function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={clsx('text-xl font-semibold tracking-tight text-text-strong', className)}
      {...props}
    />
  )
}

DialogTitle.displayName = DialogPrimitive.Title.displayName

type DialogDescriptionProps = ComponentPropsWithRef<typeof DialogPrimitive.Description>

function DialogDescription({ className, ref, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={clsx('text-sm leading-6 text-text-muted', className)}
      {...props}
    />
  )
}

DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
