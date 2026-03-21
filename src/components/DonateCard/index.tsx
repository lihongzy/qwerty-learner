import { Transition, Dialog, TransitionChild, DialogBackdrop, DialogPanel } from '@headlessui/react'

import React, { useLayoutEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconParty from '~icons/logos/partytown-icon'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './hooks/useWordStats'
import { DonatingCard } from '../DonatingCard'
import dayjs from 'dayjs'
import { DONATE_DATE } from '@/constants'

export const DonateCard = () => {
  const [show, setShow] = useState(true)

  const chapterNumber = useChapterNumber()
  const dayFromFirstWord = useDayFromFirstWordRecord()
  const wordNumber = useWordNumber()
  const sumWrongCount = useSumWrongCount()

  const onClickHasDonated = () => {
    setShow(false)
    const now = dayjs()
    window.localStorage.setItem(DONATE_DATE, now.format())
  }

  const onClickRemindMeLater = () => {
    setShow(false)
  }

  const HighlightedText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`font-bold ${className ? className : 'text-indigo-500'}`}>{children}</span>
  )

  useLayoutEffect(() => {
    // 只有完成章节数是 10 的倍数时才触发（如 10, 20, 30...）
    if (chapterNumber && chapterNumber !== 0 && chapterNumber % 10 === 0) {
      // 从本地存储获取上次显示弹窗的日期
      const storedDate = window.localStorage.getItem(DONATE_DATE)
      // 将存储的日期转换为 dayjs 对象
      const date = dayjs(storedDate)
      // 获取当前时间
      const now = dayjs()
      // 计算距离上次显示过了多少天
      const diff = now.diff(date, 'day')

      // 如果没有记录过，或者距离上次显示超过 60 天，则显示弹窗
      if (!storedDate || diff > 60) {
        setShow(true)
      }
    }
  }, [chapterNumber])

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={
                  'relative my-8 w-148 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all select-text'
                }
              >
                <div className="flex w-full flex-col justify-center gap-4 bg-white px-2 pt-5 pb-4 dark:bg-gray-800 dark:text-gray-300">
                  <h1 className="gradient-text w-full pt-3 text-center text-[2.4rem] font-bold">{`${chapterNumber} Chapters Achievement !`}</h1>
                  <div className="flex w-full flex-col gap-4 px-4">
                    <p className="mx-auto px-4 indent-4">
                      您刚刚完成了<HighlightedText>{chapterNumber}</HighlightedText>章节的练习，Qwerty Learner 已经陪你走过
                      <HighlightedText>{dayFromFirstWord}</HighlightedText>天，一起完成了
                      <HighlightedText>{wordNumber}</HighlightedText>
                      词的练习，帮助您纠正了<HighlightedText>{sumWrongCount}</HighlightedText>次错误输入，让我们一起为您的进步欢呼
                      <IconParty className="ml-2 inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <br />
                    </p>
                    <p className="mx-auto px-4 indent-4">
                      Qwerty Learner 陪伴您 <HighlightedText>{dayFromFirstWord}</HighlightedText>{' '}
                      天，一直致力于为所有学习者提供高效、便捷的打字练习环境。您的支持将帮助 Qwerty 持续为您提供优质服务，与您一起成长。
                    </p>
                    <p className="mx-auto px-4 indent-4">感谢您的慷慨，您的每一份支持都将帮助 Qwerty 做得更好。</p>
                  </div>
                </div>

                <DonatingCard />
                <div className="flex w-full justify-between px-14 pt-0 pb-3">
                  <button
                    type="button"
                    className="my-btn-primary w-36 font-medium"
                    onClick={onClickHasDonated}
                  >
                    我已捐赠
                  </button>
                  <button type="button" className="my-btn-primary w-36 font-medium" onClick={onClickRemindMeLater}>
                    之后提醒我
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
