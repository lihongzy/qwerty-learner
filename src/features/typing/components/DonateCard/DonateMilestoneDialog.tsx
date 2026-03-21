import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import IconParty from '~icons/logos/partytown-icon'
import { DonatingCard } from '@/shared/components/DonatingCard'

type DonateMilestoneDialogProps = {
  chapterNumber: number
  dayFromFirstWord: number
  wordNumber: number
  sumWrongCount: number
  open: boolean
  onRemindMeLater: () => void
  onHasDonated: () => void
}

function HighlightedText({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-cyan-700 dark:text-cyan-300">{children}</span>
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-cyan-50">{value}</div>
    </div>
  )
}

export function DonateMilestoneDialog({
  chapterNumber,
  dayFromFirstWord,
  wordNumber,
  sumWrongCount,
  open,
  onRemindMeLater,
  onHasDonated,
}: DonateMilestoneDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/88 dark:backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[min(68rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(148,163,184,0.28)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_36px_120px_rgba(0,0,0,0.72)]"
          // This prompt is milestone-driven, so close it only through explicit actions.
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.72),transparent_18%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%)]" />

          <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.35)] dark:bg-cyan-400 dark:shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                里程碑达成
              </div>
              <div className="hidden items-center gap-1 text-amber-500 dark:text-amber-300 sm:flex">
                <IconParty fontSize={16} />
                <IconParty fontSize={16} />
                <IconParty fontSize={16} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_20rem]">
              <div className="min-w-0 space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-600">
                    练习总结
                  </p>
                  <Dialog.Title className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                    已完成 <span className="text-cyan-700 dark:text-cyan-300">{chapterNumber}</span> 个章节
                  </Dialog.Title>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard label="坚持天数" value={dayFromFirstWord} />
                  <MetricCard label="练习单词" value={wordNumber} />
                  <MetricCard label="纠错次数" value={sumWrongCount} />
                </div>

                <Dialog.Description className="space-y-4 text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-300">
                  <p>
                    你已经完成了 <HighlightedText>{chapterNumber}</HighlightedText> 个章节，在 Qwerty Learner 坚持了{' '}
                    <HighlightedText>{dayFromFirstWord}</HighlightedText> 天，累计练习了 <HighlightedText>{wordNumber}</HighlightedText>{' '}
                    个单词，纠正了 <HighlightedText>{sumWrongCount}</HighlightedText> 次错误输入。
                  </p>
                  <p>
                    过去 <HighlightedText>{dayFromFirstWord}</HighlightedText> 天里，Qwerty Learner 一直在陪你练习打字、记忆单词和巩固拼写。
                    如果它确实帮到了你，欢迎支持这个项目继续维护下去。
                  </p>
                </Dialog.Description>
              </div>

              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <div className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                  赞助渠道
                </div>
                <DonatingCard />
              </div>
            </div>
          </div>

          <div className="relative flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8 dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-800 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={onRemindMeLater}
            >
              下次再说
            </button>
            <button
              type="button"
              className="inline-flex h-11 min-w-[10rem] items-center justify-center rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              onClick={onHasDonated}
            >
              我已支持
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
