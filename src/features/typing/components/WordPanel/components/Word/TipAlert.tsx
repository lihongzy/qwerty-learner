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
          <div
            role="alert"
            className="relative max-w-sm rounded-app-md border border-accent-warn/30 bg-bg-panel-strong p-4 pl-11 text-text-main shadow-app-panel"
          >
            <IconWarning className="absolute left-4 top-4 h-4 w-4 text-accent-warn" />
            <h5 className="mb-1 font-medium leading-none tracking-[0.08em] text-accent-warn">输入异常提示</h5>
            <div className="text-sm leading-6 text-text-muted">
              如果持续无法正常输入，可能是浏览器扩展造成干扰。请先关闭相关扩展，或换一个浏览器再试。
            </div>
          </div>
        </div>
      )}
    </>
  )
}
