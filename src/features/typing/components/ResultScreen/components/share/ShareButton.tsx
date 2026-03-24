import { useCallback, useMemo, useState } from 'react'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import IconShare2 from '~icons/tabler/share-2'
import SharePicDialog from './SharePicDialog'

type ShareButtonProps = {
  onOpenChange?: (isOpen: boolean) => void
}

export default function ShareButton({ onOpenChange }: ShareButtonProps) {
  const [isShowSharePanel, setIsShowSharePanel] = useState(false)

  const randomChoose = useMemo(
    () => ({
      picRandom: Math.random(),
      promoteRandom: Math.random(),
    }),
    [],
  )

  const onClickShare = useCallback(() => {
    onOpenChange?.(true)
    setIsShowSharePanel(true)
  }, [onOpenChange])

  const handleShareDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChange?.(isOpen)
      setIsShowSharePanel(isOpen)
    },
    [onOpenChange],
  )

  return (
    <>
      {isShowSharePanel && (
        <SharePicDialog
          showState={isShowSharePanel}
          setShowState={handleShareDialogOpenChange}
          randomChoose={randomChoose}
        />
      )}

      <Tooltip content="分享练习结果">
        <button
          type="button"
          className="border-border-main bg-bg-elevated text-text-muted hover:border-accent-primary hover:text-text-strong inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          onClick={onClickShare}
        >
          <IconShare2 />
        </button>
      </Tooltip>
    </>
  )
}
