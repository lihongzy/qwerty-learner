import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import type { ActionButtonConfig } from './types'

type ResultScreenFooterProps = {
  actionButtons: ActionButtonConfig[]
}

export function ResultScreenFooter({ actionButtons }: ResultScreenFooterProps) {
  return (
    <div className="relative flex shrink-0 flex-wrap items-center justify-center gap-3 border-t border-slate-200/80 bg-slate-50/88 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/88">
      {actionButtons.map((button) => (
        <Tooltip key={button.key} content={button.tooltip}>
          <button
            className={`my-btn-primary h-10 min-w-[9rem] px-4 text-[0.95rem] font-semibold ${button.className ?? ''}`}
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
