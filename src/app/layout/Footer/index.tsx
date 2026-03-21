import { useCallback } from 'react'
import { useAtom } from 'jotai'

import IconCoffee from '~icons/mdi/coffee'
import IconGitHub from '~icons/mdi/github'
import IconTwitter from '~icons/mdi/twitter'

import { infoPanelStateAtom } from '@/app/state'
import { InfoPanelType } from '@/typings'
import { InfoPanel } from '@/shared/components/InfoPanel'
import { DonatingCard } from '@/shared/components/DonatingCard'

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
        title="???????"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="indent-4 text-sm text-gray-500">
          ????? Qwerty Learner????????????????????????????????????????
          <br />
          ????????????????????????
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          ???????????? Qwerty Learner ??????????????????????????????
        </p>
        <br />
        <DonatingCard />
      </InfoPanel>

      <footer className="mt-4 mb-1 flex items-center justify-center gap-2.5 text-sm ease-in">
        <a href="https://github.com/lihongzy/qwerty-learner" target="_blank" rel="noreferrer" aria-label="?? GitHub ????">
          <IconGitHub className="text-gray-500 hover:text-gray-800" />
        </a>

        <a href="https://x.com/lihongzy6" target="_blank" title="?? X ??" rel="noreferrer">
          <IconTwitter className="text-gray-500 hover:text-[#1DA1F2]" />
        </a>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            ;(handleOpenInfoPanel('donate'), e.currentTarget.blur)
          }}
          aria-label="??????"
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
