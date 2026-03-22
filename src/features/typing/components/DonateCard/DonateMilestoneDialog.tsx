import type { ReactNode } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { DonatingCard } from '@/shared/components/DonatingCard'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/shared/ui/dialog'

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
    <div className="border-b border-slate-200 py-2 last:border-b-0 dark:border-slate-800 sm:border-b-0 sm:border-r sm:px-3 sm:last:border-r-0">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-950 dark:text-cyan-50">{value}</div>
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
    <Dialog open={open}>
      <DialogContent
        className="h-[calc(100vh-2rem)] w-[min(68rem,calc(100vw-2rem))] max-w-none rounded-2xl border-slate-200 bg-white p-0 shadow-[0_28px_90px_rgba(148,163,184,0.28)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_36px_120px_rgba(0,0,0,0.72)]"
        showCloseButton={false}
        // This prompt is milestone-driven, so close it only through explicit actions.
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.35)] dark:bg-cyan-400 dark:shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
              里程碑达成
            </div>
          </div>

          <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5">
                <div className="flex flex-col gap-6">
                  <div className="min-w-0 space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-600">练习总结</p>
                      <DialogTitle className="max-w-2xl text-xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                        已完成 <span className="text-cyan-700 dark:text-cyan-300">{chapterNumber}</span> 个章节
                      </DialogTitle>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 sm:grid sm:grid-cols-3 sm:bg-transparent sm:px-0 dark:border-slate-800 dark:bg-slate-950 sm:dark:bg-transparent">
                      <MetricCard label="坚持天数" value={dayFromFirstWord} />
                      <MetricCard label="练习单词" value={wordNumber} />
                      <MetricCard label="纠错次数" value={sumWrongCount} />
                    </div>

                    <DialogDescription className="space-y-4 text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-300">
                      <p>
                        你已经完成了 <HighlightedText>{chapterNumber}</HighlightedText> 个章节，在 Qwerty Learner 坚持了{' '}
                        <HighlightedText>{dayFromFirstWord}</HighlightedText> 天，累计练习了 <HighlightedText>{wordNumber}</HighlightedText>{' '}
                        个单词，纠正了 <HighlightedText>{sumWrongCount}</HighlightedText> 次错误输入。
                      </p>
                      <p>
                        过去 <HighlightedText>{dayFromFirstWord}</HighlightedText> 天里，Qwerty Learner 一直在陪你练习打字、记忆单词和巩固拼写。
                        如果它确实帮到了你，欢迎支持这个项目继续维护下去。
                      </p>
                    </DialogDescription>
                  </div>

                  <section className="w-full border-t border-slate-200 pt-4 dark:border-slate-800" aria-label="赞助渠道">
                    <DonatingCard />
                  </section>

                  <DialogFooter className="mt-6 px-6 pb-1 sm:px-8">
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
                  </DialogFooter>
                </div>
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="flex w-2.5 touch-none select-none p-0.5" orientation="vertical">
              <ScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </DialogContent>
    </Dialog>
  )
}
