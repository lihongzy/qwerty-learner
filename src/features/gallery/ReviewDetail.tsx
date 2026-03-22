import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/shared/state'
import { generateNewWordReviewRecord, useGetLatestReviewRecord } from '@/shared/lib/db/review-record'
import type { Dictionary } from '@/shared/types/resource'
import * as Progress from '@radix-ui/react-progress'
import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router'
import MdiRobotAngry from '~icons/mdi/robot-angry'
import type { TErrorWordData } from './hooks/useErrorWords'

function timeStamp2String(timeStamp: number) {
  return new Date(timeStamp * 1000).toLocaleString('zh-CN', { hour12: false })
}

export function ReviewDetail({ errorData, dict }: { errorData: TErrorWordData[]; dict: Dictionary }) {
  const latestReviewRecord = useGetLatestReviewRecord(dict.id)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const setCurrentDictId = useSetAtom(currentDictIdAtom)
  const navigate = useNavigate()
  const setCurrentChapter = useSetAtom(currentChapterAtom)

  const startReview = async () => {
    setCurrentDictId(dict.id)
    setCurrentChapter(-1)

    const record = await generateNewWordReviewRecord(dict.id, errorData)
    setReviewModeInfo({ isReviewMode: true, reviewRecord: record })
    navigate('/')
  }

  const continueReview = () => {
    if (!latestReviewRecord) {
      return
    }

    setCurrentDictId(dict.id)
    setCurrentChapter(-1)
    setReviewModeInfo({ isReviewMode: true, reviewRecord: latestReviewRecord })
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col items-center justify-around px-6 py-6 md:px-14">
      <div className="max-w-2xl text-center">
        <MdiRobotAngry fontSize={30} className="mx-auto mb-4 text-[var(--accent-warn)]" />
        <blockquote className="text-base leading-7 text-[var(--text-muted)]">
          复习模式会把当前词库里输错过的单词重新整理出来，方便你集中补练。
          <br />
          最适合在一轮正常练习结束后立刻使用，先把高频错误快速清掉。
        </blockquote>
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center">
        {latestReviewRecord ? (
          <>
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>上次复习进度</span>
                <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace]">
                  {latestReviewRecord.index + 1}/{latestReviewRecord.words.length}
                </span>
              </div>
              <Progress.Root
                value={latestReviewRecord.index + 1}
                max={latestReviewRecord.words.length}
                className="h-2 w-full overflow-hidden rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)]"
              >
                <Progress.Indicator
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-cool))]"
                  style={{ width: `calc(${((latestReviewRecord.index + 1) / latestReviewRecord.words.length) * 100}% )` }}
                />
              </Progress.Root>
            </div>
            <div className="mt-2 text-sm text-[var(--text-muted)]">{`上次复习进度? ${timeStamp2String(latestReviewRecord.createTime)}`}</div>
          </>
        ) : (
          <div className="text-sm text-[var(--text-muted)]">{`当前有 ${errorData.length} 上次复习进度??`}</div>
        )}

        <div className="mt-6 flex gap-4">
          {latestReviewRecord && (
            <button type="button" className="my-btn-secondary my-focus-ring" onClick={continueReview}>
              继续复习
            </button>
          )}
          <button type="button" className="my-btn-primary my-focus-ring" onClick={() => void startReview()} disabled={errorData.length === 0}>
            {latestReviewRecord ? '上次复习进度' : '继续复习'}
          </button>
        </div>
      </div>
    </div>
  )
}
