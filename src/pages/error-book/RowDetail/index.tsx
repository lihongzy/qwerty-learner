import { LoadingWordUI } from '../LoadingWordUI'
import useGetWord from '../hooks/useGetWord'
import { currentRowDetailAtom } from '../store'
import type { groupedWordRecords } from '../type'
import DataTag from './DataTag'
import RowPagination from './RowPagination'
import type { WordPronunciationIconRef } from '@/shared/components/WordPronunciationIcon'
import { WordPronunciationIcon } from '@/shared/components/WordPronunciationIcon'
import { Letter, Phonetic } from '@/shared/components/word-display'
import { idDictionaryMap } from '@/shared/resources/dictionary'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import HashtagIcon from '~icons/heroicons/chart-pie-20-solid'
import CheckCircle from '~icons/heroicons/check-circle-20-solid'
import ClockIcon from '~icons/heroicons/clock-20-solid'
import XCircle from '~icons/heroicons/x-circle-20-solid'
import IconX from '~icons/tabler/x'

type RowDetailProps = {
  currentRowDetail: groupedWordRecords
  allRecords: groupedWordRecords[]
}

const RowDetail: React.FC<RowDetailProps> = ({ currentRowDetail, allRecords }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)

  const dictInfo = idDictionaryMap[currentRowDetail.dict]
  const { word, isLoading, hasError } = useGetWord(currentRowDetail.word, dictInfo)
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)

  const rowDetailData: RowDetailData = useMemo(() => {
    const time =
      currentRowDetail.records.length > 0
        ? currentRowDetail.records.reduce((acc, cur) => acc + cur.totalTime, 0) / currentRowDetail.records.length
        : 0
    const timeStr = `${(time / 1000).toFixed(2)}s`
    const correctCount = currentRowDetail.records.length
    const wrongCount = currentRowDetail.wrongCount
    const sumCount = correctCount + wrongCount
    return { time: timeStr, sumCount, correctCount, wrongCount }
  }, [currentRowDetail.records, currentRowDetail.wrongCount])

  const onClose = useCallback(() => {
    setCurrentRowDetail(null)
  }, [setCurrentRowDetail])

  useHotkeys(
    'esc',
    (e) => {
      onClose()
      e.stopPropagation()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'ctrl+j',
    () => {
      wordPronunciationIconRef.current?.play()
    },
    [],
    { enableOnFormTags: true, preventDefault: true },
  )

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md" onClick={onClose} />
      <div className="my-panel-strong relative z-10 flex w-full max-w-3xl flex-col overflow-hidden px-5 py-6 sm:px-6">
        <button
          type="button"
          className="my-focus-ring absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)] text-[var(--text-muted)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--text-strong)]"
          onClick={onClose}
        >
          <IconX className="h-5 w-5" />
        </button>

        <div className="pr-12">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">Word Detail</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">错词详情</h2>
        </div>

        <div className="mt-8 flex flex-col items-center justify-start">
          <div className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[2rem] font-semibold tracking-tight text-[var(--text-strong)]">
            {currentRowDetail.word.split('').map((char, index) => (
              <Letter key={`${index}-${char}`} letter={char} visible state="normal" />
            ))}
          </div>
          <div className="relative mt-3 flex min-h-8 items-center">
            {word ? <Phonetic word={word} /> : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            {word && (
              <WordPronunciationIcon
                lang={dictInfo.language}
                word={word}
                className="absolute -right-7 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                ref={wordPronunciationIconRef}
              />
            )}
          </div>
          <div className="mt-4 flex max-w-2xl items-center">
            <span className="text-center text-base leading-7 text-[var(--text-muted)]">
              {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <DataTag icon={ClockIcon} name="平均用时" data={rowDetailData.time} />
          <DataTag icon={HashtagIcon} name="练习次数" data={rowDetailData.sumCount} />
          <DataTag icon={CheckCircle} name="正确次数" data={rowDetailData.correctCount} />
          <DataTag icon={XCircle} name="错误次数" data={rowDetailData.wrongCount} />
        </div>

        <RowPagination className="mt-6 self-center" allRecords={allRecords} />
      </div>
    </div>
  )
}

type RowDetailData = {
  time: string
  sumCount: number
  correctCount: number
  wrongCount: number
}

export default RowDetail
