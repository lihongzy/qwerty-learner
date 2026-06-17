import type { ReactNode } from 'react';
import { DonatingCard } from '@/shared/components/DonatingCard';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Trophy } from 'lucide-react';

type DonateMilestoneDialogProps = {
  chapterNumber: number;
  dayFromFirstWord: number;
  wordNumber: number;
  sumWrongCount: number;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

function HighlightedText({ children }: { children: ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-slate-200 py-2 last:border-b-0 sm:border-r sm:border-b-0 sm:px-3 sm:last:border-r-0 dark:border-slate-800">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-100">{value}</div>
    </div>
  );
}

export function DonateMilestoneDialog({
  chapterNumber,
  dayFromFirstWord,
  wordNumber,
  sumWrongCount,
  open,
  onOpenChange,
}: DonateMilestoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="flex items-center gap-2 px-5 pt-5 text-xl font-semibold text-slate-900 sm:px-6 sm:pt-6 sm:text-2xl dark:text-slate-100">
          <Trophy className="h-5 w-5" />
          里程碑达成
        </DialogTitle>

        <div className="flex flex-col gap-6 overflow-y-auto px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
          <div className="min-w-0 space-y-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              已完成 <span className="font-semibold text-slate-900 dark:text-slate-100">{chapterNumber}</span> 个章节
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 sm:grid sm:grid-cols-3 sm:bg-transparent sm:px-0 dark:border-slate-800 dark:bg-slate-950 sm:dark:bg-transparent">
              <MetricCard label="坚持天数" value={dayFromFirstWord} />
              <MetricCard label="练习单词" value={wordNumber} />
              <MetricCard label="纠错次数" value={sumWrongCount} />
            </div>

            <DialogDescription className="space-y-4 text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-300">
              <p>
                你已经完成了 <HighlightedText>{chapterNumber}</HighlightedText> 个章节，在 Qwerty Learner 坚持了{' '}
                <HighlightedText>{dayFromFirstWord}</HighlightedText> 天，累计练习了{' '}
                <HighlightedText>{wordNumber}</HighlightedText> 个单词，纠正了{' '}
                <HighlightedText>{sumWrongCount}</HighlightedText> 次错误输入。
              </p>
              <p>
                过去 <HighlightedText>{dayFromFirstWord}</HighlightedText> 天里，Qwerty Learner
                一直在陪你练习打字、记忆单词和巩固拼写。 如果它确实帮到了你，欢迎支持这个项目继续维护下去。
              </p>
            </DialogDescription>
          </div>

          <section className="w-full border-t border-slate-200 pt-4 dark:border-slate-800" aria-label="赞助渠道">
            <DonatingCard />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
