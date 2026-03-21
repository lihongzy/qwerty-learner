import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import clsx from 'clsx'
import { useCallback } from 'react'
import IconWarning from '~icons/material-symbols/warning'

export const TipAlert = ({ className, show, setShow }: { className?: string; show: boolean; setShow: (show: boolean) => void }) => {
  const onClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  return (
    <>
      {show && (
        <div className={clsx('z-10 w-fit cursor-pointer pr-5', className)} onClick={onClose}>
          <Alert variant="destructive" className="relative">
            <IconWarning className="h-4 w-4" />
            <AlertTitle>Extension conflict</AlertTitle>
            <AlertDescription>
              If input keeps failing, a browser extension may be interfering. Disable related extensions or try another browser.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
