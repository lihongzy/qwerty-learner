import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import dayjs from 'dayjs'
import React, { useLayoutEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconParty from '~icons/logos/partytown-icon'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './useWordStats'
import { DONATE_DATE } from '@/shared/constants'
import { DonatingCard } from '@/shared/components/DonatingCard'

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
    <span className={`font-bold ${className ?? 'text-indigo-500'}`}>{children}</span>
  )

  useLayoutEffect(() => {
    if (chapterNumber && chapterNumber !== 0 && chapterNumber % 10 === 0) {
      const storedDate = window.localStorage.getItem(DONATE_DATE)
      const date = dayjs(storedDate)
      const now = dayjs()
      const diff = now.diff(date, 'day')

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
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative my-8 w-148 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all select-text">
                <div className="flex w-full flex-col justify-center gap-4 bg-white px-2 pb-4 pt-5 dark:bg-gray-800 dark:text-gray-300">
                  <h1
                    className="w-full bg-[linear-gradient(90deg,#c85d23_0%,#ef9c52_48%,#3f6f78_100%)] bg-clip-text pt-3 text-center text-[2.4rem] font-bold text-transparent [animation:gradient-text-hue_10s_linear_infinite]"
                  >
                    {`已完成 ${chapterNumber} 个章节`}
                  </h1>
                  <div className="flex w-full flex-col gap-4 px-4">
                    <p className="mx-auto px-4 indent-4">
                      你已经完成了 <HighlightedText>{chapterNumber}</HighlightedText> 个章节，在 Qwerty Learner 坚持了
                      <HighlightedText>{dayFromFirstWord}</HighlightedText> 天，累计练习了
                      <HighlightedText>{wordNumber}</HighlightedText> 个单词，纠正了
                      <HighlightedText>{sumWrongCount}</HighlightedText> 次错误输入。这个进度已经相当不错了。
                      <IconParty className="ml-2 inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                    </p>
                    <p className="mx-auto px-4 indent-4">
                      过去 <HighlightedText>{dayFromFirstWord}</HighlightedText> 天里，Qwerty Learner 一直在陪你练习打字、记忆单词和巩固拼写，希望它确实帮到了你。
                    </p>
                    <p className="mx-auto px-4 indent-4">如果这个项目对你有帮助，欢迎支持 Qwerty Learner 的持续维护。</p>
                  </div>
                </div>

                <DonatingCard />
                <div className="flex w-full justify-between px-14 pb-3 pt-0">
                  <button
                    type="button"
                    className="my-btn-primary w-36 font-medium"
                    onClick={onClickHasDonated}
                  >
                    我已支持
                  </button>
                  <button type="button" className="my-btn-primary w-36 font-medium" onClick={onClickRemindMeLater}>
                    下次再说
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
