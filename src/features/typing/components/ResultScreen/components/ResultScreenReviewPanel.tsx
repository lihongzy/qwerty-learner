import { RESULT_SCREEN_COPY } from '../copy'
import { ConclusionBar, WordChip } from './ResultScreenParts'
import type { WordWithIndex } from '@/shared/types'

type ResultScreenReviewPanelProps = {
  wrongWords: WordWithIndex[]
  mistakeLevel: number
}

export function ResultScreenReviewPanel({ wrongWords, mistakeLevel }: ResultScreenReviewPanelProps) {
  return (
    <section className="min-h-0 rounded-[1.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(240,249,255,0.72),rgba(248,250,252,0.96))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(7,14,24,0.96))]">
      <div className="flex h-full min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              {RESULT_SCREEN_COPY.mistakeReview}
            </div>
            <div className="mt-1 text-[1.75rem] font-semibold tracking-tight text-slate-950 dark:text-white">
              {wrongWords.length > 0 ? RESULT_SCREEN_COPY.mistakeReviewTitle : RESULT_SCREEN_COPY.zeroMistakeTitle}
            </div>
          </div>
          <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[0.78rem] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            {RESULT_SCREEN_COPY.totalMistakesLabel.replace('{count}', String(wrongWords.length))}
          </div>
        </div>

        {wrongWords.length > 0 ? (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.2rem] border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-950/38">
            <div className="flex flex-wrap items-start justify-start gap-3">
              {wrongWords.map((word, index) => (
                <WordChip key={`${index}-${word.name}`} word={word} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-[1.2rem] border border-dashed border-cyan-200/80 bg-white/60 px-6 text-center dark:border-cyan-500/20 dark:bg-slate-950/38">
            <div className="max-w-xl">
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
                {RESULT_SCREEN_COPY.perfectRun}
              </div>
              <div className="mt-2.5 text-[2.6rem] font-semibold tracking-tight text-slate-950 dark:text-white">
                {RESULT_SCREEN_COPY.zeroMistakeCount}
              </div>
              <p className="mt-2.5 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
                {RESULT_SCREEN_COPY.zeroMistakeDescription}
              </p>
            </div>
          </div>
        )}

        <ConclusionBar mistakeLevel={mistakeLevel} mistakeCount={wrongWords.length} />
      </div>
    </section>
  )
}
