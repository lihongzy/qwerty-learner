import { Transition, Dialog, TransitionChild, DialogBackdrop, DialogPanel } from '@headlessui/react'

import React, { useLayoutEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconParty from '~icons/logos/partytown-icon'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './useWordStats'
import { DonatingCard } from '@/shared/components/DonatingCard'
import dayjs from 'dayjs'
import { DONATE_DATE } from '@/shared/constants'

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
                <div className="flex w-full flex-col justify-center gap-4 bg-white px-2 pb-4 pt-5 dark:bg-gray-800 dark:text-gray-300">
                  <h1 className="gradient-text w-full pt-3 text-center text-[2.4rem] font-bold">{`??? ${chapterNumber} ???`}</h1>
                  <div className="flex w-full flex-col gap-4 px-4">
                    <p className="mx-auto px-4 indent-4">
                      ?????? <HighlightedText>{chapterNumber}</HighlightedText> ???????Qwerty Learner ??????
                      <HighlightedText>{dayFromFirstWord}</HighlightedText> ???????
                      <HighlightedText>{wordNumber}</HighlightedText>
                      ????????????? <HighlightedText>{sumWrongCount}</HighlightedText> ???????????????????
                      <IconParty className="ml-2 inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <br />
                    </p>
                    <p className="mx-auto px-4 indent-4">
                      ???? <HighlightedText>{dayFromFirstWord}</HighlightedText> ???Qwerty Learner ?????????????????????????????????????????????????
                    </p>
                    <p className="mx-auto px-4 indent-4">?????????????????? Qwerty Learner ?????</p>
                  </div>
                </div>

                <DonatingCard />
                <div className="flex w-full justify-between px-14 pb-3 pt-0">
                  <button
                    type="button"
                    className="my-btn-primary w-36 font-medium"
                    onClick={onClickHasDonated}
                  >
                    ????
                  </button>
                  <button type="button" className="my-btn-primary w-36 font-medium" onClick={onClickRemindMeLater}>
                    ??????
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
