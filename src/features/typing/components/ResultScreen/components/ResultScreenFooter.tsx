import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import type { ActionButtonConfig } from './types'

type ResultScreenFooterProps = {
  actionButtons: ActionButtonConfig[]
}

export function ResultScreenFooter({ actionButtons }: ResultScreenFooterProps) {
  return (
    <div className="border-border-main bg-bg-elevated relative flex shrink-0 flex-wrap items-center justify-center gap-2.5 border-t px-4 py-3">
      {actionButtons.map((button) => (
        <Tooltip key={button.key} content={button.tooltip}>
          <button
            className={`my-btn-primary h-9 min-w-[8.25rem] px-3.5 text-[0.9rem] font-semibold ${button.className ?? ''}`}
            type="button"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
