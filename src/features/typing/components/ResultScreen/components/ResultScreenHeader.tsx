import * as Dialog from '@radix-ui/react-dialog'
import IconX from '~icons/tabler/x'
import { RESULT_SCREEN_COPY } from '../copy'
import { AuthorButton, ResultScreenIconButton } from './ResultScreenParts'
import type { UtilityButtonConfig } from './types'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'

type ResultScreenHeaderProps = {
  chapterTitle: string
  utilityButtons: UtilityButtonConfig[]
}

export function ResultScreenHeader({ chapterTitle, utilityButtons }: ResultScreenHeaderProps) {
  return (
    <div className="relative border-b border-slate-200/80 px-5 py-3.5 dark:border-slate-800 sm:px-6 lg:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.35)] dark:bg-cyan-400 dark:shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            {RESULT_SCREEN_COPY.sessionSummary}
          </div>

          <div className="space-y-1">
            <Dialog.Title className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2.6rem] lg:text-[2.85rem]">
              {chapterTitle}
            </Dialog.Title>
            <Dialog.Description className="max-w-2xl text-[0.92rem] leading-6 text-slate-600 dark:text-slate-400">
              {RESULT_SCREEN_COPY.sessionDescription}
            </Dialog.Description>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {utilityButtons.map((button) => {
            if (!button.onClick && !button.href) {
              return (
                <div key={button.key} className="inline-flex h-9 w-9 items-center justify-center">
                  {button.key === 'author' ? <AuthorButton /> : button.icon}
                </div>
              )
            }

            return (
              <ResultScreenIconButton
                key={button.key}
                title={button.title}
                icon={button.icon}
                className={button.className}
                onClick={button.onClick}
                href={button.href}
              />
            )
          })}

          <Tooltip content={RESULT_SCREEN_COPY.exitTitle}>
            <Dialog.Close asChild>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
                type="button"
              >
                <IconX />
              </button>
            </Dialog.Close>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
