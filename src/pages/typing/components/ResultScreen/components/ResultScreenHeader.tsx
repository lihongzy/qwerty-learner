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
    <div className="border-border-main relative border-b px-4 py-3 sm:px-5 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Dialog.Title className="text-text-strong text-[1.8rem] font-semibold tracking-tight sm:text-[2.15rem] lg:text-[2.35rem]">
            {chapterTitle}
          </Dialog.Title>
          <Dialog.Description className="text-text-muted max-w-2xl text-[0.85rem] leading-5.5">
            {RESULT_SCREEN_COPY.sessionDescription}
          </Dialog.Description>
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
                className="border-border-main bg-bg-elevated text-text-muted hover:border-accent-primary hover:text-text-strong inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
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
