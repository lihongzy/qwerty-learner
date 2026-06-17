import { RESULT_SCREEN_COPY } from '../copy'
import { ConclusionBar, WordChip } from './ResultScreenParts'
import type { WordWithIndex } from '@/shared/types'

type ResultScreenReviewPanelProps = {
  wrongWords: WordWithIndex[]
  mistakeLevel: number
}

export function ResultScreenReviewPanel({ wrongWords, mistakeLevel }: ResultScreenReviewPanelProps) {
  return (
    <section className="border-border-main bg-bg-elevated min-h-0 rounded-[1.5rem] border p-3.5">
      <div className="flex h-full min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-text-strong text-[1.6rem] font-semibold tracking-tight">
              {wrongWords.length > 0 ? RESULT_SCREEN_COPY.mistakeReviewTitle : RESULT_SCREEN_COPY.zeroMistakeTitle}
            </div>
          </div>
          <div className="border-border-main bg-bg-panel text-text-muted rounded-full border px-3 py-1 text-[0.78rem] font-medium">
            {RESULT_SCREEN_COPY.totalMistakesLabel.replace('{count}', String(wrongWords.length))}
          </div>
        </div>

        {wrongWords.length > 0 ? (
          <div className="border-border-main bg-bg-panel min-h-0 flex-1 overflow-y-auto rounded-[1.2rem] border p-3">
            <div className="flex flex-wrap items-start justify-start gap-3">
              {wrongWords.map((word, index) => (
                <WordChip key={`${index}-${word.name}`} word={word} />
              ))}
            </div>
          </div>
        ) : (
          <div className="border-accent-primary bg-bg-panel flex min-h-0 flex-1 items-center justify-center rounded-[1.2rem] border border-dashed px-6 text-center">
            <div className="max-w-xl">
              <div className="text-accent-primary text-[0.74rem] font-semibold uppercase tracking-[0.28em]">
                {RESULT_SCREEN_COPY.perfectRun}
              </div>
              <div className="text-text-strong mt-2.5 text-[2.6rem] font-semibold tracking-tight">
                {RESULT_SCREEN_COPY.zeroMistakeCount}
              </div>
              <p className="text-text-muted mt-2.5 text-[0.95rem] leading-7">
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
