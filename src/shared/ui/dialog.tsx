import type { ComponentPropsWithRef, HTMLAttributes } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { X } from 'lucide-react'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

type DialogOverlayProps = ComponentPropsWithRef<typeof DialogPrimitive.Overlay>

function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={clsx(
        'fixed inset-0 z-50 bg-[rgba(6,12,17,0.72)] backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-[rgba(2,6,10,0.82)]',
        className,
      )}
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
      <DialogPrimitive.Content
        ref={ref}
        className={clsx(
          'fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden border border-[var(--app-border)] bg-[linear-gradient(180deg,var(--app-surface-strong),var(--app-surface))] p-6 shadow-[var(--app-shadow)] backdrop-blur-xl duration-200 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl',
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18%),radial-gradient(circle_at_top_right,rgba(124,246,255,0.12),transparent_22%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_16%),radial-gradient(circle_at_top_right,rgba(124,246,255,0.08),transparent_24%)]" />
        <div className="relative w-full">
          {children}
        </div>
        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] transition-colors duration-150 hover:border-[var(--app-accent)] hover:text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]/30 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
}

DialogHeader.displayName = 'DialogHeader'

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
}

DialogFooter.displayName = 'DialogFooter'

type DialogTitleProps = ComponentPropsWithRef<typeof DialogPrimitive.Title>

function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={clsx('text-lg font-semibold leading-none tracking-tight text-[var(--app-text)]', className)}
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
      className={clsx('text-sm text-[var(--app-text-muted)]', className)}
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
