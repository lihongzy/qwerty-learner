import type { TErrorWordData } from './hooks/useErrorWords'
import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/shared/state'
import type { Dictionary } from '@/typings/resource'
import { generateNewWordReviewRecord, useGetLatestReviewRecord } from '@/shared/lib/db/review-record'
import * as Progress from '@radix-ui/react-progress'
import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router'
import MdiRobotAngry from '~icons/mdi/robot-angry'

function timeStamp2String(timeStamp: number) {
  return new Date(timeStamp * 1000).toLocaleString('zh-CN', { hour12: false })
}

const buttonClassName =
  'rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'

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
    <div className="flex h-full flex-col items-center justify-around px-20 md:px-40">
      <div className="max-w-2xl">
        <MdiRobotAngry fontSize={30} className="mb-4 text-indigo-300" />
        <blockquote>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            我们会根据该词典里的历史练习数据、错误次数和最近练习时间，生成一组复习列表。
            <br />
            当前生成规则仍在迭代中，后续会继续优化。
          </p>
        </blockquote>
      </div>
      <div className="flex w-full max-w-2xl flex-col items-center">
        {latestReviewRecord ? (
          <>
            <div className="ml-10 flex w-full items-center py-0">
              <Progress.Root
                value={latestReviewRecord.index + 1}
                max={latestReviewRecord.words.length}
                className="mr-4 h-2 w-full rounded-full border border-indigo-400 bg-white"
              >
                <Progress.Indicator
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `calc(${((latestReviewRecord.index + 1) / latestReviewRecord.words.length) * 100}% )` }}
                />
              </Progress.Root>
              <span className="p-0 text-xs">
                {latestReviewRecord.index + 1}/{latestReviewRecord.words.length}
              </span>
            </div>
            <div className="mt-1 text-sm font-normal text-gray-500">{`( 创建于 ${timeStamp2String(latestReviewRecord.createTime)} )`}</div>
          </>
        ) : (
          <div>当前词典错词数: {errorData.length}</div>
        )}

        <div className="mt-6 flex gap-10">
          {latestReviewRecord && (
            <button type="button" className={buttonClassName} onClick={continueReview}>
              继续当前进度
            </button>
          )}
          <button type="button" className={buttonClassName} onClick={() => void startReview()} disabled={errorData.length === 0}>
            开始{latestReviewRecord ? '新的' : ''}复习
          </button>
        </div>
      </div>
    </div>
  )
}
