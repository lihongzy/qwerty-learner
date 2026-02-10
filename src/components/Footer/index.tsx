import { useCallback } from 'react'
import { useAtom } from 'jotai'

import IconCoffee from '~icons/mdi/coffee'
import IconGitHub from '~icons/mdi/github'
import IconTwitter from '~icons/mdi/twitter'

import { infoPanelStateAtom } from '@/store'
import { InfoPanelType } from '@/typings'
import { InfoPanel } from '../InfoPanel'
import { DonatingCard } from '../DonatingCard'

export const Footer = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )
  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="Buy us a coffee"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="indent-4 text-sm text-gray-500">
          非常感谢大家使用 Qwerty Learner。本项目目前仍处于学习与完善阶段，为了持续为大家提供更优质的体验，我们需要您的支持。
          <br />
          您的捐赠将用于改进功能与设计，并持续提升用户体验。
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          我们相信，凝聚大家的力量可以让 Qwerty Learner 成为更好的学习平台，也相信您的支持会成为我们持续前进的动力。感谢您的支持！
        </p>
        <br />
        <DonatingCard />
      </InfoPanel>

      <footer className="mt-4 mb-1 flex items-center justify-center gap-2.5 text-sm ease-in">
        <a href="https://github.com/lihongzy/qwerty-learner" target="_blank" rel="noreferrer" aria-label="前往 GitHub 项目主页">
          <IconGitHub className="text-gray-500 hover:text-gray-800" />
        </a>

        <a href="https://x.com/lihongzy6" target="_blank" title="x" rel="noreferrer">
          <IconTwitter className="text-gray-500 hover:text-[#1DA1F2]" />
        </a>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            ;(handleOpenInfoPanel('donate'), e.currentTarget.blur)
          }}
          aria-label="考虑捐赠我们"
        >
          <IconCoffee className="text-gray-500 hover:text-amber-500" />
        </button>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Qwerty Learner
        </button>
      </footer>
    </>
  )
}
